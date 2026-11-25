#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- standalone ops script run with plain node inside the container */
/**
 * Controlled administrative operation: inspect a CMS user, or reset their password to a TEMPORARY one
 * that must be changed at next login.
 *
 *   inspect:  USER_EMAIL=a@b.c MODE=inspect node force-password-reset.cjs
 *   reset:    USER_EMAIL=a@b.c MODE=reset  node force-password-reset.cjs   (temporary password read from STDIN)
 *
 * Run inside the web container (needs DATABASE_URL, bcryptjs, @prisma/client): NODE_PATH=/app/node_modules.
 * The password is never accepted as an argument, never printed, never stored in plaintext.
 * Prints no hashes, TOTP secrets, recovery codes or session tokens.
 */
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const email = (process.env.USER_EMAIL || "").trim().toLowerCase();
const mode = process.env.MODE || "inspect";

const readStdin = () => new Promise((res) => { let d = ""; process.stdin.setEncoding("utf8"); process.stdin.on("data", (c) => (d += c)); process.stdin.on("end", () => res(d.replace(/\r?\n$/, ""))); });

async function state() {
  const u = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } }, twoFactor: true, recoveryCodes: true, sessions: true },
  });
  if (!u) return null;
  return {
    id: u.id, roles: u.roles.map((r) => r.role.name), status: u.status, deleted: !!u.deletedAt,
    mustChangePassword: u.mustChangePassword, lastLoginAt: u.lastLoginAt,
    twoFactor: u.twoFactor ? (u.twoFactor.enabledAt ? "enabled" : "pending (not verified)") : "not enrolled",
    recoveryCodes: { total: u.recoveryCodes.length, unused: u.recoveryCodes.filter((c) => !c.usedAt).length },
    activeSessions: u.sessions.filter((s) => s.expiresAt > new Date()).length,
  };
}

(async () => {
  if (!email) throw new Error("USER_EMAIL required");
  console.log("BEFORE", JSON.stringify(await state()));
  if (mode === "reset") {
    const pw = await readStdin();
    if (!pw) throw new Error("temporary password required on stdin");
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u || u.deletedAt || u.status !== "ACTIVE") throw new Error("user not found or not active");
    const passwordHash = await bcrypt.hash(pw, 12);
    const [, del] = await prisma.$transaction([
      prisma.user.update({ where: { id: u.id }, data: { passwordHash, mustChangePassword: true } }),
      prisma.session.deleteMany({ where: { userId: u.id } }),
      // A half-finished (unverified) enrolment is discarded so the user starts 2FA setup clean; a verified one is kept.
      prisma.twoFactorCredential.deleteMany({ where: { userId: u.id, enabledAt: null } }),
      prisma.auditLog.create({ data: { actorId: null, action: "auth.password_reset_admin", entity: "User", entityId: u.id, metadata: { via: "secure_admin_operation", mustChangePassword: true } } }),
    ]);
    console.log(`RESET ok; sessions invalidated: ${del.count}`);
    console.log("AFTER", JSON.stringify(await state()));
  }
})().catch((e) => { console.error("ERROR", e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
