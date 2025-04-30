# Add Identity Providers

Identity providers can be configured from the Server Admin panel.

Identity providers let you authenticate Pangolin users using external identity providers. This is useful for organizations that want to use their existing identity provider infrastructure to manage user authentication.

For example, you may have users defined in Authentik, and you want these users to be able to log in to Pangolin using their existing credentials.

### Supported Identity Providers

- OAuth2/OIDC
  - This can be used to connect to any external identity provider that supports the OpenID Connect protocol such as Authentik, Keycloak, Okta, etc.

_We are working on adding support for more identity providers in the future. If you have a specific identity provider in mind, please let us know!_

### How to Add an Identity Provider

1. Select the "Identity Providers" tab in the Server Admin UI.
2. Click on the "Add Identity Provider" button.
3. Select the type of identity provider you want to add.
4. Fill in the required fields for the selected identity provider type.

### Auto Provisioning

See [Auto Provision](./02-auto-provision.md) for more information on how to automatically provision users and assign orgs and roles in Pangolin when they log in using an external identity provider.
