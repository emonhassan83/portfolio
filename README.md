# Portfolio Website Client

A Next.js frontend application migrated from Vite+React SPA, preserving the original layouts, theme contexts, DaisyUI, and Tailwind CSS styles.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, DaisyUI, Custom Vanilla CSS
- **State Management**: Redux Toolkit, Redux Persist
- **Utilities**: HeadlessUI, Swiper, react-hook-form, react-icons

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API server running

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the root directory based on the following template:
   ```env
   NEXT_PUBLIC_API_URL=https://portfolio-app-server-one.vercel.app/api
   ```

### Scripts
- `npm run dev`: Start Next.js development server
- `npm run build`: Build Next.js application for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint check

## Routing and Architecture Migration Details
The app routing was converted from `react-router-dom` to Next.js App Router:
- **Root Layout** (`src/app/layout.jsx`): Replaced React index.html and `main.jsx` wrapper scripts. Loads global CSS and scripts (e.g. EmailJS script tag).
- **Providers Wrapper** (`src/app/Providers.jsx`): Binds the client-side context (Redux store Provider, PersistGate, ThemeProvider, react-hot-toast Toaster).
- **Public Folder** (`public/`): Preserved assets and favicon.
- **Route Paths**:
  - `/` -> `src/app/(main)/page.jsx` (Home page)
  - `/projects` -> `src/app/(main)/projects/page.jsx` (Projects portfolio list)
  - `/blogs` -> `src/app/(main)/blogs/page.jsx` (Blogs dashboard page wrapped in ProtectedRoute)
  - `/login` -> `src/app/login/page.jsx` (Login form)
  - `/register` -> `src/app/register/page.jsx` (Sign up form)
  - `/dashboard/...` -> `src/app/dashboard/.../page.jsx` (User and admin settings panel dashboards)
