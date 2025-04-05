# GeoBlock

##Installation
1. Add following lines to your `/config/traefik/traefik_config.yml` file.
```yaml
entryPoints:
  websecure:
    http:
      middlewares:
        - pangolin-geoblock@file

experimental:
  plugins:
    geoblock:
      moduleName: github.com/PascalMinder/geoblock
      version: v0.3.2
```
2. Add following lines to your `/config/traefik/dynamic_config.yml` file. With `blackListMode: false` GeoBlock is running in whitelist mode and just allows the added countries. Keep in mind to add countries when you are traveling. Find all county codes in the [documentation](https://github.com/PascalMinder/geoblock#full-plugin-sample-configuration).
```yaml
http:
  middlewares:
    pangolin-geoblock:
      plugin:
        geoblock:
          silentStartUp: false
          allowLocalRequests: true
          logLocalRequests: false # change to true to see logs and verify if it is working
          logAllowedRequests: false # change to true to see logs and verify if it is working
          logApiRequests: false # change to true to see logs and verify if it is working
          api: "https://get.geojs.io/v1/ip/country/{ip}"
          apiTimeoutMs: 500
          cacheSize: 25
          forceMonthlyUpdate: true
          allowUnknownCountries: false
          unknownCountryApiResponse: "nil"
          blackListMode: false
          countries:
            - DE # add/replace with your country code
```
3. Restart traefik
```bash
docker restart traefik
```

## Testing
Change 
          logLocalRequests: true
          logAllowedRequests: true
          logApiRequests: true 
