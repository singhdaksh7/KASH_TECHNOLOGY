import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession, assertCan } from "@/lib/rbac/actor";

/**
 * Active team members who can be chosen as an assignee (leads, tasks). Lightweight on purpose: id, name, email, roles only —
 * available to anyone who can assign leads or work with tasks, without needing user-management permissions.
 */
export const GET = admin(null, async ({ session }) => {
  assertCan(actorFromSession(session), "leads.assign", "tasks.manage", "tasks.view", "leads.view");
  const users = await prisma.user.findMany({
    where: { deletedAt: null, status: "ACTIVE" }, orderBy: [{ name: "asc" }, { email: "asc" }],
    select: { id: true, name: true, email: true, roles: { select: { role: { select: { name: true } } } } },
  });
  return ok(users.map((u) => ({ id: u.id, name: u.name || u.email, email: u.email, roles: u.roles.map((r) => r.role.name) })));
});
