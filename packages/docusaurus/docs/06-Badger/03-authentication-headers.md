# Authentication headers

Pangolin supports extracting user identity information from custom HTTP headers when using certain authentication methods. This feature allows your backend to receive user details directly from the request headers, enabling  integration with the SSO authentication systems of Pangolin.

## Supported Headers
When using SSO, pincode, or password authentication, Pangolin will forward the following headers to your backend:

Remote-User: The unique username or user ID
Remote-Email: The user's email address
Remote-Name: The user's full name

## Important Notes
These headers are only available when using one of the following authentication methods:

- Single Sign-On (SSO)

If you are not using one of these authentication methods, the headers will not be included in the request:

- Pincode authentication
- Password authentication
- Sharable link authentication