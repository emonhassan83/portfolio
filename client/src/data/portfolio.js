/**
 * Single source of truth for the public portfolio (home page).
 *
 * Every fact here comes from the owner's resume, GitHub profile or project
 * repositories. Do not add metrics or achievements that cannot be verified.
 * Entries marked `confirm: true` were inferred and should be confirmed by the owner.
 */

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://emon-hassan-portfolio.vercel.app",
  title: "Emon Hassan — Backend Engineer",
  description:
    "Backend engineer building APIs, real-time systems, payment flows and background workers with Node.js, TypeScript, Express, MongoDB, PostgreSQL, Redis and BullMQ.",
  version: "v3.0",
  timezone: "Asia/Dhaka",
  tzLabel: "dhk",
};

export const profile = {
  name: "Emon Hassan",
  firstName: "Emon",
  lastName: "Hassan",
  role: "Backend Engineer",
  roleLine: "Node.js · TypeScript · APIs · queues · real-time systems",
  status: "open_to_opportunities", // confirm: true
  location: "Dhaka, Bangladesh",
  locationShort: "dhaka, bd",
  email: "emonhasan7650@gmail.com",
  resume: "/Emon-resume.pdf",
  photo: "", // empty = bundled /assets/profile.png
  workMode: "onsite / remote",
  focusAreas: ["API design", "Payments & payouts", "Queues & workers", "Real-time events", "Data modelling", "Deployment"],
  contact: {
    accepting: "backend / api / platform engineering", // confirm: true
    headline: "Let's build backends that stay up",
    availability: "open to conversations",
  },
  githubBlurb:
    "Backend services, experiments and older full-stack work. Client codebases stay private; the rest lives here.",
  intro:
    "I design and build backend systems in TypeScript and Node.js: REST and real-time APIs, payment and payout flows, Redis-backed job queues and the workers behind them.",
  about: [
    "I work on the part of the product users never see: data models, request pipelines, background jobs and the integrations that move money and messages.",
    "Recent work includes an expert-consultation marketplace with paid video sessions and Stripe Connect payouts, and a ride-sharing platform with split fares, Socket.IO dispatch, a BullMQ worker and a Docker-based deployment.",
    "I keep codebases boring in the good way: strict module layering, validated inputs, centralised error handling and logs you can actually read at 3 a.m.",
  ],
};

export const links = {
  github: "https://github.com/emonhassan83",
  githubUser: "emonhassan83",
  linkedin: "https://www.linkedin.com/in/emonhassan83",
  medium: "https://medium.com/@emon-hassan",
  whatsapp: "https://wa.me/qr/SNWERHIR4JHWE1",
  email: `mailto:${profile.email}`,
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Systems" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

/** Hero facts: counted directly from the project repositories. */
export const heroFacts = [
  { value: "34", label: "domain modules", source: "Consultz API" },
  { value: "2", label: "services: API + worker", source: "Split Ride" },
  { value: "5", label: "locales served", source: "Split Ride i18n" },
  { value: "4", label: "RBAC roles", source: "Medico" },
];

export const ticker = [
  "Node.js", "TypeScript", "Express", "MongoDB", "PostgreSQL", "Prisma", "Redis",
  "BullMQ", "Socket.IO", "REST", "GraphQL", "Docker", "AWS S3", "Stripe Connect", "Zod",
];

export const terminal = [
  { cmd: "whoami", out: ["emon_hassan — backend engineer"] },
  {
    cmd: "cat stack.yml",
    out: ["runtime: node, typescript", "data: mongodb, postgresql, redis", "async: bullmq, socket.io, cron"],
  },
  { cmd: "curl -s /api/v1/health", out: ['{ "status": "ok", "service": "portfolio" }'] },
];

/**
 * Work history. confirm: true — inferred from the organisation that owns the
 * Consultz repository. Replace with exact title and dates.
 */
export const experience = [
  {
    id: "log.01",
    role: "Backend Developer",
    company: "Spark Tech Agency",
    url: "https://github.com/sparktechagency",
    period: "Current role",
    type: "full_time",
    status: "active",
    confirm: true,
    points: [
      "Build and maintain Express 5 + TypeScript + MongoDB backends for marketplace and mobility products.",
      "Implemented paid booking flows with Stripe payments and Stripe Connect payouts to service providers.",
      "Ship real-time features over Socket.IO: chat, notifications and live dispatch events.",
      "Moved slow side effects (email, push notifications) to a Redis-backed BullMQ worker running beside the API.",
      "Containerised services with Docker Compose and kept modules on a strict route → controller → service → model layering.",
    ],
    stack: ["TypeScript", "Express", "MongoDB", "Redis", "BullMQ", "Socket.IO", "Stripe", "Docker", "AWS S3"],
  },
  {
    id: "log.02",
    role: "Full Stack Developer",
    company: "Independent projects",
    url: "https://github.com/emonhassan83",
    period: "2023 — 2024",
    type: "projects",
    status: "shipped",
    points: [
      "Built Petfinder: pet adoption platform on Express, PostgreSQL and Prisma with JWT auth, filtering and pagination.",
      "Built Cycle Control Hub: multi-role inventory and sales dashboard with weekly to yearly sales history on MongoDB.",
      "Built Artistry Academia: course platform with Firebase auth + JWT, role management and Stripe checkout.",
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "JWT", "Stripe", "Next.js"],
  },
];

/**
 * Architecture graphs: columns are rendered left → right.
 * `kind` drives node styling: client | edge | service | async | data | external.
 */
export const projects = [
  {
    slug: "consultz",
    id: "proj.01",
    name: "Consultz",
    category: "Expert consultation marketplace — backend",
    summary:
      "Clients book paid video sessions with experts. The API handles dynamic booking slots, Stripe payments with Stripe Connect payouts, Agora video tokens, Socket.IO chat, a points economy and scheduled jobs.",
    role: "backend engineering — api, payments, real-time",
    size: "lg",
    stack: ["TypeScript", "Express 5", "MongoDB", "Mongoose", "Socket.IO", "Stripe Connect", "Agora", "Firebase", "AWS S3", "Twilio", "node-cron", "Zod", "Winston"],
    highlights: [
      "34 domain modules on one layered pattern: booking, payment, refund, withdraw, chat, points, feed, reports.",
      "Bookings moved from pre-generated slots to dynamic slots with stored start/end times.",
      "Experts are paid out through Stripe Connect; refunds and manual withdraw holds are tracked as their own modules.",
      "Socket.IO runs on its own port; services emit notifications through a shared io instance.",
    ],
    links: [{ label: "Source", href: "https://github.com/emonhassan83/backend-consultz" }],
    architecture: [
      { label: "clients", nodes: [{ name: "Mobile app", kind: "client" }, { name: "Admin panel", kind: "client" }] },
      { label: "interface", nodes: [{ name: "REST /api/v1", kind: "edge" }, { name: "Socket.IO", kind: "edge" }] },
      { label: "services", nodes: [{ name: "Booking", kind: "service" }, { name: "Payments", kind: "service" }, { name: "Chat + notify", kind: "service" }, { name: "Cron jobs", kind: "async" }] },
      { label: "state", nodes: [{ name: "MongoDB", kind: "data" }, { name: "S3 / Spaces", kind: "data" }] },
      { label: "external", nodes: [{ name: "Stripe Connect", kind: "external" }, { name: "Agora", kind: "external" }, { name: "Firebase FCM", kind: "external" }, { name: "Twilio", kind: "external" }] },
    ],
    flow: [
      "Client requests a slot → Zod validates { body, params, query } → auth() checks role.",
      "Booking service computes and stores startAt / endAt for the dynamic slot.",
      "Payment intent is created in Stripe; the expert's share is routed via Stripe Connect.",
      "At session time the API issues an Agora token; chat and status updates stream over Socket.IO.",
      "Points are awarded and logged; cron jobs handle time-based state changes.",
    ],
  },
  {
    slug: "split-ride",
    id: "proj.02",
    name: "Split Ride",
    category: "Ride-sharing platform — backend + worker",
    summary:
      "Riders, drivers and admins with private and split-fare rides. An Express API with Socket.IO and Redis handles the live path; a separate BullMQ worker sends email and push notifications. The whole stack runs on Docker Compose behind Caddy.",
    role: "backend engineering — api, queues, deployment",
    size: "lg",
    stack: ["TypeScript", "Express 5", "MongoDB", "Redis", "BullMQ", "Socket.IO", "Stripe Connect", "Docker", "Caddy", "Vitest", "i18next", "AWS S3"],
    highlights: [
      "Two deployable services: the API and a BullMQ consumer for email (Handlebars + Nodemailer) and push.",
      "Private and split-fare calculation, including fare recalculation when riders join or leave.",
      "Responses and errors translated automatically into 5 languages (en, el, he, ru, uk).",
      "Hardened with helmet, rate limiting and XSS sanitising; unit and integration tests with Vitest.",
    ],
    links: [{ label: "Source", href: "https://github.com/emonhassan83/ride-sharing-backend" }],
    architecture: [
      { label: "clients", nodes: [{ name: "Rider app", kind: "client" }, { name: "Driver app", kind: "client" }, { name: "Admin", kind: "client" }] },
      { label: "edge", nodes: [{ name: "Caddy", kind: "edge" }] },
      { label: "api", nodes: [{ name: "REST /api/v1", kind: "service" }, { name: "Socket.IO", kind: "service" }, { name: "Cron", kind: "async" }] },
      { label: "async", nodes: [{ name: "Redis", kind: "data" }, { name: "BullMQ worker", kind: "async" }] },
      { label: "state + external", nodes: [{ name: "MongoDB", kind: "data" }, { name: "Stripe Connect", kind: "external" }, { name: "SMTP / FCM", kind: "external" }] },
    ],
    flow: [
      "Request enters through Caddy → i18n middleware → validated, role-checked route.",
      "Fare service prices the ride as private or split, using route distance.",
      "Ride events are pushed to rider and driver over Socket.IO.",
      "Side effects are enqueued to BullMQ on Redis instead of blocking the request.",
      "The worker renders templates and sends email and push notifications.",
    ],
  },
  {
    slug: "medico",
    id: "proj.03",
    name: "Medico",
    category: "Healthcare management system — full stack",
    summary:
      "Clinical operations for four roles: admin, receptionist, doctor and patient. Covers doctor scheduling, appointment booking, digital prescriptions, invoicing and SSLCommerz payments on a PostgreSQL schema managed with Prisma.",
    role: "full stack — schema, api, dashboards",
    size: "md",
    stack: ["TypeScript", "Express", "PostgreSQL", "Prisma", "Zod", "JWT", "Next.js 14", "Ant Design", "SSLCommerz", "Winston"],
    highlights: [
      "Role-based access for 4 personas with separate capabilities and dashboards.",
      "Doctors and receptionists publish bookable availability slots; patients book in real time.",
      "Online payment with instant invoice generation, plus manual verification for offline payments.",
    ],
    links: [
      { label: "Live", href: "https://medico-client-tau.vercel.app" },
      { label: "Source", href: "https://github.com/emonhassan83/medico" },
    ],
    architecture: [
      { label: "clients", nodes: [{ name: "Next.js app", kind: "client" }] },
      { label: "api", nodes: [{ name: "Express REST", kind: "service" }, { name: "Auth + RBAC", kind: "edge" }] },
      { label: "domain", nodes: [{ name: "Scheduling", kind: "service" }, { name: "Prescriptions", kind: "service" }, { name: "Invoicing", kind: "service" }] },
      { label: "state", nodes: [{ name: "Prisma ORM", kind: "data" }, { name: "PostgreSQL", kind: "data" }] },
      { label: "external", nodes: [{ name: "SSLCommerz", kind: "external" }, { name: "SMTP", kind: "external" }] },
    ],
    flow: [
      "Patient searches doctors by department and availability.",
      "Booking reserves a published schedule slot inside a transaction.",
      "Payment goes through SSLCommerz; an invoice is generated on success.",
      "The doctor issues a digital prescription the patient can view and print.",
    ],
  },
  {
    slug: "fototidy",
    id: "proj.04",
    name: "FotoTidy",
    category: "Client project",
    summary: null, // confirm: true — add description, stack and links
    role: "backend engineering",
    size: "sm",
    proprietary: true,
    stack: [],
    highlights: [],
    links: [],
  },
  {
    slug: "ensinor",
    id: "proj.05",
    name: "Ensinor",
    category: "Client project",
    summary: null, // confirm: true — add description, stack and links
    role: "backend engineering",
    size: "sm",
    proprietary: true,
    stack: [],
    highlights: [],
    links: [],
  },
];

/** Generic reference architecture shown before the per-project diagrams. */
export const referenceArchitecture = {
  name: "How I structure a backend",
  principles: [
    "Requests stay thin: validate, authorise, call a service, respond.",
    "Anything slow or retryable becomes a job on a queue, handled by a separate worker.",
    "State lives in one primary database; Redis for queues, caching and fast lookups.",
    "Third-party calls (payments, push, SMS, video) are isolated behind service modules.",
  ],
  architecture: [
    { label: "clients", nodes: [{ name: "Web / mobile", kind: "client" }] },
    { label: "edge", nodes: [{ name: "Reverse proxy", kind: "edge" }, { name: "Rate limit", kind: "edge" }] },
    { label: "api", nodes: [{ name: "Routes + Zod", kind: "service" }, { name: "Controllers", kind: "service" }, { name: "Services", kind: "service" }] },
    { label: "async", nodes: [{ name: "BullMQ queue", kind: "async" }, { name: "Workers", kind: "async" }] },
    { label: "state", nodes: [{ name: "MongoDB / Postgres", kind: "data" }, { name: "Redis", kind: "data" }, { name: "Object storage", kind: "data" }] },
  ],
};

/** Stack index. `icon` is a simpleicons.org slug; `mono` is the fallback monogram. */
export const stackGroups = [
  {
    title: "Languages & runtime",
    items: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
  {
    title: "APIs & frameworks",
    items: [
      { name: "Express", icon: "express" },
      { name: "REST", mono: "API" },
      { name: "GraphQL", icon: "graphql" },
      { name: "Socket.IO", icon: "socketdotio" },
      { name: "Zod", icon: "zod" },
      { name: "Next.js", icon: "nextdotjs" },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "Mongoose", icon: "mongoose" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Prisma", icon: "prisma" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    title: "Async & messaging",
    items: [
      { name: "BullMQ", mono: "BQ" },
      { name: "Job workers", mono: "WK" },
      { name: "node-cron", mono: "CR" },
      { name: "Nodemailer", mono: "NM" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    title: "Infra & cloud",
    items: [
      { name: "Docker", icon: "docker" },
      { name: "AWS S3", mono: "S3" },
      { name: "DigitalOcean", icon: "digitalocean" },
      { name: "Caddy", icon: "caddy" },
      { name: "Vercel", icon: "vercel" },
      { name: "Git", icon: "git" },
    ],
  },
  {
    title: "Integrations & quality",
    items: [
      { name: "Stripe", icon: "stripe" },
      { name: "SSLCommerz", mono: "SC" },
      { name: "Agora", mono: "AG" },
      { name: "JWT", icon: "jsonwebtokens" },
      { name: "Vitest", icon: "vitest" },
      { name: "Postman", icon: "postman" },
    ],
  },
];

export const practices = [
  {
    title: "Layered modules",
    body: "Every feature is route → controller → service → model. Controllers never touch the database; services own business logic.",
    code: "modules/booking/\n  booking.route.ts\n  booking.controller.ts\n  booking.service.ts\n  booking.model.ts",
  },
  {
    title: "Validate at the edge",
    body: "Zod schemas validate { body, params, query } before a controller runs, so services only ever see typed, trusted input.",
    code: "router.post('/',\n  auth(ROLE.user),\n  validate(createBooking),\n  BookingController.create)",
  },
  {
    title: "One error path",
    body: "Services throw AppError. A global handler normalises Zod, cast, validation and duplicate-key errors into one response shape.",
    code: "throw new AppError(\n  409, 'Slot already booked')",
  },
  {
    title: "Async by default",
    body: "Email, push and other slow side effects go onto a BullMQ queue backed by Redis and run in a separate worker process.",
    code: "await notifyQueue.add('ride.accepted', {\n  rideId, riderId })",
  },
  {
    title: "Secure by default",
    body: "JWT access + refresh tokens, role guards per route, bcrypt hashing, helmet, rate limiting and input sanitising.",
    code: "app.use(helmet())\napp.use(rateLimit({ windowMs, max }))",
  },
  {
    title: "Observable & shippable",
    body: "Winston with daily-rotated logs, Vitest unit and integration tests, and Docker Compose for API, worker and Redis.",
    code: "docker compose up --build -d\n# redis · server · worker",
  },
];

export const education = [
  {
    period: "Jan 2020 — Present",
    title: "BSc (Hons) Chemistry",
    org: "Govt. Bangla College, Dhaka",
  },
];

export const certifications = [
  {
    period: "Nov 2023 — Jun 2024",
    title: "Next Level Web Development (Batch 2)",
    org: "Programming Hero",
    note: "TypeScript, Mongoose, PostgreSQL, Prisma, Redux, Next.js",
  },
  {
    period: "Dec 2022 — Jun 2023",
    title: "Complete Web Development (Batch 7)",
    org: "Programming Hero",
    note: "JavaScript, React, Node.js, Express, MongoDB",
  },
];

/** Shown if the GitHub API is unavailable or rate-limited. */
export const fallbackRepos = [
  { name: "backend-consultz", description: "Expert consultation marketplace backend", language: "TypeScript" },
  { name: "ride-sharing-backend", description: "Split Ride: API + BullMQ worker", language: "TypeScript" },
  { name: "medico", description: "Healthcare management platform", language: "TypeScript" },
  { name: "petfinder", description: "Pet adoption platform with Prisma + PostgreSQL", language: "TypeScript" },
  { name: "postgres-backend", description: "PostgreSQL backend", language: "TypeScript" },
  { name: "cycle-control-hub", description: "Multi-role bike inventory dashboard", language: "TypeScript" },
];
