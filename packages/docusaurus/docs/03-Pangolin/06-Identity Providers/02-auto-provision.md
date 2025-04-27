# Auto Provision (Professional)

:::note

Auto provisioning users requires a paid license.

:::

Auto provisioning is a feature that allows you to automatically create and manage user accounts in Pangolin when they log in using an external identity provider. This is useful for organizations that want to streamline the onboarding process for new users and ensure that their user accounts are always up-to-date.

You will be able to programatically decide the roles and organizations for new users based on the information provided by the identity provider.

## Enable Auto Provision

Toggle the "Auth Provision Users" switch when creating or editing an identity provider.

## What if Auto Provisioning is Disabled?

If auto provision is disabled, organization admins will need to manually create the user accounts and select the role for each user. When creating a user, you can select the identity provider that the user will be associated with. A user will not be able to log in using the identity provider if a user is not pre-provisioned in the system.

## Selection Algorithm

It is helpful to think of the auto provisioning process as follows:

1. User successfully logs in using an identity provider.
2. Pangolin creates a user account for the user.
3. Pangolin will loop through each organization.
4. For each organization, Pangolin will evaluate the JMESPath expression for the organization. If the expression does not return true or the same ID as the current organization, the user will not be added to the organization.
5. For each organization, Pangolin will evaluate the JMESPath expression for the role. If no role is found with the exact name in that organization, the user will not be added to the organization.

## Organization Policies

You can configure policy for each organization with its own roles selector expression and organization selector expression.

## Default (Fallback) Policy

You can optionally configure a default policy for all organizations. This will be used if the organization does not have its own policy configured.

## Selecting Roles

Use JMESPath to map attributes from the identity provider to roles in Pangolin. See [JMESPath](https://jmespath.org/) for more information on how to use JMESPath.

The expression will be matched against each organization. Meaning:

- The result of the expression must return the exact string of the role name as it is defined in the organization.
- If no matching role is found, the user will not be added to the organization.

### Example

```
contains(groups, 'admin') && 'Admin' || 'Member'
```

```json
{
   ...
    "sub": "9590c3bfccd1b1a54b35845fb1bb950057dfa50fba43cb8bada58b462c80e207",
    "aud": "JJoSvHCZcxnXT2sn6CObj6a21MuKNRXs3kN5wbys",
    "exp": 1745790819,
    "iat": 1745789019,
    "auth_time": 1745789019,
    "email": "user@example.com",
    "email_verified": true,
    "name": "Example User",
    "groups": [
        "home-lab",
        "admin"
    ]
}
```

This example will return the string "Admin". If the user is not a member of the "admin" group, it will return "Member".

## Selecting Organizations

Use JMESPath to map attributes from the identity provider to organizations in Pangolin. See [JMESPath](https://jmespath.org/) for more information on how to use JMESPath.

The expression will be matched against each organization. Meaning:

- The result of the expression must return true or the organization ID as it is defined in the system.
- If no matching organization is found, the user will not be added to the organization.

You can insert the template variable `{{orgId}}` in the expression. This will be replaced with the organization ID when the expression is evaluated.

### Example 1

```
contains(groups, 'home-lab')
```

```json
{
   ...
    "sub": "9590c3bfccd1b1a54b35845fb1bb950057dfa50fba43cb8bada58b462c80e207",
    "aud": "JJoSvHCZcxnXT2sn6CObj6a21MuKNRXs3kN5wbys",
    "exp": 1745790819,
    "iat": 1745789019,
    "auth_time": 1745789019,
    "email": "user@example.com",
    "email_verified": true,
    "name": "Example User",
    "groups": [
        "home-lab",
        "admin"
    ]
}
```

This example will return true since the user is a member of the "home-lab" group.

### Example 2

```
'home-lab'
```

```json
{
   ...
    "sub": "9590c3bfccd1b1a54b35845fb1bb950057dfa50fba43cb8bada58b462c80e207",
    "aud": "JJoSvHCZcxnXT2sn6CObj6a21MuKNRXs3kN5wbys",
    "exp": 1745790819,
    "iat": 1745789019,
    "auth_time": 1745789019,
    "email": "user@example.com",
    "email_verified": true,
    "name": "Example User",
    "groups": [
        "home-lab",
        "admin"
    ]
}
```

This example will always return 'home-lab' meaning the user will always be added to the "home-lab" organization.

### Example 3

```
contains(groups, '{{orgId}}')
```

```json
{
   ...
    "sub": "9590c3bfccd1b1a54b35845fb1bb950057dfa50fba43cb8bada58b462c80e207",
    "aud": "JJoSvHCZcxnXT2sn6CObj6a21MuKNRXs3kN5wbys",
    "exp": 1745790819,
    "iat": 1745789019,
    "auth_time": 1745789019,
    "email": "user@example.com",
    "email_verified": true,
    "name": "Example User",
    "groups": [
        "home-lab",
        "admin"
    ]
}
```

When Pangolin evaluates this expression against the "home-lab" organization, it will replace `{{orgId}}` with "home-lab". The result of the expression will return true since the user is a member of the "home-lab" group.
