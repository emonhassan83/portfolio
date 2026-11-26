import { buildContent } from "./portfolioContent";

/** Cache tag the backend revalidates (via /api/revalidate) after every dashboard write. */
export const PORTFOLIO_TAG = "portfolio";

/**
 * Server-only: loads the published portfolio from the backend. Cached for 60s and
 * tagged so dashboard saves show up immediately. Any failure falls back to the
 * static data file, so the page always renders.
 */
export async function getPortfolio() {
  let live = null;
  try {
    const res = await fetch(`${process.env.API_ORIGIN}/api/portfolio`, {
      next: { revalidate: 60, tags: [PORTFOLIO_TAG] },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) live = (await res.json())?.data ?? null;
  } catch {
    live = null;
  }
  return buildContent(live);
}
