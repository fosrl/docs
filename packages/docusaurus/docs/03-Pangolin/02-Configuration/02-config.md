# Configuration File

Pangolin is configured using a `config.yml` file. The file is expected to be mounted in `config/config.yml`.

## Sections

### `app`

- `dashboard_url`: string
  - Example: `https://example.com` or `https://pangolin.example.com`
  - The url where the application is hosted. This is used for many things, including generating links.
  - You can run Pangolin on a subdomain or root domain. Users will be redirected to this url to complete the auth step.
- `log_level`: string
  - Options: `debug`, `info`, `warn`, `error`
  - The log level for the application.
- `save_logs`: boolean
  - Whether to save logs to a file. Logs are saved to `config/logs/`.
  - Logs rotate
    - Max size: 20MB
    - Max files: 7 days
- `log_failed_attempts` (optional): boolean
  - Whether to log failed authentication attempts. This is useful for security tools like Crowdsec and Fail2ban.

### `server`

- `external_port`: int
  - The port the external facing (public) API will listen on.
- `internal_port`: int
  - The port the internal private facing (private) API will listen on.
- `next_port`: int
  - The port the frontend server will listen on.
- `internal_hostname`: string
  - Example: `pangolin`
  - The hostname of the Pangolin container. This is used for internal communication between the components.
  - If running with Docker Compose, this should be the name of the container, which is likely `pangolin`.
- `session_cookie_name`: string
  - Example: `p_session_token`
  - The name of the session cookie. This is used to store the session token for the main application.
- `resource_access_token_param`: string
  - Example: `p_token`
  - Pass access token in this query parameter in each request for authentication.
- `resource_access_token_headers`: object
  - Pass access token in these headers in each request for authentication.
  - `id`: string
    - Example: `P-Access-Token-Id`
    - The name of the header used to pass the access token ID.
  - `token`: string
    - Example: `P-Access-Token`
    - The name of the header used to pass the access token.
- `resource_session_request_param`: string
  - Example: `p_session_request`
  - The query parameter used to pass the session request token to be exchanged for a real session token in Badger.
- `cors`: object (optional)
  - Configuration for Cross-Origin Resource Sharing (CORS).
  - `origins`: array of strings (optional)
    - Example: `["https://pangolin.example.com"]`
    - List of allowed origins for cross-origin requests.
  - `methods`: array of strings (optional)
    - Example: `["GET", "POST", "PUT", "DELETE", "PATCH"]`
    - HTTP methods allowed for CORS requests.
  - `allowed_headers`: array of strings (optional)
    - Example: `["X-CSRF-Token", "Content-Type"]`
    - HTTP headers allowed in CORS requests.
  - `credentials`: boolean (optional)
    - Whether to allow credentials.
    - Default: true
- `trust_proxy`: boolean (optional)
  - Whether to trust the proxy headers (e.g., `X-Forwarded-For`) for determining the client IP address.
  - Default: `true`
- `dashboard_session_length_hours`: int (optional)
  - The length of time in hours that the dashboard session will last after logging in.
  - Default: `720`
- `resource_session_length_hours`: int (optional)
  - The length of time in hours that a session for each resource will last after logging in.
  - Default: `720`

### `domains`

[How do I get a domain?](../../02-Getting%20Started/02-dns-networking.md)

At least one domain must be configured.

- `<domain_key>`: string
  - The unique key for the domain configuration. This can be anything you want.
  - `base_domain`: string
    - Example: `example.com`
  - `cert_resolver`: string
    - Example: `letsencrypt`
    - The name of the Traefik certificate resolver to use for this domain. This must match the name of the certificate resolver in the Traefik configuration.
  - `prefer_wildcard_cert`: boolean
    - Example: `true`
    - Whether to prefer a wildcard certificate when generating certificates. This is useful if you want to use a wildcard certificate for the base domain and all subdomains.

### `traefik`

- `http_entrypoint`: string
  - Example: `web`
  - The name of the Traefik entrypoint for HTTP traffic. This must match the name of the entrypoint in the Traefik configuration.
- `https_entrypoint`: string
  - Example: `websecure`
  - The name of the Traefik entrypoint for HTTPS traffic. This must match the name of the entrypoint in the Traefik configuration.
- `additional_middlewares`: array of strings (optional)
  - Example: `["middleware1", "middleware2"]`
  - Additional middlewares to apply to the resource router generated at runtime. These must be defined in another Traefik configuration provider like the dynamic file provider.

### `gerbil`

    - `start_port`: int
      - This is the starting port for WireGuard tunnels that new Gerbil exit nodes will use and increment as they register with Pangolin. Advised to choose a base of a range with no conflicts.
    - `base_endpoint`: string
      - This is the domain name automatically included in Newt and WireGuard config for tunnel connections.
    - `use_subdomain`: boolean
      - If set to true, new Gerbil exit nodes will be assigned a unique subdomain off of the base domain. Advised to keep this to false.
    - `subnet_group`: string
      - IP address CIDR from which to choose smaller CIDR ranges for new Gerbil exit node registrations. Each "Gerbil" gets a subnet from this range.
    - `block_size`: int
      - The block size of the smallest CIDR ranges for new Gerbil exit node registrations.
    - `site_block_size`: int
      - The block size of the smallest CIDR ranges for new sites connected to Gerbil.

### `rate_limits`

- `global`: object
  - The global rate limit configuration for all requests to the external Pangolin API.
  - `window_minutes`: int
    - Example: `1`
    - The window in minutes for the rate limit.
  - `max_requests`: int
    - Example: `100`
    - The maximum number of requests allowed in the window.

### `email` (optional)

- `smtp_host` (optional): string
  - The SMTP host for sending emails.
- `smtp_port` (optional): int
  - The SMTP port for sending emails.
- `smtp_user` (optional): string
  - The SMTP username for sending emails.
- `smtp_pass` (optional): string
  - The SMTP password for sending emails.
- `smtp_secure` (optional): boolean
  - Whether to use a secure connection when sending emails. Use this if you're using port 465.
  - Default: `false`
- `no_reply` (optional): string
  - Example: `no-reply@example.com`
  - The address to send emails from. This can be any email address. Most often this will be the same as the `smtp_user`.
- `smtp_tls_reject_unauthorized` (optional): boolean
  - Do not fail if the server certificate cannot be verified.
  - Default: `false`

### `users`

- `server_admin`: object
  - The server admin who can always create new organizations. This user will always be created on startup.
  - `email`: string
    - Env: USERS_SERVERADMIN_EMAIL
    - The email address of the server admin.
  - `password`: string
    - Env: USERS_SERVERADMIN_PASSWORD
    - The password of the server admin.
    - This password will always overwrite the password in the database on startup. This is useful for resetting the password.
    - The password must meet the following requirements:
      - At least 8 characters
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one digit
      - At least one special character

### `flags` (optional)

- `require_email_verification` (optional): boolean
  - Whether to require email verification for new users. If set to `true`, new users will need to verify their email address before they can log in.
  - Only turn this on if you have email configured.
- `disable_signup_without_invite` (optional): boolean
  - Whether to allow users to sign up without an explicit invite. If set to `true`, the "Sign Up" button will be removed from the login form.
  - Users will still be able to sign up if they have a valid invite.
- `disable_user_create_org` (optional): boolean
  - Whether to allow users to create new organizations. If set to `true`, users will not be able to create new organizations.
  - The server admin can always create new organizations.
- `allow_raw_resources` (optional): boolean
  - Whether to allow users to create raw TCP/UDP resources. If set to `false`, users will only be able to create http/https resources.
- `allow_base_domain_resources` (optional): boolean
  - Whether to allow users to create resources on the base domain. If set to `false`, users will only be able to create resources on subdomains.

## Example Configuration File

This is just an example and is not meant to be used as is. It is not complete. You should customize the configuration to your needs.

```yaml
app:
  dashboard_url: "https://example.com"
  log_level: "info"
  save_logs: false

domains:
  domain1:
    base_domain: "example.com"
    cert_resolver: "letsencrypt"
    prefer_wildcard_cert: false

server:
  external_port: 3000
  internal_port: 3001
  next_port: 3002
  internal_hostname: "pangolin"
  session_cookie_name: "p_session_token"
  resource_access_token_param: "p_token"
  resource_access_token_headers:
    id: "P-Access-Token-Id"
    token: "P-Access-Token"
  resource_session_request_param: "p_session_request"

traefik:
  cert_resolver: "letsencrypt"
  http_entrypoint: "web"
  https_entrypoint: "websecure"

gerbil:
  start_port: 51820
  base_endpoint: "example.com"
  use_subdomain: false
  block_size: 24
  site_block_size: 30
  subnet_group: 100.89.137.0/20

rate_limits:
  global:
    window_minutes: 1
    max_requests: 100

email:
  smtp_host: "host.hoster.net"
  smtp_port: 587
  smtp_user: "no-reply@example.com"
  smtp_pass: "aaaaaaaaaaaaaaaaaa"
  no_reply: "no-reply@example.com"

users:
  server_admin:
    email: "admin@example.com"
    password: "Password123!"

flags:
  require_email_verification: true
  disable_signup_without_invite: true
  disable_user_create_org: true
  allow_raw_resources: true
  allow_base_domain_resources: true
```
