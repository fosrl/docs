# DNS & Networking

:::note

You will not need to open any ports on your private (the network running Newt) network. All traffic is sent through the the tunnel. Therefore, you only need to open ports on the VPS running Pangolin.

:::

Some notes about how to set up key parts of the networking in this project are below. This is not a comprehensive guide to networking, but should help you get started.

## DNS

:::note

Sometimes you need to be patient with your DNS service provider. Once you make this change in their portal they need to propagate the change across all of the major DNS servers that run the internet and this can take some time depending on how on the ball your provider is. This can take anywhere from a couple of minutes to hours. It can be a good idea to make sure the DNS of your computer is pointing to Google's DNS `8.8.8.8` or the DNS of your provider if you are impatient.

:::

In your DNS service you will want to create A (or AAAA for IPv6) records pointing at your VPS hosting Pangolin.

### Wildcards

You will need a wildcard subdomain for each level you want to create and you can not have more than one in a row for many providers. So if you wanted your resource's domain to be `app.example.com`, then you would want `*.example.com`.

If you plan to use a base domain for a resource, you will need to create a separate A record for that domain.

### The Root

If you intend to use the root of your domain, then you will need an additional A record pointing at the IP of your VPS. For example, if you want to use `example.com` as a resource, you will need an A record for `example.com` pointing at your VPS.

## Ports to Expose

When you setup your VPS you want to make sure that you expose the following ports **on the VPS itself**.

### TCP 80

If you are using HTTP SSL verification (default from the installer) then Lets Encrypt will try to reach Traefik on this port to verify the subdomain. Non SSL resources will also use this port.

:::note

If you use wildcard certificates with `DNS-01` verification, you can disable this port. Only the `443` port will be needed.

:::

### TCP 443

The Pangolin web UI and SSL resources use this port to connect with HTTPS.

### UDP 51820

This is the default WireGuard port and is used for Newt and WireGuard clients to connect to Gerbil. If you change this in the config file then you would use that port.

:::warning

Its important to **ONLY** expose the ports you need. Effectively by tunneling out to the VPS you are including the VPS in your security boundary and should consider it part of your network and secure it as such.

:::

## Default Internal Subnet

By default the config defaults to using the bellow settings:

```yaml
gerbil:
    block_size: 24
    site_block_size: 30
    subnet_group: 100.89.137.0/20
```

This means that Gerbil will choose the first /24 subnet in the `100.89.137.0/20` range to operate its network. `100.89.137.0/20` is in the CGNAT range which should avoid overlap with most private networks, but if it does please make sure to change this in your config **before** registering your first Gerbil.

New sites will use a block size of 30. This means that each site gets a /30 within the /24 of the Gerbil exit node. This is enough for 4 IPs (3 unused with newt) which should be good in most cases, but if you are making heavy use of default WireGuard you may want to increase this size.

## Notes on Docker

If you deploy Newt in Docker: `localhost` only refers to stuff inside of the container itself, so if you want to address other things in the Docker environment you need the internal docker IP of that service or the host when setting up your resources.

For "Local" sites running in Docker in the same compose as Pangolin: You usually want to address the host machine. One way to do this is by using the special address: `172.17.0.1`.

## Notes on Cloudflare Proxy

:::warning

As soon as you enable the Cloudflare proxy, you're bound to Cloudflare's terms of service since traffic is routed through their network.

:::

Pangolin can be used with Cloudflare proxy (orange cloud) enabled. Ideally you should [setup wildcard certificates](../03-Pangolin/02-Configuration/03-wildcard-certs.md) with Traefik using the DNS challenge and set Cloudflare to Full (Strict) SSL mode.

Since Cloudflare proxy obscures the destination IP of the host, you will also need to explicitly set your VPS IP address for Gerbil in the `config.yml` file to allow WireGuard to connect to the VPS.

```yaml
gerbil:
    start_port: 51820
    # highlight-next-line
    base_endpoint: "104.21.16.1" # Replace with your VPS IP
```
