import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { PORTFOLIO_TAG } from "../../../lib/getPortfolio";

/** Called by the backend after a dashboard write, authenticated with a shared secret. */
export async function POST(request) {
  const secret = Buffer.from(process.env.REVALIDATE_SECRET || "");
  const given = Buffer.from(request.headers.get("x-revalidate-secret") || "");

  const ok = secret.length > 0 && given.length === secret.length && timingSafeEqual(given, secret);

  if (!ok) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag(PORTFOLIO_TAG);
  return NextResponse.json({ revalidated: true, at: Date.now() });
}
