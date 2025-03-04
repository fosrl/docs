# Security Overview

There are two components of Newt auth to discuss: the WireGuard portion and the websocket command and control portion.

### WireGuard

Newt generates a WireGuard public / private key pair every time it starts up and uses this new pair when registering wih Pangolin and Gerbil. The private key is not stored on the system and never leaves the current process (never sent to the cloud). The public key is transmitted over the websocket on startup and is stored in the Newt table for the Newt ID and sent to Gerbil to create a new peer. In Newt, only the internal IP of the Gerbil WireGuard server is added to allowed IPs effectively locking out packets that do not come from Gerbil itself. In Gerbil, only the internal IP of the remote Newt instance is installed in the allowed IPs effectively locking out packets that do not come from that Newt proxy itself.

### HTTP and Websocket

Newt is started with a Newt ID and a secret. Pangolin uses the ID to identify the client and link it with a site and other metadata. The secret is cryptographically generated when the site is created and stored hashed in the database.

All command and control is done over the Websocket, so Newt first must connect to that. In order to connect, Newt must present a valid token which is obtained by making an HTTP API request to `/api/v1/auth/newt/get-token` with the Newt ID and secret. Pangolin will hash this secret and attempt to look it up in the table. Assuming it finds a match it will cryptographically generate and store a token in the sessions table and return it to the client. Using this token, Newt can connect to the websocket which first looks it up in the sessions table to determine if it exists and is still valid. If so it allows the websocket connection. 

Having connected, Newt will transmit its newly minted public key to Pangolin and will receive shortly after a "WireGuard" init message with the public key of the peer, allowedIps, and initial targets to proxy. 