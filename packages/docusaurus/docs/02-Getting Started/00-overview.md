# Overview

<h3><a href='https://www.ycombinator.com/launches/O0B-pangolin-open-source-secure-gateway-to-private-networks' target="_blank"><img src='https://www.ycombinator.com/launches/O0B-pangolin-open-source-secure-gateway-to-private-networks/upvote_embed.svg' alt='Launch YC: Pangolin – Open-source secure gateway to private networks'/ ></a></h3>

:::tip

Want to install Pangolin? See our quick install guide [here](https://docs.fossorial.io/Getting%20Started/quick-install).

:::

Pangolin at its core is a self-hosted tunneled reverse proxy with identity and access management, designed to securely expose private resources through encrypted [WireGuard](https://www.WireGuard.com/) tunnels running in user space. Think self hosted Cloudflare tunnels.

Pangolin uses Traefik under the hood to do the actual HTTP proxying. A plugin, Badger, provides a way to authenticate every request with Pangolin. A second service, Gerbil, provides a WireGuard management server that Pangolin can use to create peers for connectivity. And finally, there is Newt, a CLI tool and Docker container that connects back to Newt and Gerbil with WireGuard fully in user space and proxies your local resources. This means that you do not need to run a privileged process or container in order to expose your services!

## Community Videos and Guides

:::note

Note that these guides may be out of date, as the project is still in active development. Please refer to the official documentation for the most up-to-date information.

:::

- "Getting Started with Pangolin" by **Lawrence Systems** [(YouTube)](https://youtu.be/g5qOpxhhS7M?si=wfwJaR9p9cnoriam)
- "Pangolin: Your Own Self-Hosted Cloudflare Tunnel Alternative" by **DB Tech** [(YouTube)](https://youtu.be/fCdrSblVO-0?si=6uKt_rm8hwdIvUyy)
- "Better Than Cloudflare Tunnels? - Pangolin Guide" by **Jim's Garage** [(YouTube)](https://youtu.be/8VdwOL7nYkY?si=2j-7V3CYLPJy7LmB)
- "Pangolin: Self-Host Your Services Securely (All-in-One Solution)" by **LinuxCloudHacks** [(YouTube)](https://www.youtube.com/watch?v=I3fhhwptHzc&t)
- "DS-Lite & IPv6 Problem ENDLICH gelöst! So öffnest du Ports mit Pangolin" by **Apfelcast** [(YouTube)](https://youtu.be/z3Ao9CWH0GU?si=HJHyYFaROlijVmzO)
- "Pangolin: Easy Self-Hosted Tunneled Reverse Proxy with Built-in Auth via VPS" by **Noted** [(Article)](https://noted.lol/pangolin/)
- "Cómo instalar Pangolin con Docker usando un script - Alternativa a Cloudflare Tunnel" by **José Maria Labarta** [(YouTube)](https://www.youtube.com/watch?v=i9AmiJPjqUQ)

## Components Overview

### [**Pangolin**](https://github.com/fosrl/pangolin) (Management Application & Central Server)

The central hub for managing the application. Pangolin includes:

- Most business logic.
- External facing rest API.
- WebSocket server for managing Newt sites.
- Internal facing rest API for communication between components on the VPS.
- Frontend server for the web interface.
- Main database for storing data.
- Authentication system.

### [**Gerbil**](https://github.com/fosrl/gerbil) (WireGuard Interface Management)

Acts as the intermediary for managing WireGuard configurations. It creates and maintains the secure tunnels between sites and the Pangolin server.

### [**Traefik**](https://github.com/traefik/traefik) (Reverse Proxy)

A high-performance, modular reverse proxy that routes requests to private resources. Traefik is widely adopted, and its plugin system allows further customization and security enhancements. For example:

- Enhanced security via our custom Traefik plugin Badger, which acts as an authentication bouncer.
- Out-of-the-box compatibility with plugins like GeoBlock and CrowdSec.

### [**Badger**](https://github.com/fosrl/badger) (Traefik Plugin Middleware):

A custom Traefik plugin that acts as an authentication bouncer. Badger:

- Intercepts requests to the Traefik reverse proxy.
- Redirects unauthenticated requests to the Pangolin server for authentication.

### [**Newt**](https://github.com/fosrl/newt) (Minimal User Space WireGuard Client)

A lightweight client designed to run on the private network. Newt:

- Connects to the Pangolin server via WebSocket and Gerbil via fully user space WireGuard
- Facilitates networking through its connection to Gerbil and creating TCP proxies

## System Diagram

<p align="center">
    ![graphic](./img/system-diagram.svg)
</p>

### What is a fossorial animal?

A fossorial animal is one adapted to digging which lives primarily but not solely, underground. Some examples are badgers, naked mole-rats, clams, meerkats, and mole salamanders, as well as many beetles, wasps, and bees. [Wikipedia](https://en.wikipedia.org/wiki/Fossorial)

### Credits

Built by Fossorial 

First "Pangolin" icon (no longer used) used as an initial logo is by Coret Steyn from [Noun Project](https://thenounproject.com/icon/pangolin-1798092/).

All of our fossorial animal names come from the good people at [animalia.bio](https://animalia.bio). They kindly donated their curated list of [fossorial animals](https://animalia.bio/fossorial-animals) found on their website and provided permission to use their images.
