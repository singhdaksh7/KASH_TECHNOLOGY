import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { fail, requestIp } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { createSession, cookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { signPending } from "@/lib/auth/crypto";
import { audit } from "@/lib/server/audit";

const schema = z.object({ email: z.string().email().max(320), password: z.string().min(1).max(256) });
// Constant-cost dummy hash so unknown emails take as long as wrong passwords.
const DUMMY = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO5r9sP0vYb3qk3b6kq1bHnYk5Jw0m3pq";

export async function POST(request: Request) {
  const ip = requestIp(request);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000)) return fail("RATE_LIMITED", "Too many login attempts. Try again later.", 429);
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid credentials", 400);
  const email = parsed.data.email.toLowerCase();
  if (!rateLimit(`login-user:${email}`, 8, 15 * 60_000)) return fail("RATE_LIMITED", "Too many login attempts. Try again later.", 429);

  const user = await prisma.user.findUnique({ where: { email }, include: { twoFactor: true } });
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY);
  if (!user || !valid || user.status !== "ACTIVE" || user.deletedAt) {
    await audit({ actorId: user?.id, action: "auth.login_failed", entity: "User", entityId: user?.id, metadata: { reason: !user ? "unknown_user" : user.status !== "ACTIVE" ? "disabled" : "bad_password" } });
    return fail("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  if (user.twoFactor?.enabledAt) {
    // Password OK, second factor still required: issue only a signed, short-lived "pending" proof.
    const response = NextResponse.json({ success: true, data: { requiresTwoFactor: true } });
    response.cookies.set("kash_2fa_pending", signPending(user.id), { ...cookieOptions, maxAge: 300 });
    return response;
  }

  // No second factor enrolled yet: a session is issued but every admin API refuses to work
  // (TWO_FACTOR_SETUP_REQUIRED) until enrolment completes. See requirePermission().
  await prisma.session.deleteMany({ where: { userId: user.id } });
  const token = await createSession(user.id, request);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await audit({ actorId: user.id, action: "auth.login", entity: "User", entityId: user.id, metadata: { twoFactor: false } });
  const response = NextResponse.json({ success: true, data: { requiresTwoFactor: false, setupTwoFactor: true } });
  response.cookies.set(SESSION_COOKIE, token, cookieOptions);
  return response;
}
