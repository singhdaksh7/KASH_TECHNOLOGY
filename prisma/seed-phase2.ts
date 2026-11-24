/**
 * Phase 2 seed. Fully idempotent and additive:
 *  - permissions are upserted, role grants are only ever ADDED (skipDuplicates), nothing is revoked;
 *  - built-in templates are created if missing and NEVER overwritten, so admin edits survive re-seeding.
 * Role grants apply to roles that already exist (SUPER_ADMIN is always handled).
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import { BUILTIN_FORM_TEMPLATES, BUILTIN_PAGE_TEMPLATES, BUILTIN_PORTFOLIO_TEMPLATES } from "../src/lib/cms/builtin-templates";
import { EMAIL_TEMPLATE_DEFS } from "../src/lib/email/template-defs";
import { PHASE2_PERMISSIONS, PHASE2_ROLE_GRANTS } from "../src/lib/rbac/phase2-permissions";

const json = (v: unknown) => v as Prisma.InputJsonValue;

export async function seedPhase2(prisma: PrismaClient) {
  for (const [key, description] of Object.entries(PHASE2_PERMISSIONS)) await prisma.permission.upsert({ where: { key }, update: {}, create: { key, description } });
  const perms = await prisma.permission.findMany({ where: { key: { in: Object.keys(PHASE2_PERMISSIONS) } } });
  const roles = await prisma.role.findMany({ where: { name: { in: Object.keys(PHASE2_ROLE_GRANTS) } } });
  for (const role of roles) {
    const grant = new Set(PHASE2_ROLE_GRANTS[role.name]);
    await prisma.rolePermission.createMany({ data: perms.filter((p) => grant.has(p.key)).map((p) => ({ roleId: role.id, permissionId: p.id })), skipDuplicates: true });
  }

  for (const t of BUILTIN_PAGE_TEMPLATES) await prisma.pageTemplate.upsert({ where: { slug: t.slug }, update: {}, create: { slug: t.slug, name: t.name, description: t.description, category: t.category, definition: json(t.definition), isSystem: true } });
  for (const t of BUILTIN_FORM_TEMPLATES) await prisma.formTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, definition: json(t.definition), isSystem: true } });
  for (const t of BUILTIN_PORTFOLIO_TEMPLATES) await prisma.portfolioTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, category: t.category, description: t.description, definition: json(t.definition), isSystem: true } });
  for (const t of EMAIL_TEMPLATE_DEFS) await prisma.emailTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, subject: t.subject, body: t.body, enabled: true } });
  console.log("Phase 2 permissions, role grants and built-in templates seeded.");
}
