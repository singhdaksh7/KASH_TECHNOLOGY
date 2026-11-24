import { cookies } from "next/headers";
import { destroySession, currentSession, SESSION_COOKIE, cookieOptions } from "@/lib/auth/session";
import { ok, fail } from "@/lib/server/http";
import { sameOrigin } from "@/lib/rbac/permissions";
import { audit } from "@/lib/server/audit";

export async function POST(request: Request) {
  if (!(await sameOrigin(request))) return fail("CSRF", "Cross-origin request rejected", 403);
  const session = await currentSession();
  await destroySession();
  (await cookies()).set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  if (session) await audit({ actorId: session.userId, action: "auth.logout", entity: "User", entityId: session.userId });
  return ok({ loggedOut: true });
}
