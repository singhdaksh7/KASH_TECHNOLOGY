import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { pageInclude, snapshotPage } from "@/lib/cms/pages";
import { toAdminPage } from "@/lib/server/dto-pages";

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:[a-z0-9/-]*[a-z0-9])?$/, "Use lowercase letters, numbers, dashes and slashes"),
});

export const GET = admin("pages.view", async () => {
  const pages = await prisma.page.findMany({ where: { deletedAt: null }, include: pageInclude, orderBy: { updatedAt: "desc" } });
  return ok(pages.map(toAdminPage));
});

export const POST = admin("pages.create", async ({ request, session }) => {
  const data = await body(request, createSchema);
  const slug = `/${data.slug}`;
  if (await prisma.page.findUnique({ where: { slug } })) throw new HttpError(409, "CONFLICT", "A page with that slug already exists");
  const page = await prisma.page.create({
    data: {
      title: data.title, slug, status: "DRAFT", createdById: session.userId, updatedById: session.userId,
      draft: { title: data.title, slug, seo: { title: data.title }, sections: [] },
    },
    include: pageInclude,
  });
  await snapshotPage(page.id, session.userId, "create");
  await audit({ actorId: session.userId, action: "page.create", entity: "Page", entityId: page.id, metadata: { slug } });
  return ok(toAdminPage(page), 201);
});
