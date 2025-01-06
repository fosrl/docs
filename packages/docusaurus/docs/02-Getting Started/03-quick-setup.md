# Setup

## Prerequisites

- Followed the setup steps and have a Pangolin server running with Gerbil, Traefik and Badger.
- Logged into the Pangolin management interface
  
## First Setup Steps

### 1. Create a Org

An org is a way to collect sites, users, and resources.

When you log into the app for the first time you will be prompted to create an org. Simply choose a name and an ID. Note that the ID can not be changed later!

### 2. Create a site

A site is a remote location that you want to proxy through the tunnel and system. For example your home server, or a IOT device. A site will terminate one tunnel.

1. Head to the **Sites** tab and select the `Add Site` button (or use the tab in the setup workflow)
2. Give your site a name like "Home Lab"
3. Choose your connection method. You can either use the Newt client (recommended) or a standard WireGuard tunnel. 
4. Copy the Newt command or the WireGuard config, confirm you have copied it, and press `Create Site`

### 3. Connect a Tunnel

#### Newt (recommended)

Assuming you chose Newt above, install and configure it to connect to Gerbil and Pangolin

There are 2 ways to setup Newt: with the CLI application or the Docker container. See [Newt install](/Newt/install) for all options. 

On Linux, you can wget the newt binary and run the command copied during the create site step. Make sure to replace amd64 with your architecture!

```bash
wget -O newt "https://github.com/fosrl/newt/releases/download/1.0.0-beta.1/newt_linux_amd64" && chmod +x ./newt
``` 

Then run Newt

```bash
./newt \
--id 31frd0uzbjvp721 \
--secret h51mmlknrvrwv8s4r1i210azhumt6isgbpyavxodibx1k2d6 \
--endpoint https://example.com
```

#### WireGuard

With WireGuard you will be responsible for ensuring your targets are reachable with the /29 subnet provided or proxied/NATed from the WireGuard host.

You are provided a /29 subnet in the 10.0.0.0/16 range that Gerbil uses per site.

For example on a Linux client, you can write your copied config to a wg0.conf file and run `wg-quick up ./wg0.conf`

### 4. Create a Resource

1. Head to the **Resources** tab and select the `Add Resource` button (or use the tab in the setup workflow)
2. Give your resource a name like "Bitwarden"
3. Choose a subdomain for this resource. The subdomain must be ***globally unique** across all orgs and sites
4. Choose the site that this resource is at. The resource target must be accessible behind the tunnel attached to this site.
5. Press `Create Resource`

### 5. Add Targets and Authentication

#### Target

1. You should now be on the **Connectivity** page under your new resource
2. If you would like to secure this site with https, leave the `Enable SSL` toggle enabled
3. Add a target for this resource. If your resource is accessible on your internal network at `http://192.168.1.24:8080` for example, then choose the following
Method: HTTP
IP Address: 192.168.1.24
Port: 8080
4. Press `Add Target` and you will see the target added to the list and enabled.
5. Press `Save Changes`
6. Try to access your resource by clicking the url at the top

:::tip

After you create your resource if you are using https certificates with Let's Encrypt (default) then you must wait some time after a target is created for your certificate to be granted and loaded by Traefik. This should take no more than a few minutes. For instant access, consider setting up wildcard certificates.

:::

<img src={require("./img/2025-01-05_17-16_2.png").default} alt="Preview"/>

#### Authentication

1. Choose the **Authentication** page under the resource

By default the resource is protected with your same Pangolin account. When opening the resource it just loads because you are already logged in. If you were not, you would first be redirected to Pangolin to login before being sent back to the resource. 

If you would like to disable Pangolin auth, you can disable the `Use Platform SSO` toggle.

:::warning

It is not recommended to expose a resource without some form of authentication. Only do this if you need to for the functionality of the resource or you trust the built-in auth.

:::

For advanced auth control with users, roles, passwords, pins, or email whitelists, see .....

### 6. Invite Users (optional)

1. Head to the **Users and Roles** tab
2. Press `Invite User` 
3. Enter an email for the new user. If you have setup SMTP during the setup you can choose to send an email invite to the new user
4. Select the role for the new user. All users must have a role. The admin role gives the user access to all resources and to create new resources and sites. The member role only provides access to resources explicitly attached to the role (none by default). For more information, see .....
5. Choose how long this invite will be valid for and choose `Create Invitation`
6. If you chose not to send the email or it is not setup, then be sure to copy the invite and send it to the user

The new user will be prompted to setup a password and verify their email (if SMTP is supported). They will show up in your table once they confirm their account.