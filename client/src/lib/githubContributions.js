const REVALIDATE_SECONDS = 6 * 60 * 60;

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/**
 * Last year's contribution calendar for a GitHub user, read from the public
 * profile calendar fragment (no token needed). Server-only; cached and refreshed
 * every 6 hours. Returns null if GitHub is unreachable or the markup changed,
 * so callers can simply render nothing.
 *
 * @returns {Promise<{ total: number, days: { date: string, count: number, level: number }[] } | null>}
 */
export async function getContributions(user) {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      headers: { "X-Requested-With": "XMLHttpRequest", "User-Agent": "portfolio-site" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // "35 contributions on November 23rd." / "No contributions on …", keyed by the cell id
    const counts = new Map();
    for (const m of html.matchAll(/<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)</g)) {
      const n = m[2].trim().match(/^([\d,]+)\s+contribution/);
      counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
    }

    const days = [];
    for (const [tag] of html.matchAll(/<td[^>]*\sdata-date="[^"]+"[^>]*>/g)) {
      const date = attr(tag, "data-date");
      const level = Number(attr(tag, "data-level") ?? 0);
      days.push({ date, level, count: counts.get(attr(tag, "id")) ?? 0 });
    }
    if (days.length < 300) return null; // not a full calendar: treat as a failed read
    days.sort((a, b) => a.date.localeCompare(b.date));

    const stated = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
    const total = stated ? Number(stated[1].replace(/,/g, "")) : days.reduce((sum, d) => sum + d.count, 0);
    return { total, days };
  } catch {
    return null;
  }
}
