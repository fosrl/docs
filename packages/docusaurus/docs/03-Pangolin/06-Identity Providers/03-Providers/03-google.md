# Google
The following steps will integrate **Google SSO** using **OpenID Connect (OIDC)**.

## 1. Prerequisites
Before you can start, you'll need to create or edit a **Project** in [Google Developers Console](https://console.developers.google.com/).

### 1.1 Setting up your Project
[Create a new Project](https://console.cloud.google.com/projectcreate), or use an [existing Project](https://console.developers.google.com/) you've already created in the Google Developers Console. Setting the organization isn't required, unless you intend to use SSO for [more than 100 users](https://support.google.com/cloud/answer/13464323) externally (not via Google Workspace).

<!-- ![The image is a demonstration of the Google Developers Console's New Project screen. There are three fields: Project name, Billing account, and Location. Optionally, the Project ID can be modified. All of them are required to continue.](image-1.png) -->

Once created, or you've opened an existing Project, you may be on the project dashboard, where you will need to open the sidebar. If you are on the welcome page, continue by selecting [OAuth consent screen](https://console.cloud.google.com/auth/overview) in **APIs and services**.

<!-- ![The image is a demonstration of the Google Developers Console's Project dashboard. The sidebar is opened, and the option "APIs and services" is being shown.](image.png) -->

You should see that Google Auth Platform is not configured. Press **Get started** and fill in the relevant information, such as your **App name** and **User support email**. These will be visible when the user is authenticating.

After continuing, you can select an **Audience**. If you are using Pangolin for friends and family, use the **External** Audience. You can only be have 100 users authenticated with a "Testing" status.

:::note
Depending on your use case, you may want to use the **Internal** Audience if you are utilising Google Workspace SSO and paying for access to the [Professional Edition](https://docs.fossorial.io/professional-edition).
:::

Once completed, you will then need to open the [Branding](https://console.cloud.google.com/auth/branding) tab.

Locate **Authorized domains**, then press "Add domain" to add an authorized domain. You'll need to authorize the top private (root) domain here, such as `example.com`. Your SSO *may* function without an authorized domain, though setting this field should guarantee functionality.

### 1.2 Creating an OAuth client ID in your Project
Go to the [Clients](https://console.cloud.google.com/auth/clients) tab, and click "Create client" below the top bar.

1. For **Application type**, select `Web application`.
2. Any **Name** can be set.
3. Leave **Authorised JavaScript origins** and **Authorised redirect URIs** empty.

We will revisit the **Authorised redirect URIs** field later, as we do not have Pangolin set up for Google yet.

After hitting "Create", you will be able to see the **Client ID** and **Client secret**, you may want to copy these somewhere as these will be needed momentarily, though they will still be accessible in the future.

## 2. Configuring Identity Providers in Pangolin
In Pangolin, go to the **Server Admin** section. Select "Identity Providers" before proceeding with the "Add Identity Provider" button.

**Name** should be set to something memorable. The **Provider Type** should be set to the default `OAuth2/OIDC`.

### 2.1 OAuth2/OIDC Configuration (Provider Credentials and Endpoints)
In the OAuth2/OIDC Configuration, you'll need the following fields:

1. **Client ID** is the Client ID from your Web application client.
2. **Client Secret** is the Client secret from your Web application client.
3. **Authorization URL** should be set to `https://accounts.google.com/o/oauth2/v2/auth`.
4. **Token URL** should be set to `https://oauth2.googleapis.com/token`.

## Token Configuration
You should leave all of paths default. In the **Scopes** field, add `openid profile email`.

:::warning
Currently, the only way to obtain your `sub` identifier attribute via Google is through direct API access. For now, set the **Identifier Path** to `email` and in the **Username** field, and use the associated account's email. We highly recommend increasing the resilience of your Google SSO by setting the optional **Name** field to match the account's (full name attached to their Google account).
:::

When you're done, click "Create Identity Provider"! Then, copy the Redirect URL in the "General" tab as you will now need this for your **Web application client**.

## 3. Returning to Google Developers Console

Lastly, you'll need to return to your **Web application client** in order to add the redirect URI created by Pangolin. Add the URI to **Authorized redirect URIs**, then hit "Save"! Your configuration should now be complete. You'll now need to add an [External User](#Setting_up_an_External_User) to Pangolin, or if you have "Auto Provision Users" enabled, you can now log in using Google SSO.

## Setting up an External User
In Pangolin, go to the **Organization** that you want to create a user for, and select the **Users** tab. Proceed by pressing the "Create User" button, and fill in the details.

1. Choose **External User** and change the **Identity Provider** to your SSO.
2. Set the **Username** to the identifier path. This will either be the `sub` or `email` depending on your setup. If you aren't sure, set the username to the associated account's email.
3. Then, choose a role for the user. This will determine what they are allowed to do when logged into the Pangolin dashboard.

Proceed with "Create User" and you should now be able to sign into Google with the account associated with the External User you created.
