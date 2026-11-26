import { site } from "../data/portfolio";

export default function sitemap() {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
