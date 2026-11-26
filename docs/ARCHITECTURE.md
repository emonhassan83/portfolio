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
   - `auth.ts`: Verifies the JWT session cookie, reads role and tokenVersion from the database and checks role permissions (`admin`, `user`).
   - `validateRequest.ts`: Executes Zod schemas on `req.body`, `req.cookies`, or `req.params`.
   - `globalErrorHandler.ts`: Central error translation formatting all exceptions into a consistent schema.
3. **Controller (`*.controller.ts`)**: Extracts input arguments, calls corresponding service methods wrapped in `catchAsync`, and invokes `sendResponse()`.
4. **Service (`*.service.ts`)**: Encapsulates core business logic, query composition via `QueryBuilder`, data transformations, and model operations.
5. **Model (`*.model.ts`)**: Mongoose schema definitions with validation constraints, password hashing hooks (`pre('save')`), and static helper methods.

---

## 3. Data Model & Entity Relationships

```mermaid
erDiagram
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

    MESSAGE {
        ObjectId _id PK
        string name
        string email
        string message
        string status "new | read | replied | archived"
        string note
        date readAt
        date repliedAt
        date createdAt
        date updatedAt
    }

    PORTFOLIO_PROFILE {
        ObjectId _id PK
        object hero_about_contact_seo "singleton"
    }

    PORTFOLIO_ITEM {
        ObjectId _id PK
        string resource "experience | projects | stack | practices | credentials"
        number order
        boolean hidden
    }
```

---

## 4. Frontend State & Architecture

The Next.js 15 frontend leverages **Redux Toolkit** and **RTK Query** for efficient client-side caching and automated cache invalidation:

- **Centralized API (`baseApi.js`)**: Base RTK Query slice defining headers, the CSRF header, silent session refresh on 401, and cache tags (`Auth`, `Portfolio`, `Messages`).
- **Feature APIs (`src/redux/features/*Api.js`)**: Module-specific endpoints (`portfolioApi`, `messageApi`, `auth/`) injected into `baseApi`.
- **Redux Persist**: Persists only non-sensitive user info (name, email, role) for the UI. Session tokens are httpOnly cookies and are never stored in Redux or browser storage.
- **App Router Directory Structure**:
  - `(portfolio)`: The public home page `/` (Hero, Experience, Case Studies, Stack, Practices, Credentials, Contact).
  - `dashboard`: Protected backoffice layout for authorized administrative content curation.
  - `login` & `register`: Authentication portal.
