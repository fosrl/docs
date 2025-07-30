# Overview

Badger is a middleware plugin designed to work with the Traefik reverse proxy in conjunction with [Pangolin](https://github.com/fosrl/pangolin), a multi-tenant tunneled reverse proxy server and management interface with identity and access management. Badger acts as an authentication bouncer, ensuring only authenticated and authorized requests are allowed through the proxy.

This plugin is **required** to be configured alongside [Pangolin](https://github.com/fosrl/pangolin) to enforce secure authentication and session management.

## Installation

Learn more on how to set up [Pangolin](https://github.com/fosrl/pangolin) and Badger in the [Pangolin Documentation](https://github.com/fosrl/pangolin).

### Via Traefiks static config file
```yaml
experimental:
  plugins:
    badger:
      modulename: github.com/fosrl/badger
      version: v1.2.0
```
More info on configuration of Traefig plugins are available, [here](https://plugins.traefik.io/install)

### Via docker commands
```yaml
    command:
      - "--experimental.plugins.badger.modulename=github.com/fosrl/badger"
      - "--experimental.plugins.badger.version=v1.2.0"
```

## Configuration

Badger requires the following configuration parameters to be specified in your [Traefik configuration file](https://doc.traefik.io/traefik/getting-started/configuration-overview/).  
These coincide with the separate [Pangolin](https://github.com/fosrl/pangolin) configuration file.

### Configuration Options
_**Important:** The below code block will be inserted by Pangolin into Traefiks config automatically, assuming the plugin for Badger has been correctly installed (check Traefik's log/stdout).  
You do not need to add, nor will you see, the below in your Traefik configuration. It is here as reference only._

```yaml
apiBaseUrl: "http://localhost:3001/api/v1"
userSessionCookieName: "session"
resourceSessionCookieName: "resource_session"
accessTokenQueryParam: "p_token"
```
