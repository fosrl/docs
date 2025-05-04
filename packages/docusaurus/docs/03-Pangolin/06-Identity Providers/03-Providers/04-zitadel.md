# Zitadel

Follow these steps to integrate **Zitadel** with **Pangolin SSO** using OpenID Connect (OIDC).

## 1. Prerequisites

These instructions assume you have a working Zitadel organization and project setup already.

You need to configure an application in Zitadel:

1. Open an existing project and in `Applications` click `New`:
    1. Set the name to something memorable (eg. Pangolin)
    2. For `Type of application` choose `Web`
    3. For `Authentication Method` choose `Code`
    4. Leave `Redirect URIs` blank for now
    5. When you click create, you'll be shown the `ClientSecret` and `ClientId`. Make sure to save these somewhere secure - you won't be able to see the Client Secret again.
2. Click `Token settings` and check the `User Info inside ID Token` box and hit `Save`
3. Open `URLs` and make note of:
    - `Authorization Endpoint`
    - `Token Endpoint`

## 2. Configure an Identity Provider in Pangolin

In Pangolin, go to `Identity Providers` and click `Add Identity Provider`:

1. Set the name to something memorable (eg. Zitadel)
2. In the `OAuth2/OIDC Configuration` section, fill the following fields:
    1. `Client ID`: You should have the value for this from the Zitadel setup earlier
    2. `Client Secret`: You should also have this value
    3. `Authorization URL`: Use `Authorization Endpoint` from earlier
    4. `Token URL`: Use `Token Endpoint` from earlier
    3. In the `Token Configuration` section, set `Identifier Path` to `preferred_username`

When you're done, click `Create Identity Provider`.

Now copy the Redirect URL displayed in the `General Settings` section.

## 3. Complete the setup in your Zitadel application

Lastly, you need to edit your `Redirect Settings` in your Zitadel application. Add the URL you copied to the `Redirect URIs`, then hit the `+` button and finally `Save`.

## 4. Ready to Test!

The configuration is now complete. If you've configured a user (see below), try logging in!

## User Configuration in Pangolin

:::note

Username Configuration:
- Use the `Preferred login name` value from Zitadel as the username
- While Zitadel provides a `sub` claim in the JWT that matches the numeric user ID in Zitadel, we recommend using the preferred username for better user management and readability
:::

To create a user in an Organization, set the following:

- `User Type`: `External User`
- `Identity Provider`: The name you set for the identity provider (we'll assume `Zitadel` here)
- `Role`: Whatever role you want to give the user

The other fields are optional.


