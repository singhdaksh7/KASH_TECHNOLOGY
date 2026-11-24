import { currentSession } from "@/lib/auth/session";
import { userPermissions, requires2fa } from "@/lib/rbac/permissions";
import { ok, fail } from "@/lib/server/http";

export async function GET() {
  const session = await currentSession();
  if (!session) return fail("UNAUTHENTICATED", "Authentication required", 401);
  const u = session.user;
  return ok({
    user: { id: u.id, email: u.email, name: u.name, roles: u.roles.map((x) => x.role.name), permissions: userPermissions(session) },
    twoFactorEnabled: !!u.twoFactor?.enabledAt,
    twoFactorRequired: requires2fa(),
    expiresAt: session.expiresAt,
  });
}
