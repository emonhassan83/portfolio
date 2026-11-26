# Portfolio Platform - REST API Guidelines & Specifications

This document defines the RESTful conventions, query parameters, standardized response schemas, and endpoint catalog for the **Portfolio Platform Backend API**.

---

## 1. REST Conventions

- **Base URL**: `/api` (e.g., `http://localhost:5000/api` or `https://<production-domain>/api`)
- **Format**: JSON payloads for all incoming and outgoing data (`Content-Type: application/json`).
- **Authentication**: httpOnly session cookies set by `/api/auth/*` (no token in headers or browser storage). State-changing requests must also send the CSRF header `X-Requested-With: portfolio-dashboard`. See [AUTHENTICATION.md](AUTHENTICATION.md).

---

## 2. Standardized Response Formats

### Success Response Envelope (`sendResponse`)
All successful HTTP responses conform to the following JSON structure:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Messages retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPage": 3
  },
  "data": [ ... ]
}
```

### Error Response Envelope (`globalErrorHandler`)
When an exception or validation failure occurs, the response matches:
```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "name",
      "message": "Name is required"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

---

## 3. QueryBuilder Parameters

Admin listing endpoints that use the modular `QueryBuilder` (for example the user list) support:

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `searchTerm` | `string` | `?searchTerm=react` | Performs case-insensitive regex search across indexed searchable fields |
| `sort` | `string` | `?sort=-createdAt` | Sorts fields ascending (`name`) or descending (`-createdAt`) |
| `page` | `number` | `?page=2` | Pagination page number (default: `1`) |
| `limit` | `number` | `?limit=10` | Number of documents per page (default: `10`) |
| `fields` | `string` | `?fields=name,email` | Field projection (comma-separated list of fields) |
| `<filterField>` | `string` | `?status=new` | Direct key-value exact matching for model fields |

---

## 4. Complete Endpoint Catalog

### Authentication (`/api/auth`)
Login is multi-step; see [AUTHENTICATION.md](AUTHENTICATION.md) for the flow.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Step 1: email and password |
| `POST` | `/api/auth/login/verify` | Public | Step 2: security-question answer |
| `POST` | `/api/auth/login/2fa` | Public | Complete login with a TOTP or backup code |
| `POST` | `/api/auth/login/recover` | Public | Recover access with the security answer |
| `POST` | `/api/auth/refresh-token` | Cookie | Issue a new access cookie from the refresh cookie |
| `POST` | `/api/auth/logout` | Public | Clear the session cookies |
| `GET` | `/api/auth/me` | Authenticated | Current session user |
| `POST` | `/api/auth/change-password` | Authenticated | Change password |
| `POST` | `/api/auth/forget-password` | Public | Send a password reset link |
| `POST` | `/api/auth/reset-password` | Public | Reset password using the emailed token |
| `POST` | `/api/auth/2fa/setup` | Authenticated | Begin TOTP setup |
| `POST` | `/api/auth/2fa/enable` | Authenticated | Confirm and enable TOTP |
| `POST` | `/api/auth/2fa/disable` | Authenticated | Disable TOTP (password and code) |
| `POST` | `/api/auth/2fa/backup-codes` | Authenticated | Regenerate backup codes |
| `PUT` | `/api/auth/security-question` | Authenticated | Set the optional security question |
| `DELETE` | `/api/auth/security-question` | Authenticated | Remove the security question |

### Users (`/api/user`)
Public sign-up is disabled; only an admin can create accounts.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | Admin | Create a user account |
| `GET` | `/api/user/users` | Admin | List all users |
| `GET` | `/api/user/my-profile` | Authenticated | Current user profile |
| `PUT` | `/api/user/update-user/:id` | Authenticated | Update profile (non-admins only their own) |
| `PATCH` | `/api/user/change-role` | Admin | Change a user's role |
| `PATCH` | `/api/user/change-status` | Admin | Change a user's status |
| `PATCH` | `/api/user/soft-delete` | Admin | Soft-delete a user |
| `DELETE` | `/api/user/delete-user/:id` | Admin | Permanently delete a user |

### Portfolio content (`/api/portfolio`)
Content for the home page. `:resource` is one of `experience`, `projects` (case studies), `stack`, `practices`, `credentials`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio` | Public | Everything the home page renders |
| `GET` | `/api/portfolio/profile` | Admin | Profile and hero singleton |
| `PUT` | `/api/portfolio/profile` | Admin | Update the profile singleton |
| `POST` | `/api/portfolio/import` | Admin | One-time import of the default content |
| `GET` | `/api/portfolio/:resource` | Admin | List a collection |
| `POST` | `/api/portfolio/:resource` | Admin | Create an item |
| `PATCH` | `/api/portfolio/:resource/reorder` | Admin | Reorder items |
| `PUT` | `/api/portfolio/:resource/:id` | Admin | Update an item |
| `DELETE` | `/api/portfolio/:resource/:id` | Admin | Delete an item |

### Contact messages (`/api/messages`)
Inbox for the home page contact form. Statuses: `new` → `read` → `replied` → `archived`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/messages` | Public (5 per hour per IP) | `{ name, email, message }`. A filled `website` honeypot field gets the same 201 but is not stored |
| `GET` | `/api/messages` | Admin | `?status=&searchTerm=&page=&limit=` (limit max 100). `meta.counts` has the total per status |
| `PATCH` | `/api/messages/:id` | Admin | `{ status?, note? }`. Stamps `readAt` the first time it leaves `new`, `repliedAt` on `replied` |
| `DELETE` | `/api/messages/:id` | Admin | Delete a message |

---

## 5. HTTP Status Code Standard

| Status Code | Usage Scenario |
| :--- | :--- |
| `200 OK` | Successful retrieval, modification, or standard operation |
| `201 Created` | Successful creation of a new resource (user, portfolio item, message) |
| `400 Bad Request` | Zod validation failure or malformed payload |
| `401 Unauthorized` | Missing, expired, or invalid JWT token |
| `403 Forbidden` | Valid token but insufficient permissions (e.g., non-admin accessing admin route) |
| `404 Not Found` | Requested resource ID not found |
| `409 Conflict` | Duplicate resource (e.g., unique email constraint) |
| `500 Internal Server Error` | Unhandled runtime exception caught by `globalErrorHandler` |
