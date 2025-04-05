# Overview

Due to a modular design you can extend the functionality with existing Traefik plugins, such as Crowdsec and Geoblock.

## Traefik plugins

See a full list of available plugins at [Plugin Catalog](https://plugins.traefik.io/plugins).

### Crowdsec Bouncer

By installing crowdsec through the Pangolin installer the Crwodsec Traefik Bouncer will be installed and configured by default.
You can adjust the configuration to your needs by following this [documentation](https://docs.fossorial.io/Modules/crowdsec).

For more details see references:
[Traefik Plugin Catalog](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin)
[Github Repository](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin)

### Geoblock

Geoblock is a simple plugin for Traefik to block or allow requests based on their country of origin. Uses [GeoJs.io](https://www.geojs.io/).

For more details see references:
[Github Repository](https://github.com/PascalMinder/geoblock)
