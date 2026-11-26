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

## 2. Automated Server Tests

`cd server && npm test` runs the suites in `server/tests/` (`auth-security`, `totp`, `messages`) with Node's test runner against an in-memory MongoDB. They cover the multi-step login, lockout, token revocation, two-factor, CSRF header checks and the contact message endpoints.

---

## 2a. API Functional Validation (cURL Workflows)

Set your base URL variable:
```bash
BASE_URL="http://localhost:5000/api"
```

Sessions are httpOnly cookies and every state-changing request needs the CSRF header `X-Requested-With: portfolio-dashboard`. Use a cookie jar (`-c cookies.txt` / `-b cookies.txt`) for authenticated calls. The login flow has several steps (password, then security question or two-factor code); see [AUTHENTICATION.md](AUTHENTICATION.md).

### 1. Public Endpoints
```bash
# Home page content
curl -X GET "$BASE_URL/portfolio"

# Contact form submission
curl -X POST "$BASE_URL/messages"   -H "Content-Type: application/json"   -H "X-Requested-With: portfolio-dashboard"   -d '{ "name": "Test Visitor", "email": "visitor@example.com", "message": "Hello from the test workflow." }'
```

### 2. Admin Endpoints (cookie session required)
```bash
# List portfolio experience items
curl -X GET "$BASE_URL/portfolio/experience" -b cookies.txt

# List new contact messages
curl -X GET "$BASE_URL/messages?status=new&page=1&limit=10" -b cookies.txt

# Mark a message as read
curl -X PATCH "$BASE_URL/messages/<message_id>"   -H "Content-Type: application/json"   -H "X-Requested-With: portfolio-dashboard"   -b cookies.txt   -d '{ "status": "read" }'
```

---

## 3. Negative & Security Edge Cases

- **Validation Failure (`400 Bad Request`)**: Test submitting missing required fields (e.g. omitting `email` on login). Confirm `globalErrorHandler` returns `errorSources` detailing the exact Zod path.
- **Unauthorized (`401 Unauthorized`)**: Call an admin endpoint (e.g. `GET /api/portfolio/experience`) without a session cookie.
- **Forbidden (`403 Forbidden`)**: Call an admin endpoint with a valid session belonging to a `user` role account.
- **Resource Not Found (`404 Not Found`)**: Request `/api/messages/000000000000000000000000` (as admin, with the CSRF header on `PATCH`) (valid ObjectId that does not exist).
