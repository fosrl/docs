import WithoutTunnelingCompose from "@site/src/components/WithoutTunnelingCompose";

# Without Tunneling

:::note

You can also use "local" sites to expose resources on the same VPS as Pangolin in addition to remote sites.

:::

You can use Pangolin without Gerbil and tunneling. In this configuration Pangolin is essentially acting as a normal reverse proxy and authentication manager and can be deployed on the *local* network in order to provide access to resources.

All setup remains the same, except Pangolin and Traefik must now be on the same network you want to proxy targets to and you do not need to install Gerbil. 

When Gerbil starts up, it will register itself with Pangolin. By not doing this you will only have the option to choose the "Local" connection method. This will mean that Traefik will use the local network. 

## Community Guides

- ["Install and Run Pangolin Locally on your own Server" by Noted (Article)](https://noted.lol/pangolin-local/)

## Using the Installer

When asked if you want to install Gerbil for tunneling, select no. Gerbil will be removed from the Docker compose.

## Manual

Follow existing manual install steps, but Gerbil is not required. Your Docker compose should look like the below.

<WithoutTunnelingCompose />

See all configuration options [here](https://docs.fossorial.io/Pangolin/Configuration/config).
