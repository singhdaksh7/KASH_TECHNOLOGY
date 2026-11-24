import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyPending } from "@/lib/auth/crypto";
import { createSession, cookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { fail, requestIp } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { audit } from "@/lib/server/audit";

/** Recovery code replaces the authenticator code, NOT the password: requires the signed password-step proof. */
export async function POST(request: Request) {
  const body = z.object({ code: z.string().min(8).max(32) }).safeParse(await request.json().catch(() => null));
  const userId = verifyPending((await cookies()).get("kash_2fa_pending")?.value);
  if (!body.success || !userId) return fail("UNAUTHENTICATED", "Login has expired. Sign in again.", 401);
  if (!rateLimit(`recovery:${userId}`, 5, 15 * 60_000) || !rateLimit(`recovery-ip:${requestIp(request)}`, 15, 15 * 60_000)) {
    return fail("RATE_LIMITED", "Too many attempts. Try again later.", 429);
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { recoveryCodes: true } });
  if (!user || user.status !== "ACTIVE" || user.deletedAt) return fail("UNAUTHENTICATED", "Login has expired.", 401);
  let matchId: string | null = null;
  for (const rc of user.recoveryCodes.filter((x) => !x.usedAt)) {
    if (await bcrypt.compare(body.data.code.trim().toLowerCase(), rc.codeHash)) matchId = rc.id;
  }
  if (!matchId) {
    await audit({ actorId: userId, action: "auth.recovery_failed", entity: "User", entityId: userId });
    return fail("INVALID_CODE", "Invalid recovery code", 401);
  }
  await prisma.recoveryCode.update({ where: { id: matchId }, data: { usedAt: new Date() } });
  await prisma.session.deleteMany({ where: { userId } });
  const token = await createSession(userId, request);
  await audit({ actorId: userId, action: "auth.recovery_used", entity: "User", entityId: userId });
  const r = NextResponse.json({ success: true, data: { authenticated: true } });
  r.cookies.set(SESSION_COOKIE, token, cookieOptions);
  r.cookies.set("kash_2fa_pending", "", { ...cookieOptions, maxAge: 0 });
  return r;
}
