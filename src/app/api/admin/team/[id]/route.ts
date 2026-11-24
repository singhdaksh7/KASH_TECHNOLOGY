import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { loadUser, ROLE_FROM_LABEL, ROLE_LABEL, toMember } from "@/lib/server/dto-team";

const patch = z.object({ role: z.string().optional(), status: z.enum(["Active", "Disabled"]).optional() });

export const PATCH = admin<{ id: string }>("users.manage", async ({ request, session, params }) => {
  const d = await body(request, patch);
  const target = await loadUser(params.id);
  const actorIsSuper = session.user.roles.some((r) => r.role.name === "SUPER_ADMIN");
  const targetIsSuper = target.roles.some((r) => r.role.name === "SUPER_ADMIN");
  if (targetIsSuper && !actorIsSuper) throw new HttpError(403, "FORBIDDEN", "Only a Super Admin can modify a Super Admin");
  const superCount = await prisma.userRole.count({ where: { role: { name: "SUPER_ADMIN" }, user: { status: "ACTIVE", deletedAt: null } } });

  if (d.role) {
    const roleName = ROLE_FROM_LABEL[d.role] ?? d.role;
    if (!(roleName in ROLE_LABEL)) throw new HttpError(400, "VALIDATION_ERROR", "Unknown role");
    if (roleName === "SUPER_ADMIN" && !actorIsSuper) throw new HttpError(403, "FORBIDDEN", "Only a Super Admin can grant Super Admin");
    if (targetIsSuper && roleName !== "SUPER_ADMIN" && superCount <= 1) throw new HttpError(409, "CONFLICT", "Cannot remove the last Super Admin");
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new HttpError(400, "VALIDATION_ERROR", "Role is not provisioned");
    await prisma.$transaction([prisma.userRole.deleteMany({ where: { userId: target.id } }), prisma.userRole.create({ data: { userId: target.id, roleId: role.id } })]);
    await audit({ actorId: session.userId, action: "role.change", entity: "User", entityId: target.id, metadata: { to: roleName } });
  }
  if (d.status) {
    if (target.id === session.userId && d.status === "Disabled") throw new HttpError(409, "CONFLICT", "You cannot disable your own account");
    if (targetIsSuper && d.status === "Disabled" && superCount <= 1) throw new HttpError(409, "CONFLICT", "Cannot disable the last Super Admin");
    await prisma.user.update({ where: { id: target.id }, data: { status: d.status === "Disabled" ? "DISABLED" : "ACTIVE" } });
    if (d.status === "Disabled") await prisma.session.deleteMany({ where: { userId: target.id } });
    await audit({ actorId: session.userId, action: "team.status_change", entity: "User", entityId: target.id, metadata: { status: d.status } });
  }
  return ok(toMember(await loadUser(target.id)));
});
