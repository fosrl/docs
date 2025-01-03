# Setup

## Prerequisites

- Followed the setup steps and have a Pangolin server running with Gerbil, Traefik and Badger.
- Logged into the Pangolin management interface
  
## First Setup Steps

### 1. Create a Org

An org is a way to collect sites, users, and resources.

When you log into the app for the first time you will be prompted to create an org.

### 2. Create a site

A site is a remote location that you want to proxy through the tunnel and system. For example your home server, or a IOT device. A site will terminate one tunnel.

1. Head to the **Sites** tab and select the `Add Site` button
2. Give your site a name like "Home Lab"
3. Choose your connection method. You can either use the Newt client (recommended) or a standard Wireguard tunnel. 
4. Copy the Newt command or the Wireguard config, confirm you have copied it, and press `Create Site`

### 3. Connect a Tunnel

#### Newt
Assuming you chose Newt above, install and configure it to connect to Gerbil and Pangolin

There are 2 ways to setup Newt: with the CLI application or the Docker container. See ... for all options. 

On Linux, you can wget the newt binary and run the command copied during the create site step

```bash
wget -O installer "https://github.com/fosrl/pangolin/releases/download/v1.0.0-beta.1/installer"
```

Then run newt

```bash
./newt --id 31frd0uzbjvp721 --secret h51mmlknrvrwv8s4r1i210azhumt6isgbpyavxodibx1k2d6 --endpoint https://example.com
```

#### Wireguard

With Wireguard you will be responsible for ensuring your targets are reachable with the /29 subnet provided or proxied/NATed from the Wireguard host.

You are provided a /29 subnet in the 10.0.0.0/16 range that Gerbil uses per site.

For example on a Linux client, you can write your copied config to a wg0.conf file and run `wg-quick up ./wg0.conf`

### 4. Create a Resource

1. Head to the **Resources** tab and select the `Add Resource` button
2. Give your resource a name like "Bitwarden"
3. Choose a subdomain for this resource. The subdomain must be ***globally unique** across all orgs and sites
4. Choose the site that this resource is at. The resource target must be accessible behind the tunnel attached to this site.
5. Press `Create Resource`

### 5. Add Targets and Authentication

1. You should now be on the **Connectivity** page under your new resource
2. If you would like to secure this site with https, leave the `Enable SSL` toggle enabled
3. Add a target

Note: After you create your resource if you are using https certificates with LetsEncrypt (default) then you must wait some time after a target is created for your certificate to be granted and loaded by Traefik. This should take no more than a few minutes.

### 6. Invite Users (optional)

1. Head to the **Users and Roles**