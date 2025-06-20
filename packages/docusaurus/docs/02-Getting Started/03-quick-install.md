import CodeBlock from '@theme/CodeBlock';
import WgetQuickInstaller from "@site/src/components/WgetQuickInstaller";

# Install

## Prerequisites

- A Linux system with root access and a public IP address
  - We recommend Ubuntu or Debian based systems
- [A domain name pointed to your server's IP address](./02-dns-networking.md)
- [TCP ports 80, 443, and UDP port 51820 exposed to your Linux instance.](./02-dns-networking.md)
  - **Note:** Docker’s NAT-based port publishing feature automatically exposes all `ports:` defined in `docker-compose` file on all network interfaces. This behavior can bypass your host firewall settings, potentially exposing services that you did not intend to make public. Please see [complete warning about exposing ports](/Getting%20Started/dns-networking#ports-to-expose).
- An email address for Let's Encrypt certificate registration
- (Optionally) a SMTP server

## Using a VPS

If you need a VPS to run Pangolin, [RackNerd](https://my.racknerd.com/aff.php?aff=13788) is a great option, and often has generous promotions. More options can be found in our [VPS guide](./01-choosing-a-vps.md).

A good option is [**1 vCPU, 1GB RAM less than $1 a month**](https://my.racknerd.com/aff.php?aff=13788&pid=912).

## Installation Steps

We also have a short and quick [YouTube video](https://youtu.be/W0uVLjTyAn8) showing the install process!

### 1. Downloading and Running the Installer

:::tip

The installer will place all files in the current directory. If you want to install Pangolin in a different directory, you can move the installer to that directory and run it there.

:::

Installer binaries for Linux can be found in the [Github releases](https://github.com/fosrl/pangolin/releases) for ARM and AMD64 (x86_64).

<WgetQuickInstaller />

The downloaded files will be named `installer` in the current directory.

The installer must be run as root. If you're not already root, switch to the root user or use sudo:

```bash
sudo ./installer
```

### 2. Basic Configuration

The installer will prompt you for the following basic information. For example:

1. **Base Domain Name**: Enter your base fully qualified domain name (without any subdomains) Example: `example.com`
2. **Dashboard Domain Name**: The domain where the application will be hosted. This is used for many things, including generating links. You can run Pangolin on a subdomain or root domain. Example: `pangolin.example.com`
3. **Let's Encrypt Email**: Provide an email address for SSL certificate registration with Lets Encrypt. This should be an email you have access to.
4. **Tunneling** You can choose not to install Gerbil for tunneling support - in this config it will just be a normal reverse proxy. See [how to use without tunneling](/03-Pangolin/03-without-tunneling.md).

### 3. Security Settings

It will ask you to configure some basic security options. For example:

1. **Signup Without Invite**: Choose whether to disable user registration without invites (defaults to disabled). This removes the "Sign Up" button on the login form and is recommended for private deployments.
2. **Organization Creation**: Decide if users can create their own organizations (defaults to enabled)

### 4. Email Configuration

Decide whether to enable email functionality. This allows Pangolin to send transactional emails like OTP or email verification requests.

If enabled, you'll need to provide:

- SMTP host
- SMTP port (defaults to 587)
- SMTP username
- SMTP password
- No-reply email address. This is the sender email address that Pangolin will email from. Many times this should be the same as the username.

### 5. Docker Installation

If Docker isn't already installed, the installer will:

1. Detect your Linux distribution
2. Offer to install Docker automatically
3. Install the appropriate version for your distribution

Supported distributions:

- Ubuntu/Debian
- Fedora
- OpenSUSE
- RHEL
- Amazon Linux

### 6. Container Deployment

After configuration, the installer will:

1. Pull the necessary Docker containers
2. Create required directories
3. Generate configuration files
4. Start the containers using Docker Compose

## Post-Installation

After successful installation:

1. Complete the initial admin user setup via the dashboard at `https://<your-domain>/auth/initial-setup`
2. You can log in using the admin email and password you provided
3. Create your first organization, site, and resources

## Notes

- The installer checks for an existing configuration and won't overwrite it if found
- Docker installation is optional if already present
