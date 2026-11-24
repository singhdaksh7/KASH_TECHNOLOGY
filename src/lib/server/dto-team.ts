import { prisma } from "@/lib/db/prisma";
import type { TeamMember } from "@/lib/admin-client/types";

export const ROLE_LABEL: Record<string, TeamMember["role"]> = {
  SUPER_ADMIN: "Super Admin", ADMINISTRATOR: "Administrator", SEO_MANAGER: "SEO Manager",
  CONTENT_EDITOR: "Content Editor", MARKETING_MANAGER: "Marketing Manager", VIEWER: "Viewer",
};
export const ROLE_FROM_LABEL = Object.fromEntries(Object.entries(ROLE_LABEL).map(([k, v]) => [v, k])) as Record<string, string>;

export const userInclude = { roles: { include: { role: true } }, twoFactor: true } as const;
export function toMember(u: Awaited<ReturnType<typeof loadUser>>): TeamMember {
  return {
    id: u.id, name: u.name ?? u.email.split("@")[0], email: u.email,
    role: ROLE_LABEL[u.roles[0]?.role.name ?? "VIEWER"] ?? "Viewer",
    status: u.status === "DISABLED" ? "Disabled" : !u.lastLoginAt ? "Invited" : "Active",
    lastActive: u.lastLoginAt ? u.lastLoginAt.toISOString().replace("T", " ").slice(0, 16) : "Never",
    twoFactorEnabled: !!u.twoFactor?.enabledAt,
  };
}
export const loadUser = (id: string) => prisma.user.findFirstOrThrow({ where: { id, deletedAt: null }, include: userInclude });

