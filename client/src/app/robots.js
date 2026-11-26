import { site } from "../data/portfolio";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/login", "/register"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
