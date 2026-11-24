import { headers } from "next/headers";
import { currentSession } from "@/lib/auth/session";
import { fail } from "@/lib/server/http";

/**
 * Server-side authorization. Every admin API calls this; the UI's permission checks are advisory only.
 *  - session must be valid (cookie → DB session, active user)
 *  - second factor must be enrolled (ADMIN_REQUIRE_2FA !== "false"), except for `allowWithout2fa` endpoints
 *  - mutating requests must be same-origin (CSRF defence in depth on top of SameSite=Lax)
 *  - SUPER_ADMIN passes every permission check
 */
export const requires2fa = () => process.env.ADMIN_REQUIRE_2FA !== "false";

export async function sameOrigin(request?: Request): Promise<boolean> {
  if (!request || ["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients: cookie auth + SameSite still apply
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function requirePermission(permission: string | null, opts: { request?: Request; allowWithout2fa?: boolean } = {}) {
  const session = await currentSession();
  if (!session) return { error: fail("UNAUTHENTICATED", "Authentication required", 401) };
  if (!(await sameOrigin(opts.request))) return { error: fail("CSRF", "Cross-origin request rejected", 403) };
  if (!opts.allowWithout2fa && requires2fa() && !session.user.twoFactor?.enabledAt) {
    return { error: fail("TWO_FACTOR_SETUP_REQUIRED", "Set up two-factor authentication to continue", 403) };
  }
  if (permission) {
    const roles = session.user.roles.map((x) => x.role);
    const allowed = roles.some((r) => r.name === "SUPER_ADMIN" || r.permissions.some((x) => x.permission.key === permission));
    if (!allowed) return { error: fail("FORBIDDEN", "Insufficient permission", 403) };
  }
  return { session };
}

export const userPermissions = (session: NonNullable<Awaited<ReturnType<typeof currentSession>>>) =>
  [...new Set(session.user.roles.flatMap((x) => x.role.permissions.map((p) => p.permission.key)))];
