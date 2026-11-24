import { createHmac, timingSafeEqual } from "node:crypto";
import { cmsEnv } from "./env";

/**
 * Preview integration hook.
 *
 * `/preview?page=<id>&token=<signed>` renders a DRAFT page with noindex and a
 * banner. This file deliberately does not implement admin authentication.
 * `authorizePreview` is the single choke point: by default it accepts only a
 * short-lived HMAC token signed with CMS_PREVIEW_SECRET (mint one with
 * `signPreviewToken` from the admin backend). To use real admin sessions,
 * replace the body of `authorizePreview` (e.g. read the session cookie via
 * `cookies()` and return `{ ok: true, credential: <service credential> }`).
 * If CMS_PREVIEW_SECRET is unset and the hook is untouched, preview is DENIED.
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

/** ▶ INTEGRATION HOOK — replace/extend to enforce admin authentication. */
export async function authorizePreview(req: PreviewRequest): Promise<PreviewAuthResult> {
  if (req.token && verifyPreviewToken(req.token, req.pageId)) return { ok: true, credential: req.token };
  return { ok: false };
}
