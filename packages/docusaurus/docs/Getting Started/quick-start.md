# Quick Installation Guide

## Prerequisites

- A Linux system with root access
- A domain name pointed to your server's IP address
- An email address for Let's Encrypt certificate registration

## Installation Steps

### 1. Running the Installer

The installer must be run as root. If you're not already root, switch to the root user or use sudo:

```bash
sudo ./installer
```

### 2. Basic Configuration

The installer will prompt you for the following basic information:

1. **Domain Name**: Enter your fully qualified domain name
2. **Let's Encrypt Email**: Provide an email address for SSL certificate registration

### 3. Admin User Setup

You'll need to configure the admin user:

1. **Admin Email**: Defaults to `admin@yourdomain` but can be customized
2. **Admin Password**: Must meet these requirements:
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one digit
   - At least one special character

### 4. Security Settings

Configure security options:

1. **Signup Without Invite**: Choose whether to disable user registration without invites (defaults to disabled)
2. **Organization Creation**: Decide if users can create their own organizations (defaults to enabled)

### 5. Email Configuration

Decide whether to enable email functionality:

If enabled, you'll need to provide:
- SMTP host
- SMTP port (defaults to 587)
- SMTP username
- SMTP password
- No-reply email address

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
3. Configuration files will be located in the `config/` directory
4. Docker Compose file will be in the root directory as `docker-compose.yml`

## Troubleshooting

Common issues and solutions:

1. **Permission Denied**: Make sure you're running the installer as root
2. **Docker Installation Fails**: Check your internet connection and system compatibility
3. **Container Startup Fails**: Verify that:
   - All required ports are available
   - Docker service is running
   - Your system has enough resources

## Notes

- The installer checks for an existing configuration and won't overwrite it if found
- All inputs have validation to ensure proper formatting
- Docker installation is optional if already present
- The system uses Docker Compose for container orchestration