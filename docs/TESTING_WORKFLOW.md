# Portfolio Platform - Testing & Quality Assurance Workflow

This document outlines the testing protocols, linting gates, security verification, and API validation workflows for the **Portfolio Platform**.

---

## 1. Quality Assurance Pipeline

Before committing or releasing new features, execute the following verification steps:

```bash
# 1. Verify Server TypeScript Compilation
cd server
npm run build

# 2. Run Server Linter
npm run lint

# 3. Verify Client Next.js Build
cd ../client
npm run build

# 4. Verify Dependency Security (Both client and server must report 0 vulnerabilities)
npm audit
cd ../server
npm audit
```

---

## 2. API Functional Validation (cURL Workflows)

Set your base URL variable:
```bash
BASE_URL="http://localhost:5000/api"
```

### 1. Authentication Flow
```bash
# Register User
curl -X POST "$BASE_URL/user/create-user" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emon Hasan",
    "email": "admin@portfolio.com",
    "password": "Password123!",
    "contactNumber": "+8801700000000",
    "address": "Dhaka, Bangladesh",
    "role": "admin",
    "gender": "male"
  }'

# Login to Obtain JWT Token
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@portfolio.com",
    "password": "Password123!"
  }'
```
*Save the returned `accessToken` for subsequent authenticated calls:*
```bash
TOKEN="<your_jwt_access_token>"
```

---

### 2. Projects API
```bash
# Create Project (Admin Only)
curl -X POST "$BASE_URL/project/create-project" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "name": "Portfolio Website",
    "image": "https://example.com/project.png",
    "description": "Fullstack developer portfolio with CMS dashboard.",
    "features": "Next.js 15, DaisyUI dark mode, RTK Query caching",
    "technologies": "Next.js, TypeScript, Express, MongoDB, Tailwind",
    "duration": "2 weeks",
    "live_site_url": "https://portfolio.example.com",
    "client_site_url": "https://github.com/emonhassan83/portfolio-client",
    "server_site_url": "https://github.com/emonhassan83/portfolio-server"
  }'

# Get Projects with Search & Pagination
curl -X GET "$BASE_URL/project?searchTerm=portfolio&page=1&limit=5&sort=-createdAt"

# Get Single Project
curl -X GET "$BASE_URL/project/<project_id>"
```

---

### 3. Skills API
```bash
# Create Skill (Admin Only)
curl -X POST "$BASE_URL/skills/create-skill" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "name": "Next.js",
    "image": "https://cdn.worldvectorlogo.com/logos/next-js.svg"
  }'

# Get All Skills
curl -X GET "$BASE_URL/skills"
```

---

### 4. Qualifications API
```bash
# Create Qualification (Admin Only)
curl -X POST "$BASE_URL/qualifications/create-qualification" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "name": "B.Sc. in Computer Science & Engineering",
    "designation": "Student",
    "description": "Graduated with honors focusing on software engineering and algorithms.",
    "duration": "2020 - 2024"
  }'

# Get All Qualifications
curl -X GET "$BASE_URL/qualifications"
```

---

### 5. Blogs API
```bash
# Create Blog (Admin Only)
curl -X POST "$BASE_URL/blogs/create-blog" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "name": "Building Scalable Web Apps with Next.js 15",
    "banner": "https://example.com/blog-banner.png",
    "description": "Deep dive into App Router, Server Components, and RTK Query integration.",
    "images": "https://example.com/blog-detail.png",
    "tags": "nextjs,react,webdev",
    "isPublished": true
  }'

# Get All Published Blogs
curl -X GET "$BASE_URL/blogs?isPublished=true"
```

---

### 6. Reviews API
```bash
# Submit Review (Authenticated User)
curl -X POST "$BASE_URL/reviews/create-review" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "rating": 5,
    "content": "Outstanding full-stack developer with exceptional attention to detail."
  }'

# Get All Reviews
curl -X GET "$BASE_URL/reviews"
```

---

## 3. Negative & Security Edge Cases

- **Validation Failure (`400 Bad Request`)**: Test submitting missing required fields (e.g. omitting `email` on login). Confirm `globalErrorHandler` returns `errorSources` detailing the exact Zod path.
- **Unauthorized (`401 Unauthorized`)**: Call an admin endpoint (e.g. `POST /api/project/create-project`) without the `Authorization` header.
- **Forbidden (`403 Forbidden`)**: Call an admin endpoint with a valid token belonging to a `user` role account.
- **Resource Not Found (`404 Not Found`)**: Request `/api/project/000000000000000000000000` (valid ObjectId that does not exist).
