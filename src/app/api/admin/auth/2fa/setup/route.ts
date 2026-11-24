import QRCode from "qrcode";
import { requirePermission } from "@/lib/rbac/permissions";
import { newTotp } from "@/lib/auth/totp";
import { encrypt } from "@/lib/auth/crypto";
import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";

/** Any signed-in user may enrol their OWN authenticator (needed before 2FA is enforced). */
export async function POST(request: Request) {
  const auth = await requirePermission(null, { request, allowWithout2fa: true });
  if (auth.error) return auth.error;
  const userId = auth.session.userId;
  if (auth.session.user.twoFactor?.enabledAt) return fail("CONFLICT", "Two-factor authentication is already enabled", 409);
  const totp = newTotp();
  totp.label = auth.session.user.email;
  await prisma.twoFactorCredential.upsert({
    where: { userId },
    update: { encryptedSecret: encrypt(totp.secret.base32), enabledAt: null },
    create: { userId, encryptedSecret: encrypt(totp.secret.base32) },
  });
  await audit({ actorId: userId, action: "auth.2fa_setup_started", entity: "User", entityId: userId });
  const uri = totp.toString();
  return ok({ provisioningUri: uri, qrDataUrl: await QRCode.toDataURL(uri), manualKey: totp.secret.base32 });
}
