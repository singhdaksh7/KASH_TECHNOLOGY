import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import type { RoleItem } from "@/lib/admin-client/types";

export const GET = admin("users.view", async () => {
  const roles = await prisma.role.findMany({ include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } }, orderBy: { name: "asc" } });
  const out: RoleItem[] = roles.map((r) => ({ id: r.id, name: r.name, permissions: r.permissions.map((p) => p.permission.key).sort(), users: r._count.users }));
  return ok(out);
});
