# Fullstack Developer Portfolio & CMS Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

A fullstack personal developer portfolio and content management system (CMS) engineered for web developers. It features a modern, responsive **Next.js 15 App Router** frontend paired with a modular **Express & TypeScript** REST API powered by **MongoDB / Mongoose**.

---

## 🌟 Key Features

### 🌐 Public Portfolio Experience
- **Interactive Hero & About**: Developer biography, quick contact links, downloadable resume, and social integrations.
- **Skills Matrix**: Categorized and visual display of programming languages, frameworks, libraries, and dev tools.
- **Qualifications Timeline**: Chronological presentation of educational milestones and professional work experiences.
- **Featured Projects Showcase**: Detailed portfolio project cards with live demo links, GitHub repositories (client/server), tech stack tags, and feature descriptions.
- **Developer Blog & Articles**: Technical articles and developer tutorials with tag filtering and reading views.
- **Client Testimonials**: Interactive Swiper carousel showcasing client recommendations and peer reviews.
- **Direct Contact Form**: Seamless contact inquiry messaging integrated with EmailJS.
- **Theme Switcher**: Smooth light and dark mode toggling with persisted user preference.

### 🛡️ Administrative Dashboard & CMS
- **Authenticated Backoffice**: Role-based access control (Admin / User) protected by JWT and secure route guards.
- **Project Governance**: Full CRUD interface for adding, editing, and archiving portfolio projects.
- **Blog Management**: Draft, publish, update, and manage technical blog posts.
- **Skill & Qualification Management**: Real-time management of displayed skills and career achievements.
- **Review Moderation**: Admin review management and approval workflow.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling & UI Components** | [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), [Headless UI](https://headlessui.com/), React Icons |
| **State & API Layer** | [Redux Toolkit](https://redux-toolkit.js.org/), RTK Query (`baseApi`), [Redux Persist](https://github.com/rt2zz/redux-persist) |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (v18+), [TypeScript](https://www.typescriptlang.org/) |
| **Web Framework** | [Express.js](https://expressjs.com/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Validation & Security** | [Zod](https://zod.dev/), [JWT (jsonwebtoken)](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Email Utility** | [Nodemailer](https://nodemailer.com/), [EmailJS](https://www.emailjs.com/) (Browser client) |

---

## 📚 Technical Documentation

In-depth technical architecture and development guides are maintained in the [`docs/`](./docs/) directory:

- 📐 [**System Architecture**](./docs/ARCHITECTURE.md) - Architecture diagrams, sequence flows & data relationships.
- 🔐 [**Authentication & RBAC**](./docs/AUTHENTICATION.md) - JWT token lifecycle, refresh mechanism & route protection.
- 📡 [**API Guidelines**](./docs/API_GUIDELINES.md) - REST conventions, query builder parameters & standard response schemas.
- 🗄️ [**Database & Models**](./docs/DATABASE_SEEDING.md) - MongoDB Mongoose schemas, indexing & seed scripts.
- 🚀 [**Deployment Guide**](./docs/DEPLOYMENT.md) - Production deployment workflows for Vercel, Node servers, and MongoDB Atlas.
- 📁 [**Folder Structure**](./docs/FOLDER_STRUCTURE.md) - Monorepo structure, client routes, and server module architecture.
- 💻 [**Local Development**](./docs/development.md) - Prerequisites, step-by-step setup, and environment configurations.
- 🧪 [**Testing & Quality Workflow**](./docs/TESTING_WORKFLOW.md) - Linting, TypeScript checks, and security audit procedures.
- 📏 [**Coding Rules**](./docs/CODING_RULES.md) - TypeScript standards, controller-service pattern, and clean code practices.
- 🤖 [**AI System Prompt**](./docs/AI_SYSTEM_PROMPT.md) - System context and instructions for AI development assistants.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/emonhassan83/portfolio.git
cd portfolio
```

### 2. Configure & Run Backend (`server/`)
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env   # Or create .env with required keys (see docs/development.md)

# Start development server
npm run dev
```
The server will start on `http://localhost:5000` (or the configured `PORT`).

### 3. Configure & Run Frontend (`client/`)
```bash
cd ../client
npm install

# Configure environment variables
# Create .env.local with:
# NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

# Start Next.js development server
npm run dev
```
The client application will run on `http://localhost:3000`.

---

## ⚙️ Environment Variables Overview

### Backend (`server/.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRE_IN=1d
JWT_REFRESH_EXPIRE_IN=30d
RESET_PASS_LINK=http://localhost:3000/reset-password
EMAIL=your-email@gmail.com
APP_PASS=your-google-app-password
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
```

---

## 📜 Monorepo Layout
```
portfolio/
├── client/          # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/     # Pages and layouts ((main), dashboard, login, register)
│   │   ├── redux/   # RTK Query baseApi and feature slices
│   │   └── ...
│   └── package.json
├── server/          # Express.js & TypeScript Backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── builder/   # QueryBuilder (search, filter, sort, paginate)
│   │   │   ├── modules/   # Feature modules (project, blogs, skills, user, etc.)
│   │   │   └── routes/    # Application router aggregator
│   └── package.json
├── docs/            # Engineering specifications and architecture documentation
├── .gitignore       # Monorepo root ignore file
└── README.md        # Monorepo README
```

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
