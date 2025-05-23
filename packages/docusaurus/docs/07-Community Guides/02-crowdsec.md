# Crowdsec

:::note

This is a community guide and is not officially supported. If you have any issues, please reach out to the [author](https://github.com/Lokowitz).

:::

CrowdSec is a modern, open-source, collaborative behavior detection engine, integrated with a global IP reputation network. It functions as a massively multiplayer firewall, analyzing visitor behavior and responding appropriately to various types of attacks.

## Installation

Crowdsec can be installed using the Pangolin Installer.

## Configuration

By default, Crowdsec is installed with a basic configuration, which includes the [Crowdsec Bouncer Traefik plugin](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin).

### Choose the right logs

#### Syslog

For systems utilizing Syslog, the following volumes should be added to the `docker-compose.yml` file:

```yaml
service:
  crowdsec:
    volumes:
      - /var/log/auth.log:/var/log/auth.log:ro
      - /var/log/syslog:/var/log/syslog:ro
```

Create a `syslog.yaml` file under `/config/crowdsec/acquis.d` with the following content:

```yaml
filenames:
  - /var/log/auth.log
  - /var/log/syslog
labels:
  type: syslog
```

#### Journalctl

To log iptables to journalctl, execute the following command on your host system:

```bash
iptables -A INPUT -j LOG --log-prefix "iptables: "
```

Update the `docker-compose.yml` file as follows:

```yaml
service:
  crowdsec:
    image: crowdsecurity/crowdsec:latest-debian
    environment:
      COLLECTIONS: crowdsecurity/traefik crowdsecurity/appsec-virtual-patching crowdsecurity/appsec-generic-rules crowdsecurity/linux crowdsecurity/iptables
    volumes:
      - ./config/crowdsec:/etc/crowdsec
      - ./config/crowdsec/db:/var/lib/crowdsec/data
      - ./config/traefik/logs:/var/log/traefik:ro
      - /var/log/journal:/var/log/host:ro
```

Create a `journalctl.yaml` file under `/config/crowdsec/acquis.d` with the following content:

```yaml
source: journalctl
journalctl_filter:
  - "--directory=/var/log/host/"
labels:
  type: syslog
```

### Securing the Host System (SSH)

By default, only Traefik requests are secured through the Crowdsec bouncer. To extend protection to your host system (e.g., SSH), follow these steps to add a firewall bouncer:

1. Install the Crowdsec repositories. Refer to the [installation documentation](https://docs.crowdsec.net/docs/next/getting_started/install_crowdsec/#install-our-repositories):

```bash
curl -s https://install.crowdsec.net | sudo sh
```

2. Install the firewall bouncer. For Debian/Ubuntu systems using IPTables, refer to the [documentation](https://docs.crowdsec.net/u/bouncers/firewall/):

```bash
sudo apt install crowdsec-firewall-bouncer-iptables
```

3. Create an API key for the firewall bouncer to communicate with your CrowdSec Docker container. ("vps-firewall" is a placeholder name for the key):

```bash
docker exec -it crowdsec cscli bouncers add vps-firewall
```

4. Copy the dispalyed API key and insert it into the bouncer's configuration file:

```bash
nano /etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml
```

5. Restart the firewall bouncer:

```bash
systemctl restart crowdsec-firewall-bouncer
```

6. Update the `docker-compose.yml` file to expose communication port `8080` for the CrowdSec container and restart the container:

```yaml
service:
  crowdsec:
    ports:
      - 6060:6060 # Metrics port
      - 8080:8080 # Local API port
```
:::warning
Docker’s NAT-based port publishing feature automatically exposes all `ports:` defined in the `docker-compose` file on all network interfaces. This behavior can bypass your host firewall settings, potentially exposing services that you did not intend to make public.
Please see [complete warning about exposing ports](/Getting%20Started/dns-networking#ports-to-expose).
:::

7. Verify communication between the firewall bouncer and the CrowdSec container by running:

```bash
docker exec crowdsec cscli metrics
```

The output should look like this:

```bash
+------------------------------------------------------------------+
| Local API Bouncers Metrics                                       |
+---------------------------+----------------------+--------+------+
| Bouncer                   | Route                | Method | Hits |
+---------------------------+----------------------+--------+------+
| traefik-bouncer           | /v1/decisions/stream | HEAD   | 2    |
| traefik-bouncer@10.0.4.20 | /v1/decisions        | GET    | 3    |
| vps-firewall              | /v1/decisions/stream | GET    | 84   | <---------
+---------------------------+----------------------+--------+------+
```

## Custom Ban Page

To display a custom ban page to attackers, follow these steps:

1. Place a `ban.html` page in the `/config/traefik` directory. If you prefer not to create your own, you can download the official example:

```bash
wget https://raw.githubusercontent.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/refs/heads/main/ban.html
```

2. Update the `/config/traefik/dynamic_config.yml` file to include the following:

```yaml
http:
  middlewares:
    crowdsec:
      plugin:
        crowdsec:
          banHTMLFilePath: /etc/traefik/ban.html
```

## Custom Captcha Page

To use a custom captcha page, follow these steps:

1. Place a `captcha.html` page in the `/config/traefik` directory. If you don't want to create your own, you can download the official example:

```bash
wget https://raw.githubusercontent.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/refs/heads/main/captcha.html
```

2. Update the `/config/traefik/dynamic_config.yml` file with the following configuration, replacing `<SERVICE>` with your captcha provider (MUST BE either `hcaptcha`, `recaptcha`, or `turnstile`), and `<KEY>` with the appropriate site and secret keys:

```yaml
http:
  middlewares:
    crowdsec:
      plugin:
        crowdsec:
          captchaHTMLFilePath: /etc/traefik/captcha.html
          captchaGracePeriodSeconds: 300
          captchaProvider: <SERVICE>
          captchaSiteKey: <KEY>
          captchaSecretKey: <KEY>
```

## Testing

You can test your configuration by adding a temporary ban or captcha for your IP. The ban will last for one minute.

To add a ban:

```bash
docker exec crowdsec cscli decisions add --ip <YOUR IP> -d 1m --type ban
```

To trigger a captcha challenge:

```bash
docker exec crowdsec cscli decisions add --ip <YOUR IP> -d 1m --type captcha
```
