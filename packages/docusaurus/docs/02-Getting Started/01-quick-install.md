# Install

## Prerequisites

- A Linux system with root access and a public IP address
- A domain name pointed to your server's IP address
- An email address for Let's Encrypt certificate registration
- (Optionally) a SMTP server

## Installation Steps

### 1. Downloading and Running the Installer

Installer binaries for Linux can be found in the [Github releases](https://github.com/fosrl/pangolin/releases) for ARM and AMD64 (x86_64).

For example, on `amd64` download the installer with either wget or curl and make it executable:

```bash
wget -O installer "https://github.com/fosrl/pangolin/releases/download/1.0.0-beta.1/installer_linux_amd64" && chmod +x ./installer
```

```bash
curl -L -o installer "https://github.com/fosrl/pangolin/releases/download/1.0.0-beta.1/installer_linux_amd64" && chmod +x ./installer
```

The installer must be run as root. If you're not already root, switch to the root user or use sudo:

```bash
sudo ./installer
```

### 2. Basic Configuration

The installer will prompt you for the following basic information:

1. **Domain Name**: Enter your fully qualified domain name that you have pointing to this instance
2. **Let's Encrypt Email**: Provide an email address for SSL certificate registration with Lets Encrypt. This should be an email you have access to.

### 3. Admin User Setup

You'll need to configure the admin user. This is the first user in the system. You will log in initially with this user.

1. **Admin Email**: Defaults to `admin@yourdomain.com` but can be customized
2. **Admin Password**: Must meet these requirements:
   - At least 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one digit
   - At least one special character

### 4. Security Settings

Configure security options:

1. **Signup Without Invite**: Choose whether to disable user registration without invites (defaults to disabled). This removes the "Sign Up" button on the login form and is recommended for private deployments.
2. **Organization Creation**: Decide if users can create their own organizations (defaults to enabled)

### 5. Email Configuration

Decide whether to enable email functionality. This allows Pangolin to send transactional emails like OTP or email verification requests.

If enabled, you'll need to provide:
- SMTP host
- SMTP port (defaults to 587)
- SMTP username
- SMTP password
- No-reply email address. This is the sender email address that Pangolin will email from. Many times this should be the same as the username.

### 6. Docker Installation

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

### 7. Container Deployment

After configuration, the installer will:

1. Pull the necessary Docker containers
2. Create required directories:
   - `config/`
   - `config/letsencrypt/`
   - `config/db/`
   - `config/logs/`
3. Generate configuration files
4. Start the containers using Docker Compose

## Post-Installation

After successful installation:

1. The system will be accessible at your configured domain
2. You can log in using the admin email and password you provided

## Notes

- The installer checks for an existing configuration and won't overwrite it if found
- Docker installation is optional if already present
<!-- - You can pull the latest and rerun the install script to update the containers! -->
