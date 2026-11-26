# Portfolio Platform - Local Development Setup Guide

This guide provides step-by-step instructions for running the **Portfolio Platform** development environment locally.

---

## 1. Prerequisites

Ensure your development environment meets the following requirements:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/portfolio`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI.
- **Git**: (`git --version`)

---

## 2. Clone the Repository

```bash
git clone https://github.com/emonhassan83/portfolio.git
cd portfolio
```

---

## 3. Backend Setup (`server/`)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Environment Variables
Copy `server/.env.example` to `server/.env` and fill in the values:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/portfolio
# Comma-separated allowlist of browser origins. The FIRST entry receives the
# revalidation call after dashboard edits.
CLIENT_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=change-me-long-random-string
JWT_REFRESH_SECRET=change-me-another-long-random-string
# Signs the 5-minute login challenge (second sign-in step). Falls back to JWT_ACCESS_SECRET.
JWT_CHALLENGE_SECRET=change-me-third-long-random-string
# Encrypts authenticator (TOTP) secrets and keys backup-code hashes. Falls back to JWT_ACCESS_SECRET.
# Changing it (or the fallback) invalidates every enrolled authenticator and backup code.
TOTP_ENCRYPTION_KEY=change-me-fourth-long-random-string
# Optional: account name shown in the authenticator app (default "Portfolio Dashboard").
TOTP_ISSUER=Portfolio Dashboard
JWT_ACCESS_EXPIRE_IN=15m
JWT_REFRESH_EXPIRE_IN=7d
# Shared with the client so the backend can refresh the cached home page after edits.
REVALIDATE_SECRET=change-me-shared-revalidate-secret
RESET_PASS_LINK=http://localhost:3000/reset-password
EMAIL=your-email@gmail.com
APP_PASS=your-google-app-password
```

### Step 3: Run the Server
```bash
# Start development server with auto-reload (ts-node-dev)
npm run dev

# Or build and test production bundle
npm run build
npm run prod
```
The server will start listening at: `http://localhost:5000`.

> **Port already in use?** If another app (for example a Docker container) holds port 5000, the dashboard gets that app's 404 ("API Not Found !!") instead of this API's ("API Not Found!!!"). Set `PORT` in `server/.env` to a free port (this machine uses `5050`), point `API_ORIGIN` / `NEXT_PUBLIC_BASE_URL` in the client env at it, and restart `npm run dev` in `client/`, since the `/api` proxy target is read at startup.

---

## 4. Frontend Setup (`client/`)

### Step 1: Install Dependencies
In a separate terminal:
```bash
cd client
npm install
```

### Step 2: Configure Environment Variables
Copy `client/.env.example` to `client/.env` (or `.env.local`) and fill in the values:
```env
# Backend origin (no /api). Browser calls to /api/* are proxied here (next.config.mjs),
# and the home page fetches content from it on the server.
API_ORIGIN=http://localhost:5000
# Must equal REVALIDATE_SECRET in server/.env
REVALIDATE_SECRET=change-me-shared-revalidate-secret
# Optional: canonical URL used for SEO metadata, sitemap and robots (defaults to the Vercel URL)
NEXT_PUBLIC_SITE_URL=https://emon-hassan-portfolio.vercel.app
```
`NEXT_PUBLIC_BASE_URL` is no longer needed. If `API_ORIGIN` is missing, it is derived from `NEXT_PUBLIC_BASE_URL` by stripping `/api`.
In production, set `API_ORIGIN` to the deployed backend URL and `CLIENT_URL` (server) to the deployed site URL.

### Editing home page content (dashboard)
All home page sections are managed in **Dashboard → Home page**:

| Page | Covers |
| :--- | :--- |
| Profile & Hero | Hero, about, contact copy, links, hero facts, ticker, reference architecture, SEO |
| Experience | Roles |
| Case Studies | Projects, including the architecture diagram columns/nodes and request trace |
| Stack / Practices / Credentials | Their sections |
| Messages | Contact form inbox: table, search, status tracking (new / read / replied / archived), private notes, reply by email |
| Security | Two-factor (authenticator app, backup codes), optional security question, password change |

- **First run:** open Profile & Hero and click **Import current content**. This copies `client/src/data/portfolio.js` into MongoDB and only works while the content collections are empty.
- **Before import** (or whenever the API is unreachable), the home page renders the data file as a fallback.
- **After import,** the database is the source of truth. Hidden items are not shown, and list order matches the dashboard order.
- **Saves appear within seconds:** the server calls `POST {CLIENT_URL}/api/revalidate` with `REVALIDATE_SECRET`. Without the secret, the page still refreshes within 60s (ISR).
- Architecture node kinds are `client | edge | service | async | data | external`. Stack icons use simpleicons.org slugs, with `mono` as the monogram fallback.
- Only add facts you can verify.

### First admin account
Public sign-up is disabled. Existing admins keep working. To create the first admin on an empty database, insert a user with `role: "admin"` and a bcrypt-hashed password directly in MongoDB, or promote an existing user with `PATCH /api/user/change-role` from another admin. After signing in, turn on two-factor authentication under **Dashboard → Security** and store the backup codes.

### Step 3: Run Next.js Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`.

---

## 5. Development Scripts Quick Reference

### Backend (`server/`)
| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `ts-node-dev --respawn --transpile-only src/server.ts` | Start dev server with hot reload |
| `npm run build` | `tsc` | Compile TypeScript into `dist/` |
| `npm run prod` | `node ./dist/server.js` | Run compiled production build |
| `npm run lint` | `eslint src ...` | Lint TypeScript and JavaScript files |
| `npm run prettier` | `prettier --write ...` | Format codebase according to Prettier config |

### Frontend (`client/`)
| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start Next.js development server |
| `npm run build` | `next build` | Create production Next.js build |
| `npm run start` | `next start` | Run production Next.js server |
| `npm run lint` | `eslint src ...` | Run ESLint checks |

---

## 6. Troubleshooting

- **MongoDB connection failed**: Verify that your local MongoDB daemon is running (`mongod` / MongoDB Windows Service) or that your MongoDB Atlas IP whitelist allows connections from your current IP.
- **CORS error**: Verify that `CLIENT_URL` in `server/.env` exactly matches your frontend origin (`http://localhost:3000`).
- **Dashboard requests return 404 / "Missing CSRF header"**: check that `API_ORIGIN` points at this backend (another app on the same port answers otherwise) and that calls go through `baseApi`.
- **Session expired / locked out**: sign in again at `/dashboard/login`. After 5 failed attempts, wait 15 minutes.
- **Home page shows old content**: confirm `REVALIDATE_SECRET` matches in both `.env` files. Otherwise wait up to 60s.
- **Never run `npm run build` in `client/` while `npm run dev` is running.** Both write to `.next`, and the dev server then answers with 500 errors. Stop dev, delete `client/.next`, then restart.
- **`npm run lint` in `server/`**: the script uses ESLint 8 flags while ESLint 10 is installed, so it fails before linting. `npx tsc --noEmit` is the reliable check.
