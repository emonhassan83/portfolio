# Backend Engineer Portfolio — Plan & Progress

## Goal
Replace the home page with a dark editorial Backend Engineer portfolio. The style follows the reference site: lime accent, mono labels, numbered `01 /` sections, `log.01` / `proj.01` / `[01]` markers and a status footer with a live clock. Additions: bento grids, a typing terminal, architecture diagrams and case studies. Dashboard, login, blogs and `server/` are untouched.

## Status: implemented (all 15 tasks)
- [x] 1. Create `plan.md`
- [x] 2. Content data layer: `client/src/data/portfolio.js`, sourced from the resume, the GitHub profile and the project repos
- [x] 3. Design system: `client/src/styles/portfolio.css` (scoped `.bk`), Tailwind `bk-*` tokens, `next/font` (now Fraunces / Archivo / JetBrains Mono, see "Reference-accuracy pass"), `ui/Section` + `ui/Reveal`
- [x] 4. Shell: Navbar (scroll-spy, mobile menu, day/night toggle, resume), Footer (status, Dhaka clock), metadata/OG, JSON-LD, `sitemap.js`, `robots.js`
- [x] 5. Hero: status line, headline, CTAs, "system facts" counted from source, tech ticker (rebuilt in the reference-accuracy pass)
- [x] 6. About bento; Stack Index (6 groups, simpleicons with monogram fallback)
- [x] 7. Experience log
- [x] 8. Selected Work: 5 project cards, inline schematic, expandable engineering notes
- [x] 9. System Architecture: data-driven SVG diagrams, keyboard tabs, request trace per system
- [x] 10. Engineering Practices + Education & Certifications
- [x] 11. GitHub (live API with static fallback) + Contact (existing EmailJS service/template, channel tiles)
- [x] 12. Home page composed in `client/src/app/(portfolio)/`; old `(main)/page.jsx` removed
- [x] 13. a11y/perf/responsive pass: skip link, aria tabs, reduced motion, server-rendered HTML, 390px and 1440px checked
- [x] 14. `npm run build` passes; new files lint clean; every anchor resolves; `/blogs`, `/projects`, `/login` and dashboard still return 200
- [x] 15. Docs updated: README, `docs/FOLDER_STRUCTURE.md`, `docs/development.md`

## Reference-accuracy pass (2026-11-25)
Goal: match https://mohammadalis.vercel.app more closely (hero, look and the "cursor animation"). Values were read from that site's CSS.
- Tokens in `styles/portfolio.css`: dark `#0f0f0a` / `#ebe8dd` / lime `#c5f738` / line `#2d2d26`; day `#f4f3ea` / `#222117` / green `#466400`. In day mode the accent is dark green with light text, so use `text-bk-on-accent` on accent fills, never a hard-coded dark colour.
- Fonts: Fraunces (display, with italic), Archivo (body), JetBrains Mono.
- Square corners everywhere, flat mono-caps buttons, film-grain overlay (`.bk::after`), 28px dot grid behind the hero, blinking square status marker.
- Hero (`Hero.jsx`): status line, huge serif first name + italic lime last name, mono role line, intro, two CTAs, icon links, "system facts" list on the right, `◆` ticker. Entrance is the CSS-only `.bk-rise` stagger.
- Navbar: square avatar, `E.Hassan—` logo, uppercase mono links with lime numbers, bordered day/night button (labelled with the mode it switches to), square Resume. A section rail (dots + labels) shows from 1440px.
- `StatusBar.jsx`: fixed bottom strip (status, Dhaka clock, version). The footer no longer carries that row; the layout has `pb-9` to clear it.
- `motion/Mascot.jsx` replaces the HUD cursor: a small three.js robot (new dependency `three`, plain three.js, no react-three-fiber) that hovers beside the pointer, looks at it, blinks, jumps away when the pointer rushes it, wanders when the pointer rests and dozes after 25s idle, with a speech bubble. Desktop fine-pointer only (min-width 768px), loaded with a dynamic import so it stays out of the first-load bundle, paused in hidden tabs, re-coloured on theme change.
- `motion/PointerFx.jsx`: sets `--px/--py` on `#hero` (headline, facts and dot-grid parallax) and `--sx/--sy` on cards (spotlight).
- Smoothness pass: the mascot moves on a critically damped spring (`springTo`, keeps momentum when the target jumps) and every other easing is frame-rate independent (`damp`); hero parallax glides to the pointer in its own rAF loop that idles when settled; Lenis uses `lerp: 0.085` instead of a fixed-duration tween; theme switch cross-fades; mascot renders at up to 2x DPR. Tune feel via the `settle` times in `Mascot.jsx`, `EASE` in `PointerFx.jsx` and `lerp` in `SmoothScroll.jsx`.
- Removed: `RoboticCursor.jsx`, `SplitText.jsx`, magnetic buttons, the native-cursor hiding.
- `Terminal.jsx` and the `terminal` data are no longer rendered (the reference hero has no terminal). The files are kept; delete them or place the terminal in another section.
- Verified: `npm run build`, ESLint on the portfolio files, and headless Chrome screenshots at 1335px (night, day, reduced motion) and 390px (no horizontal overflow, mascot not loaded).

## GitHub contribution heatmap (2026-11-25)
- `components/Portfolio/Contributions.jsx` (async server component) renders the last year of real contributions above the repo grid: total, less/more legend, month labels, 53-week grid, and total / avg per week / active days. It is passed into the client `GitHub.jsx` as `children` from `app/(portfolio)/page.jsx`.
- Data: `lib/githubContributions.js` reads the public calendar fragment `github.com/users/<user>/contributions` on the server (no token, no new dependency) and parses dates, levels and counts. Cached with `revalidate` of 6 hours, so `/` is now ISR instead of fully static.
- If GitHub is unreachable or its markup changes, the function returns null and the heatmap is simply not rendered (no placeholder data). If it ever disappears in production, check that fragment's markup first; the official alternative is the GraphQL `contributionsCollection` query, which needs a `GITHUB_TOKEN`.
- The numbers are whatever the public profile shows, so private contributions count only if "Private contributions" is enabled on the GitHub profile.

## Motion layer (added after v1)
- `motion/Mascot.jsx` and `motion/PointerFx.jsx`: see the reference-accuracy pass above (they replaced the HUD cursor).
- `motion/SmoothScroll.jsx`: Lenis inertial scrolling with anchor offset -72px (new dependency `lenis@^1.1.20`). Desktop only, off for reduced motion.
- `motion/ScrambleText.jsx`: glyph-decode on section labels and kickers.
- Owner decision (2026-11-25): the hero ticker and the hero pointer parallax run even when the OS asks for reduced motion (this dev PC does). Everything else below still follows the setting.
- Reduced motion is softened instead of killing everything. Fades, scramble, hover and the mascot stay on (the mascot only follows the pointer gently: no wandering, bobbing or startle). Translation, flowing dashes, blinking and Lenis are dropped.
- Note: this dev PC has Windows "Animation effects" off, so browsers report `prefers-reduced-motion: reduce`. Turn it on (Settings → Accessibility → Visual effects) to see the full motion.

## Phase 2: dashboard-managed content + security hardening

Goal: every home page section can be edited from the dashboard. The backend stores it, the home page renders it on the server, and auth is hardened.

### Decisions (approved)
- **Backend:** new `server/src/app/modules/portfolio/` module.
  - `Profile` is a singleton: site/SEO, hero, about, contact, links, terminal, ticker, hero facts and the reference architecture.
  - Ordered, publishable collections: `experience`, `projects` (case studies with architecture/flow), `stack` (groups), `practices`, `credentials` (education + certifications).
  - The legacy project/skills/qualification/blog/review modules stay for `/projects` and `/blogs`.
- **Endpoints:**
  - Public: `GET /api/portfolio`, which returns published items only.
  - Admin: `GET|PUT /api/portfolio/profile`, CRUD on `/api/portfolio/:resource`, `PATCH /api/portfolio/:resource/reorder` and `POST /api/portfolio/import`. Import seeds from the current `portfolio.js` and only works while the DB is empty.
- **Rendering:** the home page fetches on the server with ISR (60s) and tag `portfolio`. Each section falls back to `src/data/portfolio.js` when the API is down or a section is empty. After every write the server calls `POST {CLIENT_URL}/api/revalidate` with a shared secret, so changes show immediately.
- **Auth:**
  - The JWT lives only in httpOnly cookies. Browser calls go through a Next.js rewrite (`/api/*` → backend), so the cookies are first-party and `SameSite=Strict`.
  - CSRF defence: unsafe methods must send `X-Requested-With`.
  - Access token lasts 15 min; the refresh token is limited to path `/api/auth`. A `tokenVersion` on the user revokes all sessions on logout or password change.
- **Second login step:** password first, then a security question. The answer is bcrypt-hashed and normalised. The 5-minute challenge token is signed with its own purpose claim. 5 failed passwords or answers lock the account for 15 minutes.
- **Hardening:**
  - helmet, a CORS allowlist from `CLIENT_URL`, `express-rate-limit` (login, verify, writes), a 100kb JSON limit, and stripping of `$`/`.` keys from request bodies
  - strict Zod schemas on every new route
  - generic login errors (no user enumeration)
  - no error objects or stacks leaked in production
- **Registration:** `/user/register` becomes admin-only; `/register` redirects to `/login`.
- **Repo hygiene:** `server/src/_user_credintial.txt` is untracked and ignored, but stays on disk.

### Tasks
Status: implemented (2026-11-25).
- [x] 16. Server baseline: Zod 4 migration finished (`tsc` was failing before, so `npm run build` and deploys were broken); helmet, express-rate-limit, CORS allowlist, 100kb body limit, body sanitiser; no error leaks in production
- [x] 17. Auth rework: cookie sessions, refresh rotation, tokenVersion revocation, logout, `/auth/me`, generic errors, lockout. Fixed change/reset-password updating the wrong user (`{ id: userData.userId }` matched any doc), reset tokens doubling as access tokens, password hash returned by `/user/my-profile`, users able to set their own `role` via `update-user`, and the pre-save hooks re-hashing / failing on every save
- [x] 18. Security question second step (`/auth/login` → challenge, `/auth/login/verify`, `PUT /auth/security-question`)
- [x] 19. Registration admin-only, CSRF header check. The credential file was already untracked and ignored, so no change was needed.
- [x] 20. Portfolio module (`server/src/app/modules/portfolio/`)
- [x] 21. Client API layer (rewrite, cookie `baseApi`, refresh-on-401, `portfolioApi`)
- [x] 22. Two-step login UI (`page/login/login.jsx`), ProtectedRoute via `/auth/me`, sidebar logout
- [x] 23. Form engine (`components/Dashboard/Portfolio/SchemaForm.jsx`, `schemaUtils.js`, `ResourceManager.jsx`, `schemas.js`)
- [x] 24. Dashboard pages (`/dashboard/portfolio`, `/dashboard/portfolio/[resource]`, `/dashboard/security`), import button, security-question banner
- [x] 25. Home page on live content (`lib/getPortfolio.js`, `lib/portfolioContent.js`, sections take props, `generateMetadata`, `app/api/revalidate`)
- [x] 26. Verified:
  - server `tsc` clean
  - ESLint clean on all touched client files
  - dev server renders `/`, `/login`, `/register` (redirects to `/login`), dashboard pages and `/blogs`
  - 37/37 end-to-end API checks against a throwaway in-memory MongoDB: CSRF, enumeration, strict schemas, cookie flags, import/CRUD/hide/reorder, `javascript:` links rejected, logout revocation, two-step login, refresh rotation, lockout
  - `client` production build not re-run, because the owner's dev server was using `.next`
- [x] 27. Docs: README, `docs/AUTHENTICATION.md` (rewritten), `docs/development.md`, `docs/FOLDER_STRUCTURE.md`, this file

- [x] 28. Two-factor authentication (2026-11-26): TOTP authenticator step (`/auth/login/2fa`), ten one-time backup codes, enrolment and management under Dashboard → Security (`/auth/2fa/*`), security question kept as the legacy second step for accounts without an authenticator and as an optional recovery path (`/auth/login/recover`) for accounts with one. Failure counting is now an atomic increment. Details in `docs/AUTHENTICATION.md`.
  - New: `server/src/app/modules/Auth/auth.totp.ts`, `client/src/components/Dashboard/TwoFactorSettings.jsx`, `server/tests/` (50 security tests, `npm test` in `server`)
  - Dependencies: client `qrcode`; server dev `mongodb-memory-server`
  - Env (optional): `TOTP_ENCRYPTION_KEY`, `TOTP_ISSUER`. Without the first, secrets are encrypted with a key derived from `JWT_ACCESS_SECRET`, so rotating that secret would invalidate enrolled authenticators.
  - Verified: server `tsc` clean, ESLint clean on touched client files, 50/50 tests. The new login and Security screens were not clicked through in a browser.

- [x] 29. Dashboard dark theme (2026-11-26): DaisyUI `portfolio` theme in `tailwind.config.cjs`, applied in `app/dashboard/layout.jsx`; sidebar and legacy pages moved off fixed grays.
- [x] 30. Contact inbox (2026-11-26): server `message` module (`/api/messages`), contact form saves every submission (EmailJS kept as notification), **Dashboard → Messages** with table, status tabs and counts, search, detail panel, private note, reply by email (marks replied), delete, unread badge in the sidebar. Legacy menu removed from the sidebar (routes and modules kept). 7 tests in `server/tests/messages.test.ts`; 57/57 pass. Not clicked through in a browser.
- [x] 31. Legacy removal + sidebar (2026-11-26): deleted server modules project/skills/qualification/blogs/review and their routes; deleted the client legacy dashboard pages, modals, forms, row components, API slices (incl. unused `userApi`), the `(main)` group (`/projects`, `/blogs`), the old `components/Home` and `components/Shared`, and the broken Vite leftovers (`main.jsx`, `App.jsx`, `routes/routes.jsx`, `layout/MainLayout.jsx`). Sitemap lists only `/`. MongoDB collections for those modules were not dropped. Sidebar rebuilt: brand, profile card with role and 2FA status (initials fallback, uses `/auth/me`), groups Content / Inbox / Account, unread badge, 2FA warning dot, View site, mobile drawer with backdrop and Escape. Server `tsc` clean, 57/57 tests, removed routes return 404, dashboard pages compile; not clicked through in a browser.
  - Known: `npm run lint` in client reports 2 pre-existing issues (`app/Providers.jsx` unused `React`, `app/layout.jsx` fast-refresh warning).
  - Optional: drop the old `projects`, `skills`, `qualifications`, `blogs`, `reviews` collections in Atlas once nothing is needed from them.

### To do on the owner's side
- `server/.env`:
  - add `REVALIDATE_SECRET` and `JWT_CHALLENGE_SECRET`
  - set `JWT_ACCESS_EXPIRE_IN=15m` and `JWT_REFRESH_EXPIRE_IN=7d` (currently 7d / 365d)
  - put the local origin into `CLIENT_URL` for dev: `CLIENT_URL=http://localhost:3000,https://emon-hassan-portfolio.vercel.app`
- `client/.env`: add `API_ORIGIN` and the same `REVALIDATE_SECRET`. Port 5000 is used by another local app ("Borla Backend API"), so run this server on a free port (e.g. `PORT=5050`) and point `API_ORIGIN` at it.
- Production: set the same vars on both Vercel projects (`API_ORIGIN` = backend URL, `CLIENT_URL` = site URL).
- First sign-in after deploy: existing JWTs in localStorage are ignored, so sign in again. Then turn on two-factor authentication under Dashboard → Security (save the backup codes) and click **Import current content** under Profile & Hero.

### Follow-ups
- Legacy project/blog/skill/qualification/review Zod schemas are not strict (only the new routes strip unknown keys).
- `server` `npm run lint` uses ESLint 8 flags with ESLint 10 installed and fails before linting.
- Dashboard text fields have no image upload for the photo (URL only).

### New env vars
- server: `CLIENT_URL` (comma-separated allowlist, first entry is used for revalidation), `REVALIDATE_SECRET`, `JWT_CHALLENGE_SECRET`
- client: `API_ORIGIN` (backend origin for rewrites and server fetch, e.g. `http://localhost:5000`), `REVALIDATE_SECRET`

## Key decisions
- The home page lives in its own `(portfolio)` route group with its own layout, so the legacy Navbar/Footer/CSS never load there. Legacy `components/Home/*` files remain but are no longer routed.
- `app/Providers.jsx`: PersistGate now renders `/` immediately, so the home page is server-rendered for SEO. Other routes still wait for rehydration.
- `index.css` `.grid` default is wrapped in `:where()` so Tailwind `gap-*` utilities work. Legacy components keep the 1.5rem default.
- Base `.bk-*` component classes use `:where()` (zero specificity) so Tailwind utilities such as `hidden` and `lg:hidden` can override them.
- No invented metrics. Hero numbers are counted from repos: 34 Consultz modules, 2 Split Ride services, 5 locales, 4 Medico roles.

## Needs owner confirmation (`confirm: true` in data file)
- Experience entry: "Backend Developer — Spark Tech Agency", period shown as "Current role". This was inferred from the org that owns the Consultz repo. Add the exact title and start date.
- FotoTidy and Ensinor: no public data, so they are shown as "proprietary system" cards. Add summary, stack, highlights, links and optionally `architecture`/`flow`.
- Split Ride is mapped to the `ride-sharing-backend` repo.
- Hero `status: open_to_opportunities` and contact "accepting" line.
- Certifications have no verification URLs. Add a `url` field and render it if available.

## Known issues / follow-ups
- Full-project `npm run lint` already had 17 errors in legacy files (not from this work).
- `client/src/utils/imageUploader.js` still reads `VITE_IMGBB_KEY` (should be `NEXT_PUBLIC_`).
- No OG image yet; add `client/src/app/(portfolio)/opengraph-image.jsx` or a static image.
- Day theme: hero and navbar were checked in a browser; the lower sections were not.
- `npm audit` reports 1 moderate advisory in `next` (<=15.5.28), present before the mascot work. `npm audit fix` is offered; not applied.
- The mascot canvas sits above page content (z-30, no pointer events), so it can briefly cover text it flies over. That matches the reference.
