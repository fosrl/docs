# Pocket ID

Follow these steps to integrate **Pocket ID** with **Pangolin SSO** using OpenID Connect (OIDC)

## 1. Make Pocket ID Public

If you have Pocket ID hosted on a Site, create a Resource for it if you haven't already.

:::danger Important for security

Consider hosting Pocket ID somewhere, where it's always accessible or save an internal account. You will *not* be able to log in when the site where Pocket ID is hosted goes offline!
 
DO NOT secure the Pocket ID resource with Pangolin SSO, otherwise it will not work

:::

## 2. Create an OIDC Client in Pocket ID

In Pocket ID, create a new OIDC Client.

- Set the name to something memorable (eg. Pangolin)
- Set "Callback URLs" to `https://<your-pangolin-domain>/auth/idp/1/oidc/callback`
- All other values can be kept as default

After you have created the OIDC Client, take note of the following fields from the top of the page (click "Show more details" to see all of them):

- Client ID
- Client secret
- Authorization URL
- Token URL

## 3. Configure an Identity Provider in Pangolin
In Pangolin, go to `Identity Providers` and click "Add Identity Provider":

- Set the name to something memorable (eg. Pocket ID)
- In the "OAuth2/OIDC Configuration" section, fill the fields with the values you have from Pocket ID
- In the "Token Configuration" section, set "Identifier Path" to "preferred_username"

When you're done, click "Create Identity Provider"

## 4. Ready to test!

The configuration is now complete. If you've configured a user (see below), try logging in!

## Note fo User configuration in Pangolin

To create a user in an Organization, Set the following:

- "User Type": "External User
- "Identity Provider": The name you set for the identity provider (we'll assume "Pocket ID" here)
- "Role": Whatever role you want to give the user

The other fields are optional

:::danger

The Username has to be the exact same as in Pocket ID, otherwise the login will not work

:::
