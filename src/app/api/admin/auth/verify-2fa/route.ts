import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { decrypt, verifyPending } from "@/lib/auth/crypto";
import { verifyTotp } from "@/lib/auth/totp";
import { createSession, cookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { fail, requestIp } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { audit } from "@/lib/server/audit";

export async function POST(request: Request) {
  const body = z.object({ code: z.string().regex(/^\d{6}$/) }).safeParse(await request.json().catch(() => null));
  const userId = verifyPending((await cookies()).get("kash_2fa_pending")?.value);
  if (!body.success || !userId) return fail("UNAUTHENTICATED", "Login has expired. Sign in again.", 401);
  if (!rateLimit(`2fa:${userId}`, 6, 10 * 60_000) || !rateLimit(`2fa-ip:${requestIp(request)}`, 20, 10 * 60_000)) {
    return fail("RATE_LIMITED", "Too many attempts. Sign in again later.", 429);
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { twoFactor: true } });
  const credential = user?.twoFactor;
  if (!user || user.status !== "ACTIVE" || user.deletedAt || !credential?.enabledAt || !verifyTotp(decrypt(credential.encryptedSecret), body.data.code)) {
    await audit({ actorId: userId, action: "auth.2fa_failed", entity: "User", entityId: userId });
    return fail("INVALID_CODE", "Invalid authenticator code", 401);
  }
  await prisma.session.deleteMany({ where: { userId } });
  const token = await createSession(userId, request);
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  await audit({ actorId: userId, action: "auth.login", entity: "User", entityId: userId, metadata: { twoFactor: true } });
  const response = NextResponse.json({ success: true, data: { authenticated: true } });
  response.cookies.set(SESSION_COOKIE, token, cookieOptions);
  response.cookies.set("kash_2fa_pending", "", { ...cookieOptions, maxAge: 0 });
  return response;
}
