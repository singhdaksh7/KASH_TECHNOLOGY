import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import type { PortfolioTemplateDefinition } from "./builtin-templates";

const json = (v: unknown) => v as Prisma.InputJsonValue;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
export const createProjectSchema = z.object({ title: z.string().trim().min(1).max(200), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).optional() });

export const listPortfolioTemplates = (actor: Actor) => { assertCan(actor, "portfolio.view"); return prisma.portfolioTemplate.findMany({ orderBy: [{ isSystem: "desc" }, { name: "asc" }] }); };

/** Creates a DRAFT portfolio project from a template (content is deep-cloned; category is found or created). */
export async function createProjectFromTemplate(actor: Actor, templateId: string, input: z.infer<typeof createProjectSchema>) {
  assertCan(actor, "portfolio.edit");
  const t = await prisma.portfolioTemplate.findUnique({ where: { id: templateId } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Portfolio template not found");
  const def = structuredClone(t.definition) as unknown as PortfolioTemplateDefinition;
  let slug = input.slug ?? (slugify(input.title) || "project");
  if (!input.slug) { for (let n = 2; await prisma.portfolioProject.findUnique({ where: { slug }, select: { id: true } }); n++) slug = `${slugify(input.title) || "project"}-${n}`; }
  try {
    return await prisma.$transaction(async (tx) => {
      const catSlug = slugify(t.category);
      const category = await tx.portfolioCategory.upsert({ where: { slug: catSlug }, update: {}, create: { name: t.category, slug: catSlug } });
      const p = await tx.portfolioProject.create({ data: { title: input.title, slug, status: "DRAFT", summary: def.summary || null, content: json(def.content), categoryId: category.id } });
      await auditTx(tx, { actorId: actor.id, action: "portfolio.create_from_template", entity: "PortfolioProject", entityId: p.id, metadata: { template: t.key, slug } });
      return p;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A project with that slug already exists");
    throw e;
  }
}
