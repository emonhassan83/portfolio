# Portfolio Platform - Repository & Folder Structure

This document outlines the organization, conventions, and directory layout of the **Portfolio Platform** full-stack monorepo.

---

## 1. Root Repository Layout

```
portfolio/
├── .gitignore               # Comprehensive Git ignore rules (Next.js, Node, logs, secrets)
├── README.md                # Monorepo landing page, architecture overview & setup guide
├── client/                  # Next.js 15 App Router Frontend
├── server/                  # Express.js & TypeScript Backend (MongoDB / Mongoose)
└── docs/                    # Technical engineering specifications & architecture
    ├── AI_SYSTEM_PROMPT.md  # System instructions for AI coding assistants
    ├── API_GUIDELINES.md    # RESTful API design standards, error formats & endpoint catalog
    ├── ARCHITECTURE.md      # Layered architecture blueprint & entity diagrams
    ├── AUTHENTICATION.md    # RBAC security, JWT lifecycle & password reset flow
    ├── CODING_RULES.md      # Engineering rules, TypeScript conventions & code style
    ├── DATABASE_SEEDING.md  # MongoDB Mongoose schemas, indexes & seed execution guide
    ├── DEPLOYMENT.md        # Production deployment, Vercel & environment checklist
    ├── FOLDER_STRUCTURE.md  # Detailed monorepo file & directory breakdown
    ├── TESTING_WORKFLOW.md  # Testing protocols, API validation & QA checklist
    └── development.md       # Local developer environment setup & workflow
```

---

## 2. Frontend Structure (`client/`)

The client is built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **DaisyUI**, and **Redux Toolkit**:

```
client/
├── package.json             # Frontend dependencies & npm overrides
├── next.config.mjs          # Next.js configuration
├── postcss.config.cjs       # PostCSS plugins config (Tailwind & Autoprefixer)
├── tailwind.config.cjs      # Tailwind CSS & DaisyUI theme settings
├── public/                  # Static assets (Emon-resume.pdf, icons, images)
└── src/
    ├── app/                 # Next.js App Router Root
    │   ├── (portfolio)/     # Home page "/" — Backend Engineer portfolio (own layout, fonts, SEO metadata)
    │   │   ├── layout.jsx   # Portfolio shell: next/font, metadata, Navbar, Footer, theme script
    │   │   └── page.jsx     # Composes Hero → Contact sections + JSON-LD
    │   ├── dashboard/       # Protected administrative dashboard route group
    │   │   └── layout.jsx   # Dashboard layout with sidebar navigation
    │   ├── dashboard/login/ # Admin sign-in (exempt from ProtectedRoute in dashboard/layout.jsx)
    │   ├── login/           # Redirects to /dashboard/login
    │   ├── register/        # Redirects to /dashboard/login (sign-up disabled)
    │   ├── layout.jsx       # Root HTML layout with fonts and metadata
    │   └── Providers.jsx    # Client providers (Redux Provider, PersistGate, ThemeProvider, Toast)
    ├── components/          # Reusable UI components
    │   ├── Dashboard/       # Sidebar, two-factor settings, portfolio form engine
    │   ├── Portfolio/       # Home page sections (Hero, About, Experience, Projects, Architecture, Stack, Practices, Credentials, GitHub, Contact) + ui/ primitives
    ├── data/portfolio.js    # Seed + fallback home page content (imported once from the dashboard)
    ├── lib/getPortfolio.js  # Server loader: GET /api/portfolio (ISR 60s, tag "portfolio") with fallback
    ├── lib/portfolioContent.js # buildContent() (shape for sections) + toImportPayload()
    ├── app/api/revalidate/  # Secret-protected revalidateTag("portfolio"), called by the backend
    ├── app/dashboard/portfolio/ # Profile & hero page + [resource] (experience|projects|stack|practices|credentials)
    ├── app/dashboard/security/  # Two-factor, security question + password change
    ├── app/dashboard/messages/  # Contact form inbox with status tracking
    ├── components/Dashboard/Portfolio/ # Schema-driven form engine, resource manager, field schemas
    ├── styles/portfolio.css # Home page design tokens and component styles, scoped under `.bk`
    ├── lib/                 # Utility libraries and ThemeProvider context
    ├── redux/               # State management
    │   ├── api/             # Centralized baseApi RTK Query service
    │   ├── features/        # Injected feature APIs (auth, portfolioApi, messageApi)
    │   └── store.js         # Redux store configuration with Redux Persist
    ├── routes/              # ProtectedRoute guard wrapper
    └── layout/              # DashboardLayout (sidebar shell)
```

---

## 3. Backend Structure (`server/`)

The backend is built with **Node.js**, **Express.js**, **TypeScript**, and **Mongoose**:

```
server/
├── package.json             # Server dependencies & npm overrides
├── tsconfig.json            # TypeScript compiler configuration
├── vercel.json              # Vercel serverless deployment specification
└── src/
    ├── app/
    │   ├── builder/         # Dynamic query composition
    │   │   └── QueryBuilder.ts # Search, filter, sort, paginate, fields
    │   ├── config/          # Environment configuration loader
    │   │   └── index.ts     # Dotenv parser and typed export
    │   ├── errors/          # Custom error types and handlers
    │   │   ├── AppError.ts  # Standard application exception class
    │   │   ├── handleCastError.ts
    │   │   ├── handleDuplicateError.ts
    │   │   ├── handleValidationError.ts
    │   │   └── handleZodError.ts
    │   ├── middleware/      # Express middlewares
    │   │   ├── auth.ts      # Cookie session + tokenVersion + RBAC guard
    │   │   ├── security.ts  # Body sanitiser, CSRF header check, rate limiters
    │   │   ├── globalErrorHandler.ts # Central error processing and formatting
    │   │   ├── notFound.ts  # 404 handler for undefined routes
    │   │   └── validateRequest.ts # Zod validator ({ body, params, query, cookies }; `strip` option)
    │   ├── modules/         # Feature-based modular domain logic
    │   │   ├── Auth/        # Authentication, login, password management
    │   │   ├── portfolio/   # Home page content: profile singleton + experience/projects/stack/practices/credentials
    │   │   ├── message/     # Contact form messages (public create, admin inbox)
    │   │   └── user/        # User accounts and profiles
    │   ├── routes/          # Application router aggregator
    │   │   └── index.ts     # Combines all module routes under /api
    │   └── utils/           # Shared utility functions
    │       ├── catchAsync.ts # Wrapper for async route handlers
    │       ├── emailSender.ts# Nodemailer email sender helper
    │       └── sendResponse.ts # Standardized response sender
    ├── app.ts               # Express application initialization (CORS, Parsers, Routes)
    └── server.ts            # Database connection & HTTP server listener
```
