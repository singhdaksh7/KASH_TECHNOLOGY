import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { pageInclude, workingCopy } from "@/lib/cms/pages";
import { toAdminPage, toAdminPageDetail, workingFromAdmin } from "@/lib/server/dto-pages";
import { resetToDraftAfterEdit } from "@/lib/cms/page-workflow";

const sectionSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.string().min(1).max(60),
  order: z.number().int(),
  enabled: z.boolean(),
  content: z.record(z.string(), z.unknown()),
  style: z.record(z.string(), z.unknown()).optional(),
});
const seoSchema = z.object({
  title: z.string().max(300), metaDescription: z.string().max(500), slug: z.string().max(200), canonicalUrl: z.string().max(2048),
  focusKeyword: z.string().max(200), secondaryKeywords: z.string().max(500), ogTitle: z.string().max(300), ogDescription: z.string().max(500),
  ogImage: z.string().max(2048), twitterImage: z.string().max(2048).optional(), index: z.boolean(), follow: z.boolean(),
});
const saveSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().regex(/^\/[a-z0-9/-]*$/),
  sections: z.array(sectionSchema).max(80),
  seo: seoSchema.partial().optional(),
});

const load = async (id: string) => {
  const p = await prisma.page.findFirst({ where: { id, deletedAt: null }, include: pageInclude });
  if (!p) throw new HttpError(404, "NOT_FOUND", "Page not found");
  return p;
};

export const GET = admin<{ id: string }>("pages.view", async ({ params }) => ok(await toAdminPageDetail(await load(params.id))));

/** Save Draft: stores the working copy; live (public) content is untouched until Publish. */
export const PUT = admin<{ id: string }>("pages.edit", async ({ request, session, params }) => {
  const data = await body(request, saveSchema);
  const existing = await load(params.id);
  const before = workingCopy(existing);
  const conflict = await prisma.page.findFirst({ where: { slug: data.slug, id: { not: existing.id }, deletedAt: null }, select: { id: true } });
  if (conflict) throw new HttpError(409, "CONFLICT", "Another page already uses that slug");
  const w = workingFromAdmin({ ...toAdminPage(existing), ...data, seo: { ...toAdminPage(existing).seo, ...(data.seo ?? {}) } } as never, existing.pageType);
  w.pageType = existing.pageType;
  // Materially changed content sends review/approved/scheduled pages back to DRAFT (audited); an unchanged save changes nothing.
  const strip = (x: typeof w) => JSON.stringify({ ...x, sections: x.sections.map((sec) => ({ type: sec.type, order: sec.order, enabled: sec.enabled, content: sec.content, style: sec.style ?? null, globalBlockId: sec.globalBlockId ?? null })) });
  const changed = strip(before) !== strip(w);
  const saved = await prisma.$transaction(async (tx) => {
    await tx.page.update({ where: { id: existing.id }, data: { draft: w as unknown as Prisma.InputJsonValue, updatedById: session.userId } });
    if (changed) await resetToDraftAfterEdit(tx, existing.id, session.userId, "content edited");
    return tx.page.findUniqueOrThrow({ where: { id: existing.id }, include: pageInclude });
  });
  const seoChanged = JSON.stringify(before.seo) !== JSON.stringify(w.seo);
  await audit({ actorId: session.userId, action: "page.edit", entity: "Page", entityId: existing.id, metadata: { sections: w.sections.length } });
  if (seoChanged) await audit({ actorId: session.userId, action: "seo.edit", entity: "Page", entityId: existing.id });
  return ok(await toAdminPageDetail(saved));
});

export const DELETE = admin<{ id: string }>("pages.delete", async ({ session, params }) => {
  const p = await load(params.id);
  await prisma.page.update({ where: { id: p.id }, data: { deletedAt: new Date(), status: "DRAFT", slug: `${p.slug}~deleted~${Date.now()}` } });
  await audit({ actorId: session.userId, action: "page.delete", entity: "Page", entityId: p.id });
  refreshPublicSite();
  return ok({ deleted: true });
});
