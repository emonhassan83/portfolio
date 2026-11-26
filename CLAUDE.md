# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Monorepo with two independent npm projects (no root package.json, no workspaces). Run commands from inside each folder.

- `client/`: Next.js 15 App Router, React 19, **plain JS/JSX** (not TypeScript), Tailwind 3 + DaisyUI, Redux Toolkit + RTK Query + redux-persist.
- `server/`: Express 5 + TypeScript + Mongoose 9 + Zod 4 REST API.
- `docs/`: detailed architecture, API, auth, deployment and coding-rule docs. Update the relevant doc after changes instead of creating new files.
- `plan.md`: Backend Engineer portfolio redesign. It lists decisions, items awaiting owner confirmation and known follow-ups. Read it before continuing that work.

## Commands

Client (`cd client`):
- `npm run dev`: Next dev server on :3000
- `npm run build`: production build (ESLint is skipped during builds via `next.config.mjs`)
- `npm run lint`: ESLint, `--max-warnings 0`

Server (`cd server`):
- `npm run dev`: ts-node-dev on `src/server.ts` (:5000 by default)
- `npm run build`, then `npm run prod`: tsc to `dist/`, then run it
- `npm run lint` / `npm run lint:fix`, `npm run prettier:fix`

The only tests are the security suite in `server/tests/` (auth + contact messages) (`npm test` in `server`, Node test runner + in-memory MongoDB; see `docs/AUTHENTICATION.md`). The client has none. Env vars are documented in `docs/development.md`. The client needs `NEXT_PUBLIC_BASE_URL` pointing at `http://localhost:5000/api`.

## Client architecture

- The app was migrated from Vite + react-router to Next.js. Route files in `src/app/**/page.jsx` are thin `"use client"` wrappers that render the real screens from `src/page/**` (for example `app/dashboard/messages/page.jsx` renders `page/Dashboard/Messages.jsx`). Edit the `src/page/` component, not the wrapper.
- `src/routes/ProtectedRoute.jsx` and `src/layout/DashboardLayout.jsx` keep their Vite-era folder names but are used by the Next.js dashboard layout. The other Vite leftovers have been removed.
- Route groups: `(portfolio)` serves the home page `/` (Backend Engineer portfolio, its own layout/fonts/metadata). `dashboard/` is the admin CMS. The legacy `(main)` group (`/projects`, `/blogs`) was removed. Sign-in is `/dashboard/login`, which `dashboard/layout.jsx` exempts from `ProtectedRoute`; `/login` and `/register` only redirect there.
- Home page content is managed in the dashboard (`/dashboard/portfolio*`) and stored by the server `portfolio` module. `app/(portfolio)/page.jsx` and its layout load it via `lib/getPortfolio.js` (ISR 60s, tag `portfolio`, revalidated by the backend through `app/api/revalidate`), and sections receive it as props. `src/data/portfolio.js` is only the import seed and the fallback when the API is unreachable or nothing has been imported. When adding a field, update the server Zod schema + model, `components/Dashboard/Portfolio/schemas.js`, `lib/portfolioContent.js` and the data file together. Sections live in `src/components/Portfolio/`. Dashboard navigation is `components/Dashboard/Sidebar/` (groups Content / Inbox / Account; unread message badge; two-factor status). Styles are in `src/styles/portfolio.css`, scoped under `.bk` and exposed to Tailwind as `bk-*` colors. Base `.bk-*` classes use `:where()` so utilities override them. Don't add unverifiable metrics to the data file.
- Home page motion lives in `src/components/Portfolio/motion/`: `Mascot.jsx` (three.js robot that trails the pointer, desktop only, loaded on demand), `PointerFx.jsx` (hero parallax and card spotlight via CSS variables), Lenis smooth scroll and scramble reveals. Reduced-motion users keep fades, a calmer mascot, the hero ticker and the hero pointer parallax (owner decision), but lose smooth scroll, slide-in movement and blinking. If animations look missing locally, check whether the OS reports reduced motion before debugging.
- The home page look follows the reference site in `plan.md`: Fraunces / Archivo / JetBrains Mono, square corners (a rule in `portfolio.css` zeroes every `rounded-*` except `rounded-full`), flat mono-caps buttons. `.bk a` and `.bk button` inherit the body font, so font utilities on a link or button need a wrapper span or a `.bk .x` rule. Tailwind preflight also zeroes padding on `button`/`input`/`textarea` and outranks `:where()`, so `.bk-btn` and `.bk-input` restate their padding in `html button:where(...)` style rules.
- The dashboard (`app/dashboard/layout.jsx`) always renders in the dark `portfolio` DaisyUI theme defined in `tailwind.config.cjs` (home page palette, lime primary). Use DaisyUI tokens (`bg-base-*`, `text-base-content`, `btn-primary`) in dashboard code, not fixed grays or `useTheme()` ternaries. The sign-in page has its own dark styles.
- `Providers.jsx` lets `/` bypass `PersistGate` so it server-renders. Every other route waits for rehydration.
- `app/Providers.jsx` wraps everything in `ThemeProvider` (`src/lib/ThemeProvider.jsx`), the Redux store and `PersistGate`. Components read `useTheme().theme.mode` and switch classes manually per element. DaisyUI is configured with `light`/`dark` themes.
- Data: RTK Query endpoints in `src/redux/features/*Api.js` inject into `src/redux/api/baseApi.js`.
  - It calls `/api/*` on the same origin; `next.config.mjs` rewrites that to `API_ORIGIN`.
  - It always sends `X-Requested-With: portfolio-dashboard`, the server's CSRF check.
  - On a 401 it silently refreshes the session and retries.
  - Sessions are httpOnly cookies only. Never store tokens in Redux or localStorage. See `docs/AUTHENTICATION.md` (password, then TOTP or a backup code; optional security question for recovery; lockout; tokenVersion revocation).
- The contact form (`components/Portfolio/ContactForm.jsx`) saves each message to the server `message` module (`POST /api/messages`, shown in **Dashboard → Messages**) and also sends it with EmailJS, loaded and initialised via `<Script>` in `app/layout.jsx`. It counts as sent if either succeeds. The legacy project/skill/qualification/blog/review features were removed from client and server (2026-11-26); their old MongoDB collections were left untouched. Image uploads go to imgbb (`src/utils/imageUploader.js`, key from `NEXT_PUBLIC_IMGBB_KEY`).
- Global styles live in `src/index.css` and `src/App.css`, with per-component `.css` files next to components.

## Server architecture

- `src/server.ts` connects Mongoose and starts the app. `src/app.ts` mounts all routes under `/api` from `src/app/routes/index.ts`, then `globalErrorHandler`, then `notFound`.
- Each domain module in `src/app/modules/<name>/` follows a strict layering of interface, model, validation (Zod), constant, service, controller and route files:
  - routes bind `auth(...roles)` and `validateRequest(zodSchema)`
  - controllers are wrapped in `catchAsync` and respond only through `sendResponse(res, { statusCode, success, message, meta, data })`, with no DB access
  - services hold all Mongoose logic, use `src/app/builder/QueryBuilder.ts` for search/filter/sort/paginate on list endpoints, and throw `AppError(status, message)`
- Errors from Zod, Mongoose cast/validation and duplicate keys are normalised by handlers in `src/app/errors/` inside `globalErrorHandler`.
- Auth (`modules/Auth`, `middleware/auth.ts`):
  - JWTs live in httpOnly cookies; each token carries a `typ` claim and `tv` (tokenVersion), and the middleware reads role and tokenVersion from the DB on every request.
  - `app.ts` adds helmet, a CORS allowlist (`CLIENT_URL`), rate limits, a body sanitiser and the CSRF header check (`middleware/security.ts`).
  - Use `validateRequest(schema, { strip: true })` with `z.strictObject` for new routes.
  - Check the server with `npx tsc --noEmit`; `npm run lint` is broken (ESLint 10 vs old flags).
  - Never run `next build` while `next dev` is running: both use `.next`.

## Conventions

- npm `overrides` in both `package.json` files pin patched transitive dependencies for security. Keep them when upgrading packages, and re-run `npm audit` afterwards.
- Full rules are in `docs/CODING_RULES.md` and `docs/API_GUIDELINES.md`.
