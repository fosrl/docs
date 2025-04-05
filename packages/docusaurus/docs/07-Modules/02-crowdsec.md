# Crowdsec

CrowdSec is a free, modern & collaborative behavior detection engine, coupled with a global IP reputation network. It is an open-source massively multiplayer firewall that analyzes visitor behavior and provides an adapted response to all kinds of attacks.

## Installation

Crowdsec can be installed with the Pangolin Installer. 

## Configuration

By default Crowdsec is installed with a very basic configuration including the [Crowdsec Bouncer Traefik plugin](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin).

### Choose the right logs

#### Syslog

For systems with Syslog these volumes has to be added in `docker-compose.yml`.
```yaml
service:
  crowdsec:
    volumes:
      - /var/log/auth.log:/var/log/auth.log:ro
      - /var/log/syslog:/var/log/syslog:ro
```

Add a `syslog.yaml` file to `/config/crowdsec/acquis.d` with the following content.
```yaml
filenames:
 - /var/log/auth.log
 - /var/log/syslog
labels:
  type: syslog
```

#### Journalctl

Run `iptables -A INPUT -j LOG --log-prefix "iptables: "` on your host system to log iptables into jounralctl.

Adjusted `docker-compose.yml`.
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

Add a `journalctl.yaml` file to `/config/crowdsec/acquis.d` with the following content.
```yaml
source: journalctl
journalctl_filter: 
  - "--directory=/var/log/host/"
labels:
  type: syslog
```

### Secure host system (SSH)

By defautl only Traefik requests are secured through the crowdsec bouncer. If you also want to protect your host system eg. ssh you have to add a firewall bouncer to your host system.

1. Install the Crowdsec repositories. [Documentation](https://docs.crowdsec.net/docs/next/getting_started/install_crowdsec/#install-our-repositories)
```bash
curl -s https://install.crowdsec.net | sudo sh
```

2. Install the firewall bouncer. [Documentation](https://docs.crowdsec.net/u/bouncers/firewall/)
Just for Debian/Ubuntu using IPTables, see documentation link for other options!
```bash
sudo apt install crowdsec-firewall-bouncer-iptables
```

3. Create an API key for the firewall bouncer to be able to communicate with your crowdsec docker container. ("vps-firewall" can be changed, it is just the name for the key)
```bash
docker exec -it crowdsec cscli bouncers add vps-firewall
```

4. Copy the dispalyed API key and paste it into the bouncer config file.
```bash
nano /etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml
```

5. Restart the firewall bouncer.
```bash
systemctl restart crowdsec-firewall-bouncer
```

6. Add the communication port `8080` to your crowdsec container in `docker-compose.yaml` and restart the crowdsec container.
```yaml
service:
  crowdsec:
    ports:
      - 6060:6060
      - 8080:8080
```

Use `docker exec crowdsec cscli metrics` to verify the working communication between firewall bouncer and crowdsec container, you should see something like this:
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

### Custom ban.html

You can show your attackers a custom ban page. [Documentation](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/tree/main/examples/custom-ban-page)

1. Place a ban.html page in your `/config/traefik` folder. If you don't want to create your own page you can use this official example page.
```bash
wget https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/blob/main/ban.html
```

2. Add the following line to you `/config/traefik/dynamic_config.yml` file.
```yaml
http:
  middlewares:
    crowdsec:
      plugin:
        crowdsec:
          banHTMLFilePath: /etc/traefik/ban.html
```

### Custom captcha.html

To use captcha you have to provide and configure a captcha.html. [Documentation](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/tree/main/examples/captcha)

1. Place a captcha.html page in your `/config/traefik` folder. If you don't want to create your own page you can use this official example page.
```bash
wget https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/blob/main/captcha.html
```

2. Add the following line to you `/config/traefik/dynamic_config.yml` file and replace <...> with your credentials.
```yaml
http:
  middlewares:
    crowdsec:
      plugin:
        crowdsec:
          captchaHTMLFilePath: /etc/traefik/captcha.html
          captchaGracePeriodSeconds: 300
          captchaProvider: <SERVICE> #your service hcaptcha, recaptcha or turnstile
          captchaSiteKey: <KEY>
          captchaSecretKey: <KEY>
```

### Testing

You can test your configuration with the following commands. You will get banned for just 1 minute.
```bash
docker exec crowdsec cscli decisions add --ip <YOUR IP> -d 1m --type ban
```
```bash
docker exec crowdsec cscli decisions add --ip <YOUR IP> -d 1m --type captcha
```
