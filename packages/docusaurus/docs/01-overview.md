# Overview

The Fossorial system - with Pangolin at its core - is a self-hosted tunneled reverse proxy with identity and access management, designed to securely expose private resources through encrypted [WireGuard](https://www.WireGuard.com/) tunnels running in user space. Think self hosted Cloudflare tunnels.

## Components Overview

Fossorial has a couple major components:

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
    - Out-of-the-box compatibility with plugins like [Fail2Ban](https://plugins.traefik.io/plugins/628c9ebcffc0cd18356a979f/fail2-ban) or [CrowdSec](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin).
    - Enhanced security via our custom Traefik plugin Badger, which acts as an authentication bouncer.

### [**Badger**](https://github.com/traefik/badger) (Traefik Plugin):
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

Built by Owen & Milo Schwartz

"Pangolin" icon used as a initial logo is by Coret Steyn from [Noun Project](https://thenounproject.com/icon/pangolin-1798092/).

All of our fossorial animal names come from the good people at [animalia.bio](https://animalia.bio). They kindly donated their curated list of [fossorial animals](https://animalia.bio/fossorial-animals) found on their website and provided permission to use their images. 
