# Overview

he modular design of this system enables the extension of its functionality through the integration of existing Traefik plugins, such as Crowdsec and Geoblock.

## Traefik plugins

For a complete list of available plugins, please refer to the [Plugin Catalog](https://plugins.traefik.io/plugins).

### Crowdsec Bouncer

When installing Crowdsec via the Pangolin installer, the Crowdsec Traefik Bouncer will be automatically installed and configured by default. The configuration can be customized to meet your specific requirements. For detailed guidance, refer to the [documentation](https://docs.fossorial.io/Modules/crowdsec).

For additional information, consult the following resources:
- [Traefik Plugin Catalog](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin)
- [Github Repository](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin)

### Geoblock

Geoblock is a straightforward Traefik plugin that allows you to block or permit requests based on their country of origin. It leverages [GeoJs.io](https://www.geojs.io/) for geolocation services.

For more details, please refer to the following resources:
- [Github Repository](https://github.com/PascalMinder/geoblock)
