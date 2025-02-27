API documentation for pangolin. This documentation includes public endpoints, request/response formats, usage examples, and any limitations or constraints.

## API Documentation

### Base URL
```
https://pangolin.yourdomain.com/v1
```

### 1. Public Endpoints

#### 1.1 User Management

- **Create User**
  - **Endpoint:** `POST /users`
  - **Description:** Creates a new user account.
  - **Request Format:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword",
      "name": "John Doe"
    }
    ```
  - **Response Format:**
    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-02-18T20:51:00Z"
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X POST https://pangolin.yourdomain.com/v1/users \
         -H "Content-Type: application/json" \
         -d '{"email":"user@example.com","password":"securepassword","name":"John Doe"}'
    ```
  - **Limitations:** Email must be unique.

- **Get User**
  - **Endpoint:** `GET /users/{id}`
  - **Description:** Retrieves user information by ID.
  - **Response Format:**
    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-02-18T20:51:00Z"
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X GET https://pangolin.yourdomain.com/v1/users/user_id
    ```

#### 1.2 Authentication

- **Login User**
  - **Endpoint:** `POST /auth/login`
  - **Description:** Authenticates a user and returns an access token.
  - **Request Format:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
  - **Response Format:**
    ```json
    {
      "token": "access_token",
      "expiresIn": 3600
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X POST https://pangolin.yourdomain.com/v1/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"user@example.com","password":"securepassword"}'
    ```

#### 1.3 Resource Management

- **Create Resource**
  - **Endpoint:** `POST /resources`
  - **Description:** Creates a new resource.
  - **Request Format:**
    ```json
    {
      "name": "Resource Name",
      "type": "HTTP",
      "url": "https://example.com"
    }
    ```
  - **Response Format:**
    ```json
    {
      "id": "resource_id",
      "name": "Resource Name",
      "type": "HTTP",
      "url": "https://example.com",
      "createdAt": "2025-02-18T20:51:00Z"
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X POST https://pangolin.yourdomain.com/v1/resources \
         -H "Authorization: Bearer access_token" \
         -H "Content-Type: application/json" \
         -d '{"name":"Resource Name","type":"HTTP","url":"https://example.com"}'
    ```

- **Get Resource**
  - **Endpoint:** `GET /resources/{id}`
  - **Description:** Retrieves resource information by ID.
  - **Response Format:**
    ```json
    {
      "id": "resource_id",
      "name": "Resource Name",
      "type": "HTTP",
      "url": "https://example.com",
      "createdAt": "2025-02-18T20:51:00Z"
    }
    ```
  - **Usage Example:**
    ```bash
    curl -X GET https://pangolin.yourdomain.com/v1/resources/resource_id \
         -H "Authorization: Bearer access_token"
    ```

#### 1.4 Invite Management

- **Send Invite**
  - **Endpoint:** `POST /invites`
  - **Description:** Sends an invite to a user.
  - **Request Format:**
    ```json
    {
      "email": "invitee@example.com"
    }
    ```
  - **Response Format:**
    ```json
    {
      "inviteId": "invite_id",
      "status": "sent"
    }
    ```
  - **Usage Example:**
   ```bash
   curl -X POST https://pangolin.yourdomain.com/v1/invites \
        -H 'Authorization: Bearer access_token' \
        -H 'Content-Type: application/json' \
        -d '{"email":"invitee@example.com"}'
   ```

### 2. Request/Response Formats

All requests should include the appropriate headers, particularly `Content-Type` set to `application/json` for JSON payloads and an `Authorization` header for authenticated requests.

### 3. Usage Examples

Examples of how to interact with the API are included in the endpoint descriptions above using `curl`. These examples illustrate how to make requests and handle responses.

### 4. Limitations or Constraints

- Each email address must be unique when creating a user.
- Resources must be associated with an organization, and users must have appropriate permissions to create or manage resources.
- Rate limits may apply to API calls (not specified in the current documentation but should be implemented to prevent abuse).
- Ensure that sensitive data (like passwords) is transmitted securely over HTTPS.

This documentation provides a foundational overview of the API's public endpoints, request/response formats, usage examples, and any limitations. We will expand upon this as our API evolves or as additional features are added.