import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { requirePermission } from "@/lib/rbac/permissions";
import { prisma } from "@/lib/db/prisma";
import { decrypt } from "@/lib/auth/crypto";
import { verifyTotp } from "@/lib/auth/totp";
import { ok, fail } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { audit } from "@/lib/server/audit";

export async function POST(request: Request) {
  const auth = await requirePermission(null, { request, allowWithout2fa: true });
  if (auth.error) return auth.error;
  const userId = auth.session.userId;
  if (!rateLimit(`2fa-confirm:${userId}`, 8, 10 * 60_000)) return fail("RATE_LIMITED", "Too many attempts", 429);
  const p = z.object({ code: z.string().regex(/^\d{6}$/) }).safeParse(await request.json().catch(() => null));
  if (!p.success) return fail("VALIDATION_ERROR", "Invalid code");
  const c = await prisma.twoFactorCredential.findUnique({ where: { userId } });
  if (!c || c.enabledAt) return fail("CONFLICT", "No pending two-factor enrolment", 409);
  if (!verifyTotp(decrypt(c.encryptedSecret), p.data.code)) return fail("INVALID_CODE", "Invalid code", 400);
  const codes = Array.from({ length: 10 }, () => crypto.randomBytes(5).toString("hex"));
  await prisma.$transaction([
    prisma.twoFactorCredential.update({ where: { userId }, data: { enabledAt: new Date() } }),
    prisma.recoveryCode.deleteMany({ where: { userId } }),
    prisma.recoveryCode.createMany({ data: await Promise.all(codes.map(async (code) => ({ userId, codeHash: await bcrypt.hash(code, 12) }))) }),
  ]);
  await audit({ actorId: userId, action: "auth.2fa_enabled", entity: "User", entityId: userId });
  return ok({ recoveryCodes: codes });
}
