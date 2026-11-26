import * as defaults from "../data/portfolio";

/**
 * Shapes portfolio content for the home page.
 *
 * `live` is the public API payload ({ profile, experience, projects, stack, practices, credentials })
 * or null. Until content has been imported into the dashboard (no profile document yet), the
 * static data file is used for everything. After that the database is the source of truth, so
 * items removed in the dashboard really disappear; defaults only fill fields an older document lacks.
 */
const pad = (i) => String(i + 1).padStart(2, "0");

export function buildContent(live) {
  const managed = !!live?.profile;
  const p = managed ? live.profile : null;

  const profile = {
    ...defaults.profile,
    ...(p?.profile || {}),
    contact: { ...defaults.profile.contact, ...(p?.profile?.contact || {}) },
  };
  const site = { ...defaults.site, ...(p?.site || {}), url: defaults.site.url };
  const links = { ...defaults.links, ...(p?.links || {}), email: `mailto:${profile.email}` };

  const experience = (managed ? live.experience : defaults.experience).map((e, i) => ({
    ...e,
    id: `log.${pad(i)}`,
  }));

  const projects = (managed ? live.projects : defaults.projects).map((pr, i) => ({
    ...pr,
    id: `proj.${pad(i)}`,
    summary: pr.summary || null,
    architecture: pr.architecture?.length ? pr.architecture : null,
    flow: pr.flow?.length ? pr.flow : null,
    stack: pr.stack || [],
    highlights: pr.highlights || [],
    links: pr.links || [],
  }));

  const credentials = managed
    ? live.credentials
    : [
        ...defaults.education.map((e) => ({ ...e, kind: "education" })),
        ...defaults.certifications.map((c) => ({ ...c, kind: "certification" })),
      ];

  const referenceArchitecture = {
    ...defaults.referenceArchitecture,
    ...(p?.referenceArchitecture || {}),
  };

  return {
    managed,
    site,
    profile,
    links,
    navItems: defaults.navItems,
    heroFacts: p ? p.heroFacts : defaults.heroFacts,
    ticker: p ? p.ticker : defaults.ticker,
    terminal: p ? p.terminal : defaults.terminal,
    experience,
    projects,
    referenceArchitecture,
    stackGroups: managed ? live.stack : defaults.stackGroups,
    practices: managed ? live.practices : defaults.practices,
    education: credentials.filter((c) => c.kind === "education"),
    certifications: credentials.filter((c) => c.kind === "certification"),
    fallbackRepos: defaults.fallbackRepos,
  };
}

const str = (v) => (v == null ? "" : String(v));

/** Payload for POST /portfolio/import: the static data file in the API's shape. */
export function toImportPayload() {
  const { site, profile, links, heroFacts, ticker, terminal, referenceArchitecture } = defaults;
  // Display ids are derived from order; `confirm` is an authoring note.
  const strip = (item) => {
    const rest = { ...item };
    delete rest.id;
    delete rest.confirm;
    return rest;
  };

  return {
    profile: {
      site: {
        title: site.title,
        description: site.description,
        version: site.version,
        timezone: site.timezone,
        tzLabel: site.tzLabel,
      },
      profile: {
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        roleLine: profile.roleLine,
        status: profile.status,
        location: profile.location,
        locationShort: profile.locationShort,
        email: profile.email,
        resume: profile.resume,
        photo: profile.photo,
        intro: profile.intro,
        about: profile.about,
        workMode: profile.workMode,
        focusAreas: profile.focusAreas,
        contact: profile.contact,
        githubBlurb: profile.githubBlurb,
      },
      links: {
        github: links.github,
        githubUser: links.githubUser,
        linkedin: links.linkedin,
        medium: links.medium,
        whatsapp: links.whatsapp,
      },
      heroFacts,
      ticker,
      terminal,
      referenceArchitecture,
    },
    experience: defaults.experience.map(strip),
    projects: defaults.projects.map((pr) => ({
      ...strip(pr),
      summary: str(pr.summary),
      architecture: pr.architecture || [],
      flow: pr.flow || [],
      proprietary: !!pr.proprietary,
    })),
    stack: defaults.stackGroups.map((g) => ({
      title: g.title,
      items: g.items.map((it) => ({ name: it.name, icon: str(it.icon), mono: str(it.mono) })),
    })),
    practices: defaults.practices,
    credentials: [
      ...defaults.education.map((e) => ({ kind: "education", period: e.period, title: e.title, org: e.org, note: str(e.note) })),
      ...defaults.certifications.map((c) => ({ kind: "certification", period: c.period, title: c.title, org: c.org, note: str(c.note) })),
    ],
  };
}
