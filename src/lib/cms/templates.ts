import { Prisma, type TemplateCategory } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";
import { SLUG_RE, loadPage, snapshotPage, validateWorkingCopy, workingCopy } from "./working-copy";

const json = (v: unknown) => v as Prisma.InputJsonValue;
export const RESERVED_FIRST_SEGMENTS = ["admin", "api", "_next", "preview", "uploads", "images"];
export const CATEGORIES = ["BLANK", "SERVICE", "LANDING_PAGE", "PORTFOLIO", "LOCATION", "CAMPAIGN", "ABOUT", "CONTACT", "CUSTOM"] as const;

export const sectionSchema = z.object({
  type: z.string().min(1).max(60), enabled: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()), style: z.record(z.string(), z.unknown()).nullish(),
});
export const definitionSchema = z.object({
  pageType: z.string().max(50).optional(),
  seo: z.object({ title: z.string().max(200).optional(), description: z.string().max(500).optional(), robots: z.string().max(100).optional() }).optional(),
  sections: z.array(sectionSchema).max(80),
});
export type TemplateDefinition = z.infer<typeof definitionSchema>;

export const templateSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes").max(80);
export const createTemplateSchema = z.object({
  name: z.string().trim().min(1).max(120), slug: templateSlug.optional(), description: z.string().max(500).optional(),
  category: z.enum(CATEGORIES).default("CUSTOM"), definition: definitionSchema.optional(), fromPageId: z.string().optional(),
}).refine((v) => v.definition || v.fromPageId, { message: "Provide a definition or a fromPageId" });
export const updateTemplateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(), description: z.string().max(500).nullish(),
  category: z.enum(CATEGORIES).optional(), definition: definitionSchema.optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "template";

export function checkPageSlug(slug: string) {
  if (!SLUG_RE.test(slug) || slug.includes("//")) throw new HttpError(400, "VALIDATION_ERROR", "Slug must start with '/' and use lowercase letters, numbers and dashes");
  if (RESERVED_FIRST_SEGMENTS.includes(slug.split("/")[1])) throw new HttpError(400, "VALIDATION_ERROR", "That slug is reserved by the application");
}

export const listTemplates = (actor: Actor) => { assertCan(actor, "templates.view"); return prisma.pageTemplate.findMany({ orderBy: [{ isSystem: "desc" }, { name: "asc" }] }); };

export async function getTemplate(actor: Actor, id: string) {
  assertCan(actor, "templates.view");
  const t = await prisma.pageTemplate.findUnique({ where: { id } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Template not found");
  return t;
}

export async function createTemplate(actor: Actor, input: z.infer<typeof createTemplateSchema>) {
  assertCan(actor, "templates.manage");
  let definition = input.definition;
  if (!definition) {
    const w = workingCopy(await loadPage(prisma, input.fromPageId!));
    definition = { pageType: w.pageType, seo: { title: w.seo.title ?? undefined, description: w.seo.description ?? undefined }, sections: w.sections.map((s) => ({ type: s.type, enabled: s.enabled, content: s.content, style: s.style ?? null })) };
  }
  try {
    return await prisma.$transaction(async (tx) => {
      const t = await tx.pageTemplate.create({ data: { name: input.name, slug: input.slug ?? slugify(input.name), description: input.description, category: input.category as TemplateCategory, definition: json(definition), isSystem: false } });
      await auditTx(tx, { actorId: actor.id, action: "page_template.create", entity: "PageTemplate", entityId: t.id, metadata: { slug: t.slug } });
      return t;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A template with that slug already exists");
    throw e;
  }
}

function assertEditable(actor: Actor, t: { isSystem: boolean }, verb: string) {
  if (t.isSystem && !actor.isSuper) throw new HttpError(403, "SYSTEM_TEMPLATE", `System templates can only be ${verb} by a super administrator`);
}

export async function updateTemplate(actor: Actor, id: string, input: z.infer<typeof updateTemplateSchema>) {
  assertCan(actor, "templates.manage");
  const t = await prisma.pageTemplate.findUnique({ where: { id } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Template not found");
  assertEditable(actor, t, "edited");
  return prisma.$transaction(async (tx) => {
    const u = await tx.pageTemplate.update({ where: { id }, data: { name: input.name, description: input.description, category: input.category as TemplateCategory | undefined, definition: input.definition ? json(input.definition) : undefined } });
    await auditTx(tx, { actorId: actor.id, action: "page_template.update", entity: "PageTemplate", entityId: id, metadata: { fields: Object.keys(input) } });
    return u;
  });
}

export async function deleteTemplate(actor: Actor, id: string) {
  assertCan(actor, "templates.manage");
  const t = await prisma.pageTemplate.findUnique({ where: { id } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Template not found");
  assertEditable(actor, t, "deleted");
  await prisma.$transaction(async (tx) => {
    await tx.pageTemplate.delete({ where: { id } });
    await auditTx(tx, { actorId: actor.id, action: "page_template.delete", entity: "PageTemplate", entityId: id, metadata: { slug: t.slug, system: t.isSystem } });
  });
}

export const createPageSchema = z.object({ title: z.string().trim().min(1).max(200), slug: z.string().max(200), pageType: z.string().max(50).optional() });

/** Creates a DRAFT page from a template: sections are deep-cloned, the actor becomes the author, the action is audited. */
export async function createPageFromTemplate(actor: Actor, templateId: string, input: z.infer<typeof createPageSchema>) {
  assertCan(actor, "pages.create");
  assertCan(actor, "templates.view");
  checkPageSlug(input.slug);
  const t = await prisma.pageTemplate.findUnique({ where: { id: templateId } });
  if (!t) throw new HttpError(404, "NOT_FOUND", "Template not found");
  const def = definitionSchema.safeParse(t.definition);
  if (!def.success) throw new HttpError(422, "INVALID_TEMPLATE", "This template's definition is invalid");
  const d = structuredClone(def.data);
  const draftWc = { title: input.title, slug: input.slug, pageType: input.pageType ?? d.pageType, seo: {}, sections: d.sections.map((s, i) => ({ ...s, order: i, enabled: s.enabled ?? true, style: s.style ?? null })) };
  const problem = validateWorkingCopy({ ...draftWc, sections: draftWc.sections });
  if (problem) throw new HttpError(400, "VALIDATION_ERROR", problem);
  try {
    return await prisma.$transaction(async (tx) => {
      const page = await tx.page.create({
        data: {
          title: input.title, slug: input.slug, pageType: input.pageType ?? d.pageType ?? "STANDARD", status: "DRAFT", createdById: actor.id, updatedById: actor.id,
          sections: { create: draftWc.sections.map((s) => ({ type: s.type, order: s.order, enabled: s.enabled, content: json(s.content), style: s.style ? json(s.style) : Prisma.JsonNull })) },
          seo: { create: { title: d.seo?.title ?? null, description: d.seo?.description ?? null, robots: d.seo?.robots ?? null } },
        },
        include: { sections: { orderBy: { order: "asc" } }, seo: true },
      });
      await snapshotPage(tx, page.id, actor.id, `create from template: ${t.name}`);
      await auditTx(tx, { actorId: actor.id, action: "page.create_from_template", entity: "Page", entityId: page.id, metadata: { templateId: t.id, template: t.slug, slug: page.slug } });
      return page;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new HttpError(409, "CONFLICT", "A page with that slug already exists");
    throw e;
  }
}
