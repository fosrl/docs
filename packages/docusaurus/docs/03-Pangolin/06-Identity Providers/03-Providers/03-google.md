# Google

Follow these steps to integrate **Google** with **Pangolin SSO** using OpenID Connect (OIDC)

## 1. Prerequisites

You need to configure a Project on the Google Developer Console:

1. Head over to https://console.developers.google.com/apis/credentials
2. Create a project:
    1. Set the name to something memorable (eg. Pangolin)
    2. You can set an organization but this is entirely optional for a homelab environment
    3. Click "Create"
3. Now you should be one the overview page for the new project. Here it should tell you that Google Auth Platform is not configured yet, click the button below.
    1. Set the app name to something memorable. Note this will be shown to users, so choose wisely (eg. Pangolin)
    2. Select your E-Mail address as the support contact
    3. Click "Next"
    4. For the target audience, select "External"
    5. Click "Next"
    6. Enter your E-Mail again
    7. Click "Next"
    8. Accept the conditions and click "Next" for the last time
    9. Now hit "Create" below

## 2. Create an OIDC Client in your Google Project

1. Go to the "Clients" Section in the sidebar
2. Click "Create Client" above the table on the page
    1. For the Application Type, select Web Application
    2. Set the name to something memorable (eg. Pangolin)
    3. Click "Create"

You will now see a pop up with a few values. Write down the Client ID and Client Secret somewhere or download the JSON file

## 3. Configure an Identity Provider in Pangolin

In Pangolin, go to `Identity Providers` and click "Add Identity Provider":

1. Set the name to something memorable (eg. Google)
2. In the "OAuth2/OIDC Configuration" section, fill the following fields:
    1. Client ID: You should have the value for this from the Google setup earlier
    2. Client Secret: You should also have this value
    3. Authorization URL: `https://accounts.google.com/o/oauth2/v2/auth`
    4. Token URL: `https://oauth2.googleapis.com/token`
3. In the "Token Configuration" section, set "Identifier Path" to "email"

When you're done, click "Create Identity Provider"

Now copy the Redirect URL displayed in the "General Settings" section

## 4. Complete the Setup in your Google Project

Lastly, you need to edit your OAuth Client in your Google project. Add the URL you copied to the "Authorized Callback URIs", then hit "Save"

## 5. Ready to Test!

The configuration is now complete. If you've configured a user (see below), try logging in!

## User Configuration in Pangolin

:::note

The username has to be the E-Mail address. The JWT provided by Google technically has a `sub` attribute with an ID, but this is hard to find without manually decoding the JWT.
:::

To create a user in an Organization, Set the following:

- "User Type": "External User
- "Identity Provider": The name you set for the identity provider (we'll assume "Google" here)
- "Role": Whatever role you want to give the user

The other fields are optional
