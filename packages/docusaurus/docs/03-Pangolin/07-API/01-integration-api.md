# Integration API

:::note

The Integration API requires a paid license.

:::

## Generate API Keys

You can generate as many API keys as you need. There are two types of API keys:

### Root API Keys

Root API keys can only be created by the server admin account from the Server Admin panel. These keys have expanded permissions and can do things such as create and delete organizations.

### Organization API Keys

Organization API keys can be created by organization admins from the Organization Admin panel. These keys have limited permissions and can only do things directly related to the organization.

## Fine-Grained Permissions

When you create or edit an API key, you can select the permissions that the API key will have. This allows you to create API keys with only the permissions that you need.

## Swagger Docs

OpenAPI documentation is served via Swagger UI. You can access the documentation at `https://api.example.com/v1/docs`.

## Configure Integration API

The below example shows how to expose the Integration API. It will be accessible at `https://api.example.com/v1`.

There are two things you will need to do to enable the Integration API:

1. Determine which port the Integration API will run on by setting `server.integration_port` in the configuration file.

```yaml
server:
  integration_port: 3003
```

2. Edit the Traefik `dynamic_config.yml` file to add the following configuration to expose the Integration API.

```yaml
http:
  middlewares:
    redirect-to-https:
      redirectScheme:
        scheme: https

  routers:
    # ...existing routers...
    int-api-router-redirect:
      rule: "Host(`api.example.com`)"
      service: int-api-service
      entryPoints:
        - web
      middlewares:
        - redirect-to-https

    int-api-router:
      rule: "Host(`api.example.com`)"
      service: int-api-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt

  services:
    # ...existing services...
    int-api-service:
      loadBalancer:
        servers:
          - url: "http://pangolin:3003" # Integration API
```
