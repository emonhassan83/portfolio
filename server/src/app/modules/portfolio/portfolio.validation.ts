import { z } from 'zod';
import {
  CREDENTIAL_KINDS,
  NODE_KINDS,
  PORTFOLIO_RESOURCES,
  PROJECT_SIZES,
} from './portfolio.constant';

// ---- primitives -----------------------------------------------------------

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => z.string().trim().min(1, 'Required').max(max);

/** Only http(s), mailto and site-relative links; blocks javascript: and data: URLs. */
const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || /^(https?:\/\/|mailto:|\/(?!\/))/i.test(v), {
    message: 'Use an https://, mailto: or /relative link',
  });

const list = (maxItems: number, maxLen: number) =>
  z.array(required(maxLen)).max(maxItems).default([]);

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const architecture = z
  .array(
    z.strictObject({
      label: required(40),
      nodes: z
        .array(z.strictObject({ name: required(40), kind: z.enum(NODE_KINDS) }))
        .min(1)
        .max(8),
    }),
  )
  .max(7)
  .default([]);

const publishing = {
  order: z.number().int().min(0).max(10_000).optional(),
  isPublished: z.boolean().optional(),
};

// ---- profile (singleton) --------------------------------------------------

const profileBody = z.strictObject({
  site: z.strictObject({
    title: required(120),
    description: required(320),
    version: text(20).default(''),
    timezone: text(60).default('Asia/Dhaka'),
    tzLabel: text(10).default(''),
  }),
  profile: z.strictObject({
    name: required(80),
    firstName: required(40),
    lastName: text(40).default(''),
    role: required(80),
    roleLine: text(160).default(''),
    status: text(60).default(''),
    location: text(80).default(''),
    locationShort: text(40).default(''),
    email: z.string().trim().email().max(254),
    resume: url.default(''),
    photo: url.default(''),
    intro: text(600).default(''),
    about: list(6, 800),
    workMode: text(60).default(''),
    focusAreas: list(12, 60),
    contact: z
      .strictObject({
        accepting: text(160).default(''),
        headline: text(160).default(''),
        availability: text(120).default(''),
      })
      .default({ accepting: '', headline: '', availability: '' }),
    githubBlurb: text(400).default(''),
  }),
  links: z.strictObject({
    github: url.default(''),
    githubUser: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9-]{0,39}$/, 'GitHub username: letters, numbers and dashes')
      .default(''),
    linkedin: url.default(''),
    medium: url.default(''),
    whatsapp: url.default(''),
  }),
  heroFacts: z
    .array(z.strictObject({ value: required(12), label: required(60), source: text(60).default('') }))
    .max(6)
    .default([]),
  ticker: list(40, 40),
  terminal: z
    .array(z.strictObject({ cmd: required(80), out: list(6, 160) }))
    .max(6)
    .default([]),
  referenceArchitecture: z.strictObject({
    name: text(120).default(''),
    principles: list(8, 300),
    architecture,
  }),
});

// ---- collections ----------------------------------------------------------

const experience = z.strictObject({
  role: required(100),
  company: required(100),
  url: url.default(''),
  period: required(60),
  type: text(40).default(''),
  status: text(40).default(''),
  points: list(12, 400),
  stack: list(30, 40),
  ...publishing,
});

const projects = z.strictObject({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and dashes only'),
  name: required(80),
  category: text(120).default(''),
  summary: text(1200).default(''),
  role: text(120).default(''),
  size: z.enum(PROJECT_SIZES).default('sm'),
  proprietary: z.boolean().default(false),
  stack: list(30, 40),
  highlights: list(10, 400),
  links: z
    .array(z.strictObject({ label: required(30), href: url.refine((v) => v !== '', 'Required') }))
    .max(6)
    .default([]),
  architecture,
  flow: list(10, 300),
  ...publishing,
});

const stack = z.strictObject({
  title: required(60),
  items: z
    .array(
      z.strictObject({
        name: required(40),
        icon: z
          .string()
          .trim()
          .max(40)
          .regex(/^[a-z0-9]*$/, 'simpleicons slug: lowercase letters and numbers')
          .default(''),
        mono: text(4).default(''),
      }),
    )
    .max(30)
    .default([]),
  ...publishing,
});

const practices = z.strictObject({
  title: required(80),
  body: required(500),
  code: text(600).default(''),
  ...publishing,
});

const credentials = z.strictObject({
  kind: z.enum(CREDENTIAL_KINDS),
  period: text(60).default(''),
  title: required(160),
  org: required(120),
  note: text(300).default(''),
  url: url.default(''),
  ...publishing,
});

export const resourceSchemas = {
  experience,
  projects,
  stack,
  practices,
  credentials,
} as const;

// ---- request schemas --------------------------------------------------------

const resourceParam = z.enum(PORTFOLIO_RESOURCES);

const updateProfile = z.object({ body: profileBody });

const listResource = z.object({ params: z.object({ resource: resourceParam }) });

const createResource = z.object({ params: z.object({ resource: resourceParam }) });

const resourceById = z.object({
  params: z.object({ resource: resourceParam, id: objectId }),
});

const reorderResource = z.object({
  params: z.object({ resource: resourceParam }),
  body: z.strictObject({ ids: z.array(objectId).min(1).max(200) }),
});

const importAll = z.object({
  body: z.strictObject({
    profile: profileBody,
    experience: z.array(experience).max(50).default([]),
    projects: z.array(projects).max(50).default([]),
    stack: z.array(stack).max(30).default([]),
    practices: z.array(practices).max(30).default([]),
    credentials: z.array(credentials).max(50).default([]),
  }),
});

export const PortfolioValidation = {
  profileBody,
  updateProfile,
  listResource,
  createResource,
  resourceById,
  reorderResource,
  importAll,
};
