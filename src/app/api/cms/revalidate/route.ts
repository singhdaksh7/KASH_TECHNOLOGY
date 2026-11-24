import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { cmsEnv, CMS_TAG } from "@/lib/cms/env";

/**
 * Post-publish refresh hook for the CMS backend:
 *   POST /api/cms/revalidate   Authorization: Bearer $CMS_REVALIDATE_SECRET
 *   body (optional): { "tags": ["cms:page:home", "cms:navigation"] }  — defaults to everything ("cms")
 * Disabled (404) unless CMS_REVALIDATE_SECRET is set.
 */
export const dynamic = "force-dynamic";

const TAG_RE = /^cms(?::[a-z0-9-/]+)*$/;

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: NextRequest) {
  const secret = cmsEnv.revalidateSecret;
  if (!secret) return new NextResponse(null, { status: 404 });
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!provided || !safeEqual(provided, secret)) return NextResponse.json({ ok: false }, { status: 401 });

  let tags: string[] = [CMS_TAG];
  try {
    const body = (await req.json()) as { tags?: unknown };
    if (Array.isArray(body.tags)) {
      const valid = body.tags.filter((t): t is string => typeof t === "string" && TAG_RE.test(t)).slice(0, 25);
      if (valid.length) tags = valid;
    }
  } catch {
    /* empty body → revalidate all */
  }
  for (const t of tags) revalidateTag(t, "max");
  return NextResponse.json({ ok: true, revalidated: tags });
}
