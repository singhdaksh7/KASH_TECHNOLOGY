import { createHmac, timingSafeEqual } from "node:crypto";
import { cmsEnv } from "./env";

/**
 * Preview integration hook.
 *
 * `/preview?page=<id>&token=<signed>` renders a DRAFT page with noindex and a
 * banner. This file deliberately does not implement admin authentication.
 * `authorizePreview` is the single choke point (admin session or signed token).
 */

export type PreviewAuthResult = { ok: true; credential: string } | { ok: false };

interface PreviewRequest {
  pageId: string;
  token: string | undefined;
}

const b64u = (b: Buffer) => b.toString("base64url");

function sign(payload: string, secret: string): string {
  return b64u(createHmac("sha256", secret).update(payload).digest());
}

/** Mint a preview token (call from trusted server code only). `ttlSeconds` defaults to 15 minutes. */
export function signPreviewToken(pageId: string, ttlSeconds = 900, secret = cmsEnv.previewSecret): string {
  if (!secret) throw new Error("CMS_PREVIEW_SECRET is not configured");
  const payload = b64u(Buffer.from(JSON.stringify({ p: pageId, e: Math.floor(Date.now() / 1000) + ttlSeconds })));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyPreviewToken(token: string, pageId: string, secret = cmsEnv.previewSecret): boolean {
  if (!secret || token.length > 1024) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { p?: string; e?: number };
    return data.p === pageId && typeof data.e === "number" && data.e > Date.now() / 1000;
  } catch {
    return false;
  }
}

/**
 * ▶ INTEGRATION HOOK — preview access is granted to:
 *   1. a signed-in admin (session cookie, 2FA enrolled) holding `pages.view` — the normal path from the Page Builder, or
 *   2. a short-lived HMAC token minted with signPreviewToken() (shareable review link; needs CMS_PREVIEW_SECRET).
 * Query parameters alone never grant access.
 */
export async function authorizePreview(req: PreviewRequest): Promise<PreviewAuthResult> {
  try {
    const { requirePermission } = await import("@/lib/rbac/permissions");
    const auth = await requirePermission("pages.view");
    if (!auth.error) return { ok: true, credential: "admin-session" };
  } catch {
    /* no request context / database unavailable → fall through to token check */
  }
  if (req.token && verifyPreviewToken(req.token, req.pageId)) return { ok: true, credential: req.token };
  return { ok: false };
}
