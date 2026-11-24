import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { admin, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { pageInclude, snapshotPage, workingCopy } from "@/lib/cms/pages";
import { toAdminPage } from "@/lib/server/dto-pages";

export const POST = admin<{ id: string }>("pages.create", async ({ session, params }) => {
  const src = await prisma.page.findFirst({ where: { id: params.id, deletedAt: null }, include: pageInclude });
  if (!src) throw new HttpError(404, "NOT_FOUND", "Page not found");
  const w = workingCopy(src);
  let slug = `${w.slug === "/" ? "/home" : w.slug}-copy`;
  for (let i = 2; await prisma.page.findUnique({ where: { slug } }); i++) slug = `${w.slug}-copy-${i}`;
  // Built-in (route-bound) blocks cannot be duplicated: the copy would render the same static page.
  const sections = w.sections.filter((s) => s.type !== "builtIn").map((s, i) => ({ ...s, id: `sec-${Date.now()}-${i}` }));
  const copy = { ...w, title: `${w.title} (Copy)`, slug, pageType: "STANDARD", sections, seo: { ...w.seo, canonicalUrl: null } };
  const page = await prisma.page.create({
    data: { title: copy.title, slug, pageType: "STANDARD", status: "DRAFT", createdById: session.userId, updatedById: session.userId, draft: copy as unknown as Prisma.InputJsonValue },
    include: pageInclude,
  });
  await snapshotPage(page.id, session.userId, "duplicate");
  await audit({ actorId: session.userId, action: "page.duplicate", entity: "Page", entityId: page.id, metadata: { from: src.id } });
  return ok(toAdminPage(page), 201);
});
