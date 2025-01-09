# DNS & Networking

:::note

You will not need to open any ports on your private (the network running Newt) network. All traffic is sent through the the tunnel. Therefore, you only need to open ports on the VPS running Pangolin.

:::

Some notes about how to set up key parts of the networking in this project are below. This is not a comprehensive guide to networking, but should help you get started.

## DNS

In your DNS service you will want to create A (or AAAA for IPv6) records pointing at your VPS hosting Pangolin.

### Wildcards

Use *

Example: **\*.example.com**

You will need a wildcard subdomain for each level you want to create and you can not have more than one * in a row for many providers. So if you wanted your resources to include a subdomain like "proxy", then you would want *.proxy.example.com.

### The Root

Use @ (or nothing depending on the provider)

Example: **example.com**

If you intend Pangolin to run at the root of your domain - meaning you would access the Pangolin UI from example.com (with no subdomain) - then you will need another A record pointing at the 

:::note

Sometimes you need to be patient with your DNS service provider. Once you make this change in their portal they need to propagate the change across all of the major DNS servers that run the internet and this can take some time depending on how on the ball your provider is. This can take anywhere from a couple of minutes to hours. It can be a good idea to make sure the DNS of your computer is pointing to Google's DNS `8.8.8.8` or the DNS of your provider if you are impatient.

:::

## Ports to Expose 

When you setup your VPS you want to make sure that you expose the following ports **on the VPS itself**.

### TCP 80

If you are using HTTP SSL verification (default from the installer) then Lets Encrypt will try to reach Traefik on this port to verify the subdomain. Non SSL resources will also use this port.

### TCP 443

The Pangolin web UI and SSL resources use this port to connect with HTTPS.

### UDP 51820

This is the default WireGuard port and is used for Newt and WireGuard clients to connect to Gerbil. If you change this in the config file then you would use that port.

:::warning

Its important to **ONLY** expose the ports you need. Effectively by tunneling out to the VPS you are including the VPS in your security boundary and should consider it part of your network and secure it as such.

:::

## Notes on Docker

If you deploy Newt in Docker: "localhost" only refers to stuff inside of the container itself, so if you want to address other things in the Docker environment you need the internal docker IP of that service or the host when setting up your resources.
