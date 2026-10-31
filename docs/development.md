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
Create a file named `.env` in the `server/` folder:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=dev_jwt_access_secret_key_12345
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_key_12345
JWT_ACCESS_EXPIRE_IN=1d
JWT_REFRESH_EXPIRE_IN=30d
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

---

## 4. Frontend Setup (`client/`)

### Step 1: Install Dependencies
In a separate terminal:
```bash
cd client
npm install
```

### Step 2: Configure Environment Variables
Create a file named `.env.local` in the `client/` folder:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
```

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
- **Token expired**: Clear localStorage or cookies and re-login via `http://localhost:3000/login`.
