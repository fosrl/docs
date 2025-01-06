# Configuration File

Pangolin is configured using a `config.yml` file. The file is expected to be mounted in `config/config.yml`.

## Sections

### app

-   `base_url`: string
    -   Example: `https://example.com` or `https://proxy.example.com`
    -   The url where the application is hosted. This is used for many things, including generating links, and determing the root domain for cookies, etc.
    -   You can run Pangolin on a subdomain or root domain. Users will be redirected to this url to complete the auth step.
-   `log_level`: string
    -   Options: `debug`, `info`, `warn`, `error`
    -   The log level for the application.
-   `save_logs`: boolean
    -   Whether to save logs to a file. Logs are saved to `config/logs/`.
    -   Logs rotate
        -   Max size: 20MB
        -   Max files: 7 days

### server

-   `external_port`: int
    -   The port the external facing (public) API will listen on.
-   `internal_port`: int
    -   The port the internal private facing (private) API will listen on.
-   `next_port`: int
    -   The port the frontend server will listen on.
-   `internal_hostname`: string
    -   Example: `pangolin`
    -   The hostname of the Pangolin container. This is used for internal communication between the components.
    -   If running with Docker Compose, this should be the name of the container, which is likely `pangolin`.
-   `secure_cookies`: boolean
    -   Whether to set the `Secure` flag on cookies. This is recommended if you are running Pangolin over HTTPS.
-   `session_cookie_name`: string
    -   Example: `p_session`
    -   The name of the session cookie. This is used to store the session token for the main application.
    -   Cookies will be set for the base domain of the `base_url` config.
-   `resource_session_cookie_name`: string
    -   Example: `p_resource_session`
    -   The prefix for the resource specific session cookie. When a user authenticates directly with a resource, this is used to store the session token for that resource.
    -   Cookies will be set for the base domain of the `base_url` config.

### traefik

-   `cert_resolver`: string
    -   Example: `letsencrypt`
    -   The name of the Traefik certificate resolver. This must match the name of the resolver in the Traefik configuration.
-   `http_entrypoint`: string
    -   Example: `web`
    -   The name of the Traefik entrypoint for HTTP traffic. This must match the name of the entrypoint in the Traefik configuration.
-   `https_entrypoint`: string
    -   Example: `websecure`
    -   The name of the Traefik entrypoint for HTTPS traffic. This must match the name of the entrypoint in the Traefik configuration.
-   `prefer_wildcard_cert`: boolean
    -   Whether to prefer a wildcard certificate when generating certificates. This is useful if you want to use a wildcard certificate for the base domain and all subdomains.
    -   Before setting this to `true`, please see the docs for setting up wildcard certificates with Let's Encrypt, <a href="/Pangolin/wildcard-certs">here</a>.

### gerbil
    - `start_port`: int
      - This is the starting port for WireGuard tunnels that new Gerbil exit nodes will use and increment as they register with Pangolin. Advised to choose a base of a range with no conflicts.
    - `base_endpoint`: string
      - This is the domain name automatically included in Newt and WireGuard config for tunnel connections.
    - `use_subdomain`: boolean
      - If set to true, new Gerbil exit nodes will be assigned a unique subdomain off of the base domain. Advised to keep this to false.
    - `subnet_group`: string
      - IP address CIDR from which to choose smaller CIDR ranges for new Gerbil exit node registrations. Each "Gerbil" gets a subnet from this range.
    - `block_size`: int
      - The block size of the smaller CIDR ranges for new Gerbil exit node registrations.

### rate_limits

-   `global`: object
    -   The global rate limit configuration for all requests to the external Pangolin API.
    -   `window_minutes`: int
        -   Example: `1`
        -   The window in minutes for the rate limit.
    -   `max_requests`: int
        -   Example: `100`
        -   The maximum number of requests allowed in the window.

### email (optional)

-   `smtp_host`: string
    -   The SMTP host for sending emails.
-   `smtp_port`: int
    -   The SMTP port for sending emails.
-   `smtp_username`: string
    -   The SMTP username for sending emails.
-   `smtp_password`: string
    -   The SMTP password for sending emails.
-   `no_reply`: string
    -   Example: `no-reply@example.com`
    -   The address to send emails from. This can be any email address, but it is recommended to use a no-reply address.

### users

-   `server_admin`: object
    -   The server admin who can always create new organizations. This user will always be created on startup.
    -   `email`: string
        -   The email address of the server admin.
    -   `password`: string
        -   The password of the server admin.
        -   This password will always overwrite the password in the database on startup. This is useful for resetting the password.
        -   The password must meet the following requirements:
            -   At least 8 characters
            -   At least one uppercase letter
            -   At least one lowercase letter
            -   At least one digit
            -   At least one special character

### flags

-   `require_email_verification`: boolean
    -   Whether to require email verification for new users. If set to `true`, new users will need to verify their email address before they can log in.
    -   Only turn this on if you have email configured.
-   `signup_without_invite`: boolean
    -   Whether to allow users to sign up without an invite. If set to `false`, the "Sign Up" button will be removed from the login form.
    -   Users will still be able to sign up if they have a valid invite.
-   `disable_user_create_org`: boolean
    -   Whether to allow users to create new organizations. If set to `false`, users will not be able to create new organizations.
    -   The server admin can always create new organizations.

## Example Configuration File

`config.yml`

```yaml
app:
    base_url: https://example.com
    log_level: info
    save_logs: false

server:
    external_port: 3000
    internal_port: 3001
    next_port: 3002
    internal_hostname: pangolin
    secure_cookies: true
    session_cookie_name: p_session
    resource_session_cookie_name: p_resource_session

traefik:
    cert_resolver: letsencrypt
    http_entrypoint: web
    https_entrypoint: websecure
    prefer_wildcard_cert: true

gerbil:
    start_port: 51820
    base_endpoint: example.com
    use_subdomain: false
    subnet_group: 10.0.0.0/8
    block_size: 16

rate_limits:
    global:
        window_minutes: 1
        max_requests: 100

email:
    smtp_host: host.hoster.net
    smtp_port: 587
    smtp_user: no-reply@example.com
    smtp_pass: aaaaaaaaaaaaaaaaaa
    no_reply: no-reply@example.com

users:
    server_admin:
        email: admin@example.com
        password: Password123!

flags:
    require_email_verification: true
    disable_signup_without_invite: true
    disable_user_create_org: true
```
