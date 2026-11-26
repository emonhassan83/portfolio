import { Model, Schema, model } from 'mongoose';
import {
  CREDENTIAL_KINDS,
  NODE_KINDS,
  PROFILE_KEY,
  PROJECT_SIZES,
} from './portfolio.constant';
import { TPortfolioResource } from './portfolio.interface';

const str = { type: String, default: '' };
const strList = { type: [String], default: [] };

const architectureSchema = new Schema(
  {
    label: { type: String, required: true },
    nodes: [
      new Schema(
        { name: { type: String, required: true }, kind: { type: String, enum: NODE_KINDS } },
        { _id: false },
      ),
    ],
  },
  { _id: false },
);

/** Shared ordering / visibility fields for every collection. */
const publishing = {
  order: { type: Number, default: 0, index: true },
  isPublished: { type: Boolean, default: true },
};

const options = { timestamps: true, versionKey: false } as const;

// ---- profile (singleton) --------------------------------------------------

const profileSchema = new Schema(
  {
    key: { type: String, default: PROFILE_KEY, unique: true },
    site: {
      title: str,
      description: str,
      version: str,
      timezone: str,
      tzLabel: str,
    },
    profile: {
      name: str,
      firstName: str,
      lastName: str,
      role: str,
      roleLine: str,
      status: str,
      location: str,
      locationShort: str,
      email: str,
      resume: str,
      photo: str,
      intro: str,
      about: strList,
      workMode: str,
      focusAreas: strList,
      contact: {
        accepting: str,
        headline: str,
        availability: str,
      },
      githubBlurb: str,
    },
    links: {
      github: str,
      githubUser: str,
      linkedin: str,
      medium: str,
      whatsapp: str,
    },
    heroFacts: [new Schema({ value: str, label: str, source: str }, { _id: false })],
    ticker: strList,
    terminal: [new Schema({ cmd: str, out: strList }, { _id: false })],
    referenceArchitecture: {
      name: str,
      principles: strList,
      architecture: [architectureSchema],
    },
  },
  options,
);

export const PortfolioProfile = model('PortfolioProfile', profileSchema);

// ---- collections ----------------------------------------------------------

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    url: str,
    period: str,
    type: str,
    status: str,
    points: strList,
    stack: strList,
    ...publishing,
  },
  options,
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: str,
    summary: str,
    role: str,
    size: { type: String, enum: PROJECT_SIZES, default: 'sm' },
    proprietary: { type: Boolean, default: false },
    stack: strList,
    highlights: strList,
    links: [new Schema({ label: str, href: str }, { _id: false })],
    architecture: [architectureSchema],
    flow: strList,
    ...publishing,
  },
  options,
);

const stackGroupSchema = new Schema(
  {
    title: { type: String, required: true },
    items: [new Schema({ name: str, icon: str, mono: str }, { _id: false })],
    ...publishing,
  },
  options,
);

const practiceSchema = new Schema(
  {
    title: { type: String, required: true },
    body: str,
    code: str,
    ...publishing,
  },
  options,
);

const credentialSchema = new Schema(
  {
    kind: { type: String, enum: CREDENTIAL_KINDS, required: true },
    period: str,
    title: { type: String, required: true },
    org: str,
    note: str,
    url: str,
    ...publishing,
  },
  options,
);

export const PortfolioExperience = model('PortfolioExperience', experienceSchema);
export const PortfolioProject = model('PortfolioProject', projectSchema);
export const PortfolioStackGroup = model('PortfolioStackGroup', stackGroupSchema);
export const PortfolioPractice = model('PortfolioPractice', practiceSchema);
export const PortfolioCredential = model('PortfolioCredential', credentialSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resourceModels: Record<TPortfolioResource, Model<any>> = {
  experience: PortfolioExperience,
  projects: PortfolioProject,
  stack: PortfolioStackGroup,
  practices: PortfolioPractice,
  credentials: PortfolioCredential,
};
