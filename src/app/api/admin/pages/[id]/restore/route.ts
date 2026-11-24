import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { pageInclude, restorePage } from "@/lib/cms/pages";
import { toAdminPage } from "@/lib/server/dto-pages";

/** Restores a version into live content and records a NEW version (history is never destroyed). */
export const POST = admin<{ id: string }>("pages.edit", async ({ request, session, params }) => {
  const { version } = await body(request, z.object({ version: z.number().int().positive() }));
  const exists = await prisma.pageVersion.findUnique({ where: { pageId_version: { pageId: params.id, version } }, select: { id: true } });
  if (!exists) throw new HttpError(404, "NOT_FOUND", "Version not found");
  try {
    await restorePage(params.id, version, session.userId);
  } catch (e) {
    throw new HttpError(400, "VALIDATION_ERROR", e instanceof Error ? e.message : "Could not restore version");
  }
  await audit({ actorId: session.userId, action: "page.restore", entity: "Page", entityId: params.id, metadata: { version } });
  refreshPublicSite();
  return ok(toAdminPage(await prisma.page.findUniqueOrThrow({ where: { id: params.id }, include: pageInclude })));
});
