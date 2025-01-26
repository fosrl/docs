import WithoutTunnelingCompose from "@site/src/components/WithoutTunnelingCompose";

# Without Tunneling

You can use Pangolin without Gerbil and tunneling. In this configuration Pangolin is essentially acting as a reverse proxy and authentication manager and can be deployed on the *local* network in order to provide access to resources. 

All setup remains the same, except Pangolin and Traefik must now be on the same network you want to proxy targets to and you do not need to install Gerbil. 

When Gerbil starts up, it will register itself with Pangolin. By not doing this you will only have the option to choose the "Local" connection method. This will mean that Traefik will use the local network. 

## How to

### Installer

When asked if you want to install Gerbil for tunneling, select no. Gerbil will be removed from the Docker compose.

### Manual

Follow existing manual install steps, but Gerbil is not required. Your Docker compose should look like the below.

<WithoutTunnelingCompose />

After first starting the app, make sure to fill out all of your information, like `dashboard_url`, `base_domain`, etc the `config.yml` that was generated for you in the volume.

See all configuration options [here](https://docs.fossorial.io/Pangolin/Configuration/config).
