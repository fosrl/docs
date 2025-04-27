# OAuth2/OIDC

This identity provider follows the OpenID Connect protocol. This means that it can be used to connect to any external identity provider that supports the OpenID Connect protocol such as Authentik, Keycloak, Okta, etc.

## Configuration

You will need to configure the following common settings:

- Client ID
- Client Secret
- Authorization URL
- Token URL

## Token Configuration

Use JMESPath to select attributes from the claims token. See [JMESPath](https://jmespath.org/) for more information on how to use JMESPath.

Determine how to access information from the claims token returned by the identity provider. This is used to map the user information from the identity provider to the user information in Pangolin.

- Identifer Path
  - This must be unique each user within an identity provider.
- Email Path
- Name Path
- Scopes
  - The scopes to request from the identity provider.
  - Generally, `openid profile email` is sufficient.
