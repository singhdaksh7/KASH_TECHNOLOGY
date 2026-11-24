import bcrypt from "bcryptjs";
import { z } from "zod";
import { requirePermission } from "@/lib/rbac/permissions";
import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";

export async function POST(request: Request) {
  const auth = await requirePermission(null, { request, allowWithout2fa: true });
  if (auth.error) return auth.error;
  const p = z.object({ password: z.string().min(1) }).safeParse(await request.json().catch(() => null));
  if (!p.success) return fail("VALIDATION_ERROR", "Password required");
  if (!(await bcrypt.compare(p.data.password, auth.session.user.passwordHash))) return fail("REAUTH_REQUIRED", "Password verification failed", 401);
  const userId = auth.session.userId;
  await prisma.$transaction([prisma.twoFactorCredential.deleteMany({ where: { userId } }), prisma.recoveryCode.deleteMany({ where: { userId } })]);
  await audit({ actorId: userId, action: "auth.2fa_disabled", entity: "User", entityId: userId });
  return ok({ disabled: true });
}
