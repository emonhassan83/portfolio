/**
 * Dashboard form schemas for portfolio content. They mirror the server's Zod
 * schemas (server/src/app/modules/portfolio/portfolio.validation.ts); the server
 * stays the source of truth for validation.
 */

const kinds = ["client", "edge", "service", "async", "data", "external"].map((k) => ({ value: k, label: k }));

const urlHelp = "https://…, mailto:… or a site path like /file.pdf";

const architectureField = {
  name: "architecture",
  label: "Architecture diagram (columns, left → right)",
  type: "repeater",
  itemLabel: "Column",
  titleField: "label",
  maxItems: 7,
  help: "Each column is a layer (clients, api, data…). Node kind controls its colour.",
  fields: [
    { name: "label", label: "Column label", type: "text", required: true },
    {
      name: "nodes",
      label: "Nodes",
      type: "repeater",
      itemLabel: "Node",
      titleField: "name",
      maxItems: 8,
      newItem: () => ({ name: "", kind: "service" }),
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "kind", label: "Kind", type: "select", options: kinds },
      ],
    },
  ],
};

export const profileSchema = [
  {
    name: "profile",
    label: "Hero & identity",
    type: "group",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "firstName", label: "First name (hero line 1)", type: "text", required: true },
      { name: "lastName", label: "Last name (hero line 2)", type: "text" },
      { name: "roleLine", label: "Role line", type: "text", wide: true, help: "Shown after the role, e.g. “Node.js · TypeScript · APIs”" },
      { name: "status", label: "Status", type: "text", help: "Hero status line, e.g. open_to_opportunities" },
      { name: "email", label: "Public email", type: "email", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "locationShort", label: "Location (short)", type: "text" },
      { name: "workMode", label: "Work mode", type: "text", help: "e.g. onsite / remote" },
      { name: "resume", label: "Resume URL", type: "url", help: urlHelp },
      { name: "photo", label: "Photo URL", type: "url", help: "Leave empty to use the bundled photo." },
      { name: "intro", label: "Hero intro", type: "textarea", rows: 3 },
    ],
  },
  {
    name: "profile",
    label: "About",
    type: "group",
    fields: [
      { name: "about", label: "About paragraphs", type: "list", rows: 6, help: "One paragraph per line." },
      { name: "focusAreas", label: "Focus areas", type: "list", rows: 4 },
      { name: "githubBlurb", label: "GitHub section blurb", type: "textarea", rows: 2 },
    ],
  },
  {
    name: "profile",
    label: "Contact section",
    type: "group",
    fields: [
      {
        name: "contact",
        label: "Contact copy",
        type: "group",
        fields: [
          { name: "accepting", label: "Accepting line", type: "text", wide: true },
          { name: "headline", label: "Headline", type: "text", wide: true },
          { name: "availability", label: "Availability note", type: "text" },
        ],
      },
    ],
  },
  {
    name: "links",
    label: "Links",
    type: "group",
    fields: [
      { name: "github", label: "GitHub URL", type: "url" },
      { name: "githubUser", label: "GitHub username", type: "text", help: "Used for live repos and the contribution graph." },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "medium", label: "Writing / blog URL", type: "url" },
      { name: "whatsapp", label: "WhatsApp URL", type: "url" },
    ],
  },
  {
    name: "heroFacts",
    label: "Hero facts",
    type: "repeater",
    itemLabel: "Fact",
    titleField: "label",
    maxItems: 6,
    help: "Only verifiable numbers.",
    fields: [
      { name: "value", label: "Value", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "source", label: "Source", type: "text" },
    ],
  },
  { name: "ticker", label: "Technology ticker", type: "list", rows: 6, help: "One technology per line." },
  {
    name: "referenceArchitecture",
    label: "Reference architecture",
    type: "group",
    fields: [
      { name: "name", label: "Title", type: "text", wide: true },
      { name: "principles", label: "Principles", type: "list", rows: 4 },
      architectureField,
    ],
  },
  {
    name: "site",
    label: "SEO & site",
    type: "group",
    fields: [
      { name: "title", label: "Page title", type: "text", required: true, wide: true },
      { name: "description", label: "Meta description", type: "textarea", rows: 2, required: true },
      { name: "version", label: "Version label", type: "text" },
      { name: "timezone", label: "Timezone (IANA)", type: "text", help: "e.g. Asia/Dhaka" },
      { name: "tzLabel", label: "Clock label", type: "text" },
    ],
  },
];

/**
 * The profile schema repeats the `profile` group for layout; this merged version
 * is used to build the save payload.
 */
export const profilePayloadSchema = (() => {
  const merged = [];
  for (const f of profileSchema) {
    const existing = merged.find((m) => m.name === f.name);
    if (existing && f.type === "group") existing.fields = [...existing.fields, ...f.fields];
    else merged.push(f.type === "group" ? { ...f, fields: [...f.fields] } : f);
  }
  return merged;
})();

export const resources = {
  experience: {
    title: "Experience",
    singular: "Role",
    describe: (i) => ({ title: `${i.role} — ${i.company}`, meta: i.period }),
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true, help: "e.g. 2023 — Present" },
      { name: "url", label: "Company URL", type: "url" },
      { name: "type", label: "Type chip", type: "text", help: "e.g. full_time" },
      { name: "status", label: "Status chip", type: "text", help: "e.g. active" },
      { name: "points", label: "What you did", type: "list", rows: 6 },
      { name: "stack", label: "Stack", type: "list", rows: 4 },
      { name: "isPublished", label: "Published", type: "switch" },
    ],
  },
  projects: {
    title: "Case studies",
    singular: "Project",
    describe: (i) => ({ title: i.name, meta: `${i.category || ""}${i.isPublished ? "" : " · hidden"}` }),
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "lowercase-with-dashes, unique" },
      { name: "category", label: "Category", type: "text", wide: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 4, help: "Empty shows the “private client project” note." },
      { name: "role", label: "Your role", type: "text" },
      {
        name: "size",
        label: "Card size",
        type: "select",
        options: [
          { value: "lg", label: "Large (half row)" },
          { value: "md", label: "Medium (half row)" },
          { value: "sm", label: "Small (quarter row)" },
        ],
      },
      { name: "proprietary", label: "Proprietary / private code", type: "switch" },
      { name: "isPublished", label: "Published", type: "switch" },
      { name: "stack", label: "Stack", type: "list", rows: 4 },
      { name: "highlights", label: "Engineering notes", type: "list", rows: 5 },
      {
        name: "links",
        label: "Links",
        type: "repeater",
        itemLabel: "Link",
        titleField: "label",
        maxItems: 6,
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "href", label: "URL", type: "url", required: true },
        ],
      },
      { name: "flow", label: "Request trace steps", type: "list", rows: 5 },
      architectureField,
    ],
    defaults: { size: "sm", proprietary: false, isPublished: true },
  },
  stack: {
    title: "Stack groups",
    singular: "Group",
    describe: (i) => ({ title: i.title, meta: `${i.items?.length || 0} entries` }),
    fields: [
      { name: "title", label: "Group title", type: "text", required: true, wide: true },
      {
        name: "items",
        label: "Technologies",
        type: "repeater",
        itemLabel: "Tech",
        titleField: "name",
        maxItems: 30,
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "icon", label: "simpleicons slug", type: "text", help: "e.g. nodedotjs (simpleicons.org)" },
          { name: "mono", label: "Monogram fallback", type: "text", help: "Up to 4 letters" },
        ],
      },
      { name: "isPublished", label: "Published", type: "switch" },
    ],
    defaults: { isPublished: true },
  },
  practices: {
    title: "Engineering practices",
    singular: "Practice",
    describe: (i) => ({ title: i.title, meta: i.body?.slice(0, 70) }),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "body", label: "Description", type: "textarea", rows: 3, required: true },
      { name: "code", label: "Code snippet", type: "code", rows: 5 },
      { name: "isPublished", label: "Published", type: "switch" },
    ],
    defaults: { isPublished: true },
  },
  credentials: {
    title: "Education & certifications",
    singular: "Entry",
    describe: (i) => ({ title: i.title, meta: `${i.kind} · ${i.org}` }),
    fields: [
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: [
          { value: "certification", label: "Certification" },
          { value: "education", label: "Education" },
        ],
      },
      { name: "period", label: "Period", type: "text" },
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "org", label: "Organisation", type: "text", required: true },
      { name: "url", label: "Verification URL", type: "url" },
      { name: "note", label: "Note", type: "text", wide: true, help: "e.g. topics covered" },
      { name: "isPublished", label: "Published", type: "switch" },
    ],
    defaults: { kind: "certification", isPublished: true },
  },
};
