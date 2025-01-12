# Without Tunneling

You can use Pangolin without Gerbil and tunneling. In this configuration Pangolin is essentially acting as a reverse proxy and authentication manager and can be deployed on the *local* network in order to provide access to resources. 

All setup remains the same, except Pangolin and Traefik must now be on the same network you want to proxy targets to and you do not need to install Gerbil. 

When Gerbil starts up, it will register itself with Pangolin. By not doing this you will only have the option to choose the "Local" connection method. This will mean that Traefik will use the local network. 

## How to

### Installer

When asked if you want to install Gerbil for tunneling, select no. Gerbil will be removed from the Docker compose.

### Manual

Follow existing manual install steps, but Gerbil is not required. Your Docker compose should look like the below.

```yaml
services:
  pangolin:
    image: fosrl/pangolin:1.0.0-beta.4
    container_name: pangolin
    restart: unless-stopped
    volumes:
      - ./config:/app/config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/"]
      interval: "3s"
      timeout: "3s"
      retries: 5

  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    ports: # added ports to expose from traefik
      - 443:443
      - 80:80
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --configFile=/etc/traefik/traefik_config.yml
    volumes:
      - ./config/traefik:/etc/traefik:ro # Volume to store the Traefik configuration
      - ./config/letsencrypt:/letsencrypt # Volume to store the Let's Encrypt certificates
```