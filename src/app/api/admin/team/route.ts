import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { ROLE_FROM_LABEL, ROLE_LABEL, toMember, userInclude } from "@/lib/server/dto-team";

export const GET = admin("users.view", async () => {
  const users = await prisma.user.findMany({ where: { deletedAt: null }, include: userInclude, orderBy: { createdAt: "asc" } });
  return ok(users.map(toMember));
});

const invite = z.object({ name: z.string().trim().min(1).max(120), email: z.string().email().max(320), role: z.string() });

/** Creates a member with a random temporary password (shown ONCE). They must enrol 2FA at first sign-in. */
export const POST = admin("users.manage", async ({ request, session }) => {
  const d = await body(request, invite);
  const roleName = ROLE_FROM_LABEL[d.role] ?? d.role;
  if (!(roleName in ROLE_LABEL)) throw new HttpError(400, "VALIDATION_ERROR", "Unknown role");
  const isSuper = session.user.roles.some((r) => r.role.name === "SUPER_ADMIN");
  if (roleName === "SUPER_ADMIN" && !isSuper) throw new HttpError(403, "FORBIDDEN", "Only a Super Admin can create a Super Admin");
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) throw new HttpError(400, "VALIDATION_ERROR", "Role is not provisioned");
  const email = d.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) throw new HttpError(409, "CONFLICT", "A user with that email already exists");
  const temporaryPassword = crypto.randomBytes(12).toString("base64url");
  const user = await prisma.user.create({
    data: { email, name: d.name, passwordHash: await bcrypt.hash(temporaryPassword, 12), status: "ACTIVE", roles: { create: { roleId: role.id } } },
    include: userInclude,
  });
  await audit({ actorId: session.userId, action: "team.invite", entity: "User", entityId: user.id, metadata: { role: roleName } });
  return ok({ ...toMember(user), temporaryPassword }, 201);
});
