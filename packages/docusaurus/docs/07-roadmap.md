# Road Map

We keep track of active development on our [GitHub Project](https://github.com/orgs/fosrl/projects/1).

Submit feature requests to the [Pangolin repository](https://github.com/orgs/fosrl/discussions). If you really want something that is already on this list, you should still post about it, so we know it is a priority for you. Also, other people can upvote your request.

## Ideas

Outside of general bug fixes and improvements related to beta these are some long term ideas we have. We are not committed to anything on this list, and the order is meaningless. We will prioritize based on community feedback in GitHub and our own internal goals. If you would like to see something on this list, please let us know!

### Authentication Review and Penetration Tests

Are you experienced with authentication procedures and best practices? We would like some review and feedback on our auth flows and implementations to make sure we can all agree that the system is secure! If you have penetration testing experience, try to break the auth! We want to make this the most secure way for people to expose their resources to the world.

### Resource Management
- [ ] Add table filters on resources
  - [ ] Filter by site
  - [ ] Click "Show resources" on site dropdown which takes you to resources table with filter defined
- [x] Transfer resource to different site
- [x] Allow resource without a subdomain (use base domain) - limited to one resource per domain
- [ ] Create temporary link from resource page
- [ ] Show temporary links in table on resource page
- [ ] Track temporary link usage and session count
- [ ] Automatically delete expired links from the database
- [ ] Customize authentication session length for resources

### User Management
- [ ] Add user profile page
- [ ] Change password from profile without using reset password
- [ ] Allow users to leave organizations
- [ ] See pending invites
- [ ] Cancel pending invites
- [ ] Add user to organization without invite (set their password, force reset optionally)
- [ ] Remember me for authentication sessions

### Organization & Domain Management
- [x] Support for multiple domains
- [x] Support for running a resource at the root domain (without subdomain)
  - [x] Make this optional via a flag in the config

### Authentication & Integration
- [ ] Google, GitHub, etc. OAuth support
- [x] Cache authentication in badger to speed up proxy requests
- [ ] Nicely formatted error pages for badger
- [ ] Bearer token support for resources (useful for protecting APIs)
- [ ] Auth token in headers or URL parameters (useful for APIs)
- [ ] Ability to generate API keys for resources
- [ ] 2FA integration with Duo

### UI/UX Improvements
- [ ] Improved sidebar and navigation
- [ ] Add refresh buttons to tables
- [x] Table page size selector
- [ ] Loading skeletons
- [ ] iFrame dashboard to launch apps (similar to Organizr or other dashboards)
  - [ ] Pin apps to sidebar on dashboard
- [ ] Embeddable share links with authentication (similar to Grafana embedded dashboards with public URL)

### Monitoring
- [ ] Websocket for updating dashboard info (example: site online/offline)
- [ ] Uptime notifications

### General New Features

- [ ] Allow connecting into your private network from Newt like a VPN client
- [ ] SSH resource support to connect to non-HTTP based endpoints
- [ ] Additional proxy features like headers to use Pangolin auth on downstream resources
- [ ] A CICD deployment workflow to Docker and Github
- [ ] K8S installation via helm chart
- [x] UDP/TCP targets if people want to expose custom apis or other traffic themselves.
- [x] Sites that do not require newt or wireguard so you can traefik to anything
- [ ] Automatically create DNS records if provided with access to DNS provider (like Cloudflare API key)
- [ ] Support Tailscale as an exit node

### SAAS

We intend at some point to provide Pangolin in a hosted offering with a healthy free tier and pricing competitive to generally available cloud VPS services. This way users who would like to use Pangolin - but don't want to manage their own VPS - can do so and help to fund future development.
