# Portfolio Platform - REST API Guidelines & Specifications

This document defines the RESTful conventions, query parameters, standardized response schemas, and endpoint catalog for the **Portfolio Platform Backend API**.

---

## 1. REST Conventions

- **Base URL**: `/api` (e.g., `http://localhost:5000/api` or `https://<production-domain>/api`)
- **Format**: JSON payloads for all incoming and outgoing data (`Content-Type: application/json`).
- **Authentication**: Bearer token passed in the standard HTTP header:
  ```http
  Authorization: <jwt_token>
  ```

---

## 2. Standardized Response Formats

### Success Response Envelope (`sendResponse`)
All successful HTTP responses conform to the following JSON structure:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects retrieved successfully",
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

Endpoints supporting resource listings leverage the modular `QueryBuilder` supporting:

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `searchTerm` | `string` | `?searchTerm=react` | Performs case-insensitive regex search across indexed searchable fields |
| `sort` | `string` | `?sort=-createdAt` | Sorts fields ascending (`name`) or descending (`-createdAt`) |
| `page` | `number` | `?page=2` | Pagination page number (default: `1`) |
| `limit` | `number` | `?limit=10` | Number of documents per page (default: `10`) |
| `fields` | `string` | `?fields=name,technologies` | Field projection (comma-separated list of fields) |
| `<filterField>` | `string` | `?isPublished=true` | Direct key-value exact matching for model fields |

---

## 4. Complete Endpoint Catalog

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Login with email and password |
| `POST` | `/api/auth/refresh-token` | Public | Issue new access token using refresh token |
| `POST` | `/api/auth/change-password` | Authenticated | Change password for current logged-in user |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset link to registered email |
| `POST` | `/api/auth/reset-password` | Public | Reset password using verified token |

### Users (`/api/user`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/create-user` | Public | Register new user account |
| `GET` | `/api/user/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/user` | Admin | Retrieve all users |
| `PATCH` | `/api/user/:id` | Authenticated | Update user profile |
| `DELETE` | `/api/user/:id` | Admin | Soft-delete a user |

### Projects (`/api/project`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/project/create-project` | Admin | Create a new portfolio project |
| `GET` | `/api/project` | Public | Get all projects (supports QueryBuilder) |
| `GET` | `/api/project/:id` | Public | Get single project by ID |
| `PATCH` | `/api/project/:id` | Admin | Update project details |
| `DELETE` | `/api/project/:id` | Admin | Delete a project |

### Skills (`/api/skills`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/skills/create-skill` | Admin | Create new skill entry |
| `GET` | `/api/skills` | Public | Get all skills |
| `GET` | `/api/skills/:id` | Public | Get single skill |
| `PATCH` | `/api/skills/:id` | Admin | Update skill entry |
| `DELETE` | `/api/skills/:id` | Admin | Delete a skill |

### Qualifications (`/api/qualifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/qualifications/create-qualification` | Admin | Create qualification record |
| `GET` | `/api/qualifications` | Public | Get all qualifications |
| `GET` | `/api/qualifications/:id` | Public | Get single qualification |
| `PATCH` | `/api/qualifications/:id` | Admin | Update qualification |
| `DELETE` | `/api/qualifications/:id` | Admin | Delete qualification |

### Blogs (`/api/blogs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/blogs/create-blog` | Admin | Create new blog post |
| `GET` | `/api/blogs` | Public | Get all published blogs (supports QueryBuilder) |
| `GET` | `/api/blogs/:id` | Public | Get single blog post |
| `PATCH` | `/api/blogs/:id` | Admin | Update blog post |
| `DELETE` | `/api/blogs/:id` | Admin | Delete blog post |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews/create-review` | Authenticated | Submit a review/testimonial |
| `GET` | `/api/reviews` | Public | Get all reviews |
| `GET` | `/api/reviews/:id` | Public | Get single review |
| `PATCH` | `/api/reviews/:id` | Authenticated | Update review |
| `DELETE` | `/api/reviews/:id` | Admin | Delete review |

---

## 5. HTTP Status Code Standard

| Status Code | Usage Scenario |
| :--- | :--- |
| `200 OK` | Successful retrieval, modification, or standard operation |
| `201 Created` | Successful creation of a new resource (`Project`, `Blog`, `User`, etc.) |
| `400 Bad Request` | Zod validation failure or malformed payload |
| `401 Unauthorized` | Missing, expired, or invalid JWT token |
| `403 Forbidden` | Valid token but insufficient permissions (e.g., non-admin accessing admin route) |
| `404 Not Found` | Requested resource ID not found |
| `409 Conflict` | Duplicate resource (e.g., unique email constraint) |
| `500 Internal Server Error` | Unhandled runtime exception caught by `globalErrorHandler` |
