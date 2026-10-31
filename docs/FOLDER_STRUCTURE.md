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
    │   ├── (main)/          # Public route group for visitors
    │   │   ├── layout.jsx   # Shared public layout (Navbar, Footer, ScrollUp)
    │   │   ├── page.jsx     # Landing page (Hero, About, Skills, Qualification, Projects, Reviews, Contact)
    │   │   ├── blogs/       # Blog listing page
    │   │   └── projects/    # Projects showcase page
    │   ├── dashboard/       # Protected administrative dashboard route group
    │   │   ├── layout.jsx   # Dashboard layout with sidebar navigation
    │   │   ├── add-blog/    # Create new blog post
    │   │   ├── manage-blogs/# Update/delete existing blogs
    │   │   ├── add-project/ # Add portfolio project
    │   │   ├── manage-projects/
    │   │   ├── manage-skills/
    │   │   ├── manage-qualifications/
    │   │   └── manage-reviews/
    │   ├── login/           # Authentication login page
    │   ├── register/        # Registration page
    │   ├── layout.jsx       # Root HTML layout with fonts and metadata
    │   └── Providers.jsx    # Client providers (Redux Provider, PersistGate, ThemeProvider, Toast)
    ├── components/          # Reusable UI components
    │   ├── Dashboard/       # Sidebar and dashboard data tables
    │   ├── Home/            # Landing page sections (About, Skills, Portfolio, Testimonial, Contact)
    │   ├── Shared/          # Navbar, Footer, ScrollUp, Buttons
    │   └── modal/           # Form modals for adding/updating entities
    ├── lib/                 # Utility libraries and ThemeProvider context
    ├── redux/               # State management
    │   ├── api/             # Centralized baseApi RTK Query service
    │   ├── features/        # Injected feature APIs (authApi, projectApi, blogApi, etc.)
    │   └── store.js         # Redux store configuration with Redux Persist
    └── routes/              # ProtectedRoute guard wrapper
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
    │   │   ├── auth.ts      # JWT and RBAC guard middleware
    │   │   ├── globalErrorHandler.ts # Central error processing and formatting
    │   │   ├── notFound.ts  # 404 handler for undefined routes
    │   │   └── validateRequest.ts # Zod schema validator middleware
    │   ├── modules/         # Feature-based modular domain logic
    │   │   ├── Auth/        # Authentication, login, password management
    │   │   ├── blogs/       # Blog post management
    │   │   ├── project/     # Portfolio projects management
    │   │   ├── qualification/ # Education and experience milestones
    │   │   ├── review/      # Testimonials and client feedback
    │   │   ├── skills/      # Technical skills matrix
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
