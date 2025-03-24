# Bypass Rules 

Rules allow you to either "allow" and bypass the Pangolin auth system (no pin, login, password), or "deny" and fully reject the request. After you create a resource you can select the "Rules" tab on the sidebar and enable rules.

## Rules for Specific Mobile Apps

This table compiles paths that need to be allowed for various apps to work with Pangolin authentication.

| App | Required Bypass Rules |
|-----|------------------------|
| **Media Management** |  |
| Radarr | `/api/\*` |
| Sonarr | `/api/\*` |
| Lidarr | `/api/\*` |
| Jellyfin (iOS) | `/system/info/public` |
| Jellyfin (Roku) | `/System/Info/Public`<br />`/Users/AuthenticateByName`<br />`/Users/Public`<br />`/QuickConnect/Initiate`<br />`/QuickConnect/Connect`<br />`/Users/AuthenticateWithQuickConnect` |
| **Management & Monitoring** |  |
| Tautulli | `/api/\*` |
| Harbour | `/api/\*` |
| Hoarder App | `/api/\*` |
| Uptime Kuma Manager | `/api/\*`<br />`/socket.io/\*` |
| MeshCentral | `/api/\*`<br />`/meshrelay.ashx`<br />`/agent.ashx` |
| **Security & Privacy** |  |
| AdGuard Home | `/api/\*` |
| Vaultwarden/Bitwarden | `/api/\*`<br />`/identity/\*`<br />`/wl/\*`<br />Always Deny - Path - `/admin/\*` |
| **Cloud & Sync** |  |
| Nextcloud | `/` (Main interface)<br />`/index.php` (Core handler)<br />`/remote.php` (Remote access)<br />`/status.php` (Status checks)<br />`/ocs` (Collaboration Services API)<br />`/apps` (Applications)<br />`/remote.php/webdav` (WebDAV endpoint)<br />`/remote.php/dav` (CalDAV/CardDAV)<br />`/remote.php/caldav` (Calendar sync)<br />`/remote.php/carddav` (Contacts sync)<br />`/ocs/v1.php` (API endpoints)<br />`/ocs/v2.php` (API v2 endpoints)<br />`/login` (Authentication)<br />`/.well-known/\*` (Service discovery)<br />`/.well-known/webfinger` (WebFinger protocol)<br />`/s/\*` (Shared files/folders) |
| **Photo Management** |  |
| Immich | `/api/\*`<br />`/.well-known/immich` |
| **Notes & Knowledge Management** |  |
| Joplin Notes Server | `/api/\*`<br />`/shares/\*`<br />`/css/\*`<br />`/images/\*`<br />Always Deny - Path - `/login/\*` (optional) |
| Erugo | `/api/\*`<br />`/shares/\*`<br />`/build/\*`<br />`/get-logo` |
| **Communication** |  |
| Matrix/Synapse (Clients) | `/_matrix/\*`<br />`/_synapse/client/\*` |
| Matrix/Synapse (Federation) | `/_matrix/\*` |
| **Notifications** |  |
| Gotify | `/version`<br />`/message`<br />`/application`<br />`/client`<br />`/stream`<br />`/plugin`<br />`/health` |

## Types of Rules

Rule are processed from top to bottom in order of their priority. This means you can have multiple rules to bypass auth and to just flat deny users at the end.

Right now you can match on the following items:

### Path

Path match rules allow you to specify URL patterns using simple text and wildcards. A valid pattern can include regular path segments, slashes, and wildcards (\*) which match any characters.
Examples:

- blog/posts - Matches exact path
- blog/\* - Matches all paths under blog
- \*/2023/\* - Matches any path with 2023 as a middle segment
- product\* - Matches paths starting with "product"
- \*admin\* - Matches any path containing "admin"

Wildcards can appear anywhere in a segment, and special characters like dashes, underscores, and common punctuation are allowed. Avoid empty segments, double slashes, and non-URL characters.

### CIDR

CIDR (Classless Inter-Domain Routing) notation specifies IP address ranges using an IP address and a network prefix length. The format is [IP address]/[prefix length].
Examples:

- 144.234.11.22/24 - Matches all 256 IPs from 192.168.1.0 to 192.168.1.255
- 10.0.0.0/8 - Matches any IP starting with 10 (16.7 million addresses)
- 2001:db8::/32 - Matches a range of IPv6 addresses
- 0.0.0.0/0 - Matches all IPv4 addresses

The prefix length (1-32 for IPv4, 1-128 for IPv6) determines how many bits from the left are fixed. Smaller prefix numbers match larger ranges. Valid CIDR notation requires a properly formatted IP address followed by a slash and a valid prefix length.

### IP

Pretty simple: you can match on simply a IP address like your home IP to bypass auth. This is the same as entering a /32 CIDR. 
Examples:

- 23.234.134.32
- 34.45.245.64
- 100.11.243.169