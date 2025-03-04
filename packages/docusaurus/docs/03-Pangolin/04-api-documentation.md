# API Documentation

Initial API documentation for pangolin. This documentation includes public endpoints, request/response formats, usage examples, and any limitations or constraints. This document is not complete but will be added to over time to compass more of the API.

### Base URL
```
https://pangolin.yourdomain.com/api/v1/
```

I'll create an improved API documentation based on the files provided. Here's the updated markdown:

## 1. Public Endpoints

### 1.1 User Management

- **Get User**
  - **Endpoint:** `GET /user`
  - **Description:** Retrieves information about the currently authenticated user.
  - **Authentication:** Session cookie required
  - **Response Format:**
    ```json
    {
      "data": {
        "userId": "user_id",
        "email": "user@example.com",
        "twoFactorEnabled": false,
        "emailVerified": true,
        "serverAdmin": false
      },
      "success": true,
      "error": false,
      "message": "User retrieved successfully",
      "status": 200
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X GET https://api.yourdomain.com/user -b "session=your_session_cookie"
    ```

### 1.2 Authentication

- **Login User**
  - **Endpoint:** `POST /auth/login`
  - **Description:** Authenticates a user and creates a session cookie.
  - **Request Format:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword",
      "code": "123456" // Optional: Two-factor authentication code if enabled
    }
    ```
  - **Response Format (Standard):**
    ```json
    {
      "data": null,
      "success": true,
      "error": false,
      "message": "Logged in successfully",
      "status": 200
    }
    ```
  - **Response Format (2FA Required):**
    ```json
    {
      "data": {
        "codeRequested": true
      },
      "success": true,
      "error": false,
      "message": "Two-factor authentication required",
      "status": 202
    }
    ```
  - **Response Format (Email Verification Required):**
    ```json
    {
      "data": {
        "emailVerificationRequired": true
      },
      "success": true,
      "error": false,
      "message": "Email verification code sent",
      "status": 200
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X POST https://api.yourdomain.com/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"user@example.com","password":"securepassword"}'
    ```

### 1.3 Resource Management

- **Create Resource**
  - **Endpoint:** `PUT /org/{orgId}/site/{siteId}/resource`
  - **Description:** Creates a new resource for a specific organization and site.
  - **Authentication:** Session cookie required
  - **Request Format (HTTP Resource):**
    ```json
    {
      "name": "Resource Name",
      "subdomain": "mysubdomain", // Optional
      "isBaseDomain": false, // Optional
      "http": true,
      "protocol": "https",
      "domainId": "domain_id"
    }
    ```
  - **Request Format (Raw Resource):**
    ```json
    {
      "name": "Resource Name",
      "http": false,
      "protocol": "tcp",
      "proxyPort": 8080
    }
    ```
  - **Response Format:**
    ```json
    {
      "data": {
        "resourceId": 123,
        "siteId": 456,
        "fullDomain": "mysubdomain.example.com",
        "domainId": "domain_id",
        "orgId": "org_id",
        "name": "Resource Name",
        "subdomain": "mysubdomain",
        "http": true,
        "protocol": "https",
        "ssl": true,
        "isBaseDomain": false
      },
      "success": true,
      "error": false,
      "message": "Http resource created successfully",
      "status": 201
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X PUT https://api.yourdomain.com/org/org_id/site/456/resource \
         -b "session=your_session_cookie" \
         -H "Content-Type: application/json" \
         -d '{"name":"Resource Name","http":true,"protocol":"https","domainId":"domain_id"}'
    ```

- **Get Resource**
  - **Endpoint:** `GET /resource/{resourceId}`
  - **Description:** Retrieves resource information by ID.
  - **Authentication:** Session cookie required
  - **Response Format:**
    ```json
    {
      "data": {
        "resourceId": 123,
        "siteId": 456,
        "fullDomain": "mysubdomain.example.com",
        "domainId": "domain_id",
        "orgId": "org_id",
        "name": "Resource Name",
        "subdomain": "mysubdomain",
        "http": true,
        "protocol": "https",
        "ssl": true,
        "isBaseDomain": false
      },
      "success": true,
      "error": false,
      "message": "Resource retrieved successfully",
      "status": 200
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X GET https://api.yourdomain.com/resource/123 \
         -b "session=your_session_cookie"
    ```

### 1.4 Invite Management

- **Send Invite**
  - **Endpoint:** `POST /org/{orgId}/create-invite`
  - **Description:** Sends an invite to a user to join an organization.
  - **Authentication:** Session cookie required
  - **Request Format:**
    ```json
    {
      "email": "invitee@example.com",
      "roleId": 123,
      "validHours": 24,
      "sendEmail": true // Optional
    }
    ```
  - **Response Format:**
    ```json
    {
      "data": {
        "inviteLink": "https://dashboard.yourdomain.com/invite?token=abc123def456",
        "expiresAt": 1708380000000
      },
      "success": true,
      "error": false,
      "message": "User invited successfully",
      "status": 200
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X POST https://api.yourdomain.com/org/org_id/create-invite \
         -b "session=your_session_cookie" \
         -H "Content-Type: application/json" \
         -d '{"email":"invitee@example.com","roleId":123,"validHours":24,"sendEmail":true}'
    ```

## 2. Request/Response Formats

All requests should include the appropriate headers, particularly `Content-Type` set to `application/json` for JSON payloads and an `Authorization` header for authenticated requests.

## 3. Usage Examples

Examples of how to interact with the API are included in the endpoint descriptions above using `curl`. These examples illustrate how to make requests and handle responses.

## 4. Limitations or Constraints

- Each email address must be unique when creating a user.
- Resources and sites must be associated with an organization, and users must have appropriate permissions to create or manage resources.
- Rate limits apply to API calls.

This documentation provides a foundational overview of the API's public endpoints, request/response formats, usage examples, and any limitations. We will expand upon this as our API evolves and we have more time to document endpoints and as additional features are added.
