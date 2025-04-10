# Overview

The modular design of this system enables the extension of its functionality through the integration of existing Traefik plugins, such as Crowdsec and Geoblock.
Additionally, Prometheus can collect metrics from both CrowdSec and Traefik, which can then be visualized in Grafana to monitor security events, request statistics, and traffic patterns in real time.

## Traefik plugins

For a complete list of available plugins, please refer to the [Plugin Catalog](https://plugins.traefik.io/plugins).

### Crowdsec Bouncer

When installing Crowdsec via the Pangolin installer, the Crowdsec Traefik Bouncer will be automatically installed and configured by default. The configuration can be customized to meet your specific requirements. For detailed guidance, refer to the [documentation](https://docs.fossorial.io/Modules/crowdsec).

The CrowdSec Bouncer plugin for Traefik integrates CrowdSec’s security engine to block malicious traffic in real time. It runs as middleware within a Traefik container and enforces decisions based on CrowdSec’s threat intelligence. This helps protect services from bots, attackers, and abusive IPs dynamically.

For additional information, consult the following resources:
- [Traefik Plugin Catalog](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin)
- [Github Repository](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin)

### Geoblock

The GeoBlock plugin for Traefik is a middleware that restricts access based on the client’s geographic location. It runs within a Traefik container and uses IP-based geolocation to allow or block traffic from specific countries. This is useful for security, compliance, or access control in Traefik-managed services.

For more details, please refer to the following resources:
- [Github Repository](https://github.com/PascalMinder/geoblock)

## Metrics

Currently you can claim metric data from Traefik and Crowdsec with Prometheus and visiulize it within a Grafana Dashboard.

### Prometheus

Prometheus is an open-source monitoring and alerting toolkit designed for collecting and querying time-series metrics. It runs as a Docker container and uses a pull-based model to scrape data from configured endpoints. Prometheus integrates well with Grafana for visualization and Alertmanager for alert handling.

For more details, please refer to the following resources:
- [Homepage](https://prometheus.io/)
- [Github Repository](https://github.com/prometheus/prometheus)

### Grafana

Grafana is an open-source analytics and visualization platform used to monitor and display time-series data. It runs as a Docker container and supports multiple data sources, including Prometheus, InfluxDB, and MySQL. Grafana provides interactive dashboards, alerting, and extensive customization options for data visualization.

For more details, please refer to the following resources:
- [Homepage](https://grafana.com/)
- [Github Repository](https://github.com/grafana/grafana)
