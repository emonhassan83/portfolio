# Portfolio Platform - System Architecture & Engineering Blueprint

This document details the software architecture, component boundaries, data relationships, and design patterns governing the **Portfolio Platform**.

---

## 1. High-Level System Architecture

The Portfolio Platform is architected as a decoupled multi-tier web application consisting of a **Next.js 15** frontend (App Router, Tailwind CSS, DaisyUI, Redux Toolkit), an **Express.js (TypeScript)** REST API server, and a **MongoDB** document database accessed via **Mongoose ODM**.

```mermaid
graph TD
    Client["Client: Next.js 15 (React 19, Redux Toolkit, DaisyUI)"]
    Server["API Server: Node.js / Express.js (TypeScript)"]
    DB[("MongoDB Database (Mongoose ODM)")]
    SMTP["Google SMTP / Email Service (Nodemailer)"]

    Client -->|HTTPS / REST API JSON| Server
    Server -->|Mongoose Documents & Aggregation| DB
    Server -->|Password Reset / Contact Emails| SMTP
```

---

## 2. Layered Server Architecture

The server adheres to a strict modular layered design where every incoming HTTP request flows sequentially through dedicated concerns:

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Express Router (/api)
    participant Auth as Auth Middleware (JWT & RBAC)
    participant Validator as Zod Request Validator
    participant Controller as Express Controller
    participant Service as Business Service
    participant QB as QueryBuilder (Filter/Search/Sort/Page)
    participant Model as Mongoose Model
    participant DB as MongoDB Database

    Client->>Router: HTTP Request (Method, Route, Headers)
    Router->>Auth: Validate Access Token & User Role
    Auth->>Validator: Validate Request Body / Params (Zod)
    Validator->>Controller: Route to Controller Handler
    Controller->>Service: Execute Business Logic with Sanitized Payload
    Service->>QB: Apply dynamic search, filter, sort & pagination
    QB->>Model: Execute Mongoose Query
    Model->>DB: MongoDB Query Execution
    DB-->>Model: BSON Document(s)
    Model-->>Service: Hydrated Mongoose Document(s)
    Service-->>Controller: Return Business Result
    Controller-->>Client: Standardized JSON Response (sendResponse)
```

### Layer Responsibilities:
1. **Router (`*.route.ts`)**: Defines endpoint paths and HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). Injects middleware (`auth`, `validateRequest`).
2. **Middleware (`middleware/`)**:
   - `auth.ts`: Verifies incoming JWT Bearer tokens and checks role permissions (`admin`, `user`).
   - `validateRequest.ts`: Executes Zod schemas on `req.body`, `req.cookies`, or `req.params`.
   - `globalErrorHandler.ts`: Central error translation formatting all exceptions into a consistent schema.
3. **Controller (`*.controller.ts`)**: Extracts input arguments, calls corresponding service methods wrapped in `catchAsync`, and invokes `sendResponse()`.
4. **Service (`*.service.ts`)**: Encapsulates core business logic, query composition via `QueryBuilder`, data transformations, and model operations.
5. **Model (`*.model.ts`)**: Mongoose schema definitions with validation constraints, password hashing hooks (`pre('save')`), and static helper methods.

---

## 3. Data Model & Entity Relationships

```mermaid
erDiagram
    USER ||--o{ BLOG : "authors"
    USER ||--o{ REVIEW : "submits"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string contactNumber
        string address
        string photoUrl
        string role "admin | user"
        string status "active | blocked"
        string gender "male | female | unknown"
        boolean isDeleted
        date createdAt
        date updatedAt
    }

    PROJECT {
        ObjectId _id PK
        string name
        string image
        string description
        string features
        string technologies
        string duration
        string live_site_url
        string client_site_url
        string server_site_url
        date createdAt
        date updatedAt
    }

    BLOG {
        ObjectId _id PK
        string name
        string banner
        string description
        string images
        string tags
        ObjectId author FK
        boolean isPublished
        date createdAt
        date updatedAt
    }

    SKILL {
        ObjectId _id PK
        string name
        string image
        date createdAt
        date updatedAt
    }

    QUALIFICATION {
        ObjectId _id PK
        string name
        string designation
        string description
        string duration
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId user FK
        number rating
        string content
        date createdAt
        date updatedAt
    }
```

---

## 4. Frontend State & Architecture

The Next.js 15 frontend leverages **Redux Toolkit** and **RTK Query** for efficient client-side caching and automated cache invalidation:

- **Centralized API (`baseApi.js`)**: Base RTK Query slice defining headers, authentication token attachment, and cache tags (`Auth`, `Users`, `Project`, `Blogs`, `Skills`, `Qualifications`, `Reviews`).
- **Feature APIs (`src/redux/features/*Api.js`)**: Module-specific endpoints (e.g., `getProjects`, `createProject`, `updateProject`, `deleteProject`) injected into `baseApi`.
- **Redux Persist**: Persists authentication credentials (user identity, access token) in client storage for seamless session continuity.
- **App Router Directory Structure**:
  - `(main)`: Public layout for portfolio visitors (Hero, Projects, Blogs, Contact).
  - `dashboard`: Protected backoffice layout for authorized administrative content curation.
  - `login` & `register`: Authentication portal.
