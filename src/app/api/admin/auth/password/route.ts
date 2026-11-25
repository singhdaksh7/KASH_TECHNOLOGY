import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/rbac/permissions";
import { fail, ok } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { audit } from "@/lib/server/audit";
import { cookies } from "next/headers";
import { sha256 } from "@/lib/auth/crypto";
import { SESSION_COOKIE, cookieOptions, createSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

const schema = z.object({ currentPassword: z.string().min(1).max(256), newPassword: z.string().min(12, "Use at least 12 characters").max(256) });

/** Change own password (re-authenticates with the current one, revokes every other session). */
export async function POST(request: Request) {
  const auth = await requirePermission(null, { request, allowWithout2fa: true, allowPasswordChangePending: true });
  if (auth.error) return auth.error;
  const userId = auth.session.userId;
  if (!rateLimit(`pw:${userId}`, 6, 15 * 60_000)) return fail("RATE_LIMITED", "Too many attempts", 429);
  const p = schema.safeParse(await request.json().catch(() => null));
  if (!p.success) return fail("VALIDATION_ERROR", p.error.issues[0]?.message ?? "Invalid request");
  if (!(await bcrypt.compare(p.data.currentPassword, auth.session.user.passwordHash))) return fail("REAUTH_REQUIRED", "Current password is incorrect", 401);
  if (p.data.currentPassword === p.data.newPassword) return fail("VALIDATION_ERROR", "Choose a different password");
  const wasForced = auth.session.user.mustChangePassword;
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(p.data.newPassword, 12), mustChangePassword: false } });
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (wasForced) {
    // Forced change: rotate. Every session (incl. the one that carried the temporary password) is destroyed and a fresh one issued.
    await prisma.session.deleteMany({ where: { userId } });
    const token = await createSession(userId, request);
    await audit({ actorId: userId, action: "auth.password_changed", entity: "User", entityId: userId, metadata: { forced: true } });
    const response = NextResponse.json({ success: true, data: { changed: true, twoFactorEnabled: !!auth.session.user.twoFactor?.enabledAt } });
    response.cookies.set(SESSION_COOKIE, token, cookieOptions);
    return response;
  }
  await prisma.session.deleteMany({ where: { userId, ...(raw ? { NOT: { tokenHash: sha256(raw) } } : {}) } });
  await audit({ actorId: userId, action: "auth.password_changed", entity: "User", entityId: userId, metadata: { forced: false } });
  return ok({ changed: true });
}
