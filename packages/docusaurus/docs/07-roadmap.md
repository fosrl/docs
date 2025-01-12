# Road Map

The whole Fossorial project is still in beta, but we wanted to get started on a list of ideas and planned future improvements. If you have some ideas or areas of improvement, please leave a Github issue on the respective repository or contribute to this page [here](https://github.com/fosrl/docs/blob/main/packages/docusaurus/docs/07-roadmap.md).

We are not committed to anything on this list. We will prioritize based on community feedback and our own internal goals. If you would like to see something on this list, please let us know!

## Development Roadmap

Outside of general bug fixes and improvements related to beta:

### Authentication Review and Penetration Tests

Are you experienced with authentication procedures and best practices? We would like some review and feedback on our auth flows and implementations to make sure we can all agree that the system is secure! If you have penetration testing experience, try to break the auth! We want to make this the most secure way for people to expose their resources to the world.

### Resource Management
- [ ] Add table filters on resources
  - [ ] Filter by site
  - [ ] Click "Show resources" on site dropdown which takes you to resources table with filter defined
- [ ] Transfer resource to different site
- [ ] Allow resource without a subdomain (use base domain) - limited to one resource per domain
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
- [ ] Support for multiple domains
  - [ ] Set domain per organization
  - [ ] Would need to refactor auth to support cross-site cookies
- [ ] Allow connecting more than only domain name to pangolin
- [ ] Support for running a resource at the root domain (without subdomain)
  - [ ] Make this optional via a flag in the config

### Authentication & Integration
- [ ] Google, GitHub, etc. OAuth support
- [ ] Cache authentication in badger to speed up proxy requests
- [ ] Nicely formatted error pages for badger
- [ ] Bearer token support for resources (useful for protecting APIs)
- [ ] Auth token in headers or URL parameters (useful for APIs)
- [ ] Ability to generate API keys for resources
- [ ] 2FA integration with Duo

### UI/UX Improvements
- [ ] Improved sidebar and navigation
- [ ] Add refresh buttons to tables
- [ ] Table page size selector
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
- [ ] UDP/TCP targets if people want to expose custom apis or other traffic themselves.
- [x] Sites that do not require newt or wireguard so you can traefik to anything
- [ ] Automatically create DNS records if provided with access to DNS provider (like Cloudflare API key)
- [ ] Support tailscale as an exit node

### SAAS

We intend at some point to provide Pangolin in a hosted offering with a healthy free tier and pricing competitive to generally available cloud VPS services. This way users who would like to use Pangolin - but don't want to manage their own VPS - can do so and help to fund future development.
