import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { refreshRedirectCache, validateRedirect } from "@/lib/server/redirects";
import { assertNoLoop, redirectSchema } from "@/lib/server/redirect-admin";

export const PUT = admin<{ id: string }>("seo.edit", async ({ request, session, params }) => {
  const d = await body(request, redirectSchema);
  let v;
  try { v = validateRedirect(d.sourcePath, d.destination); } catch (e) { throw new HttpError(400, "VALIDATION_ERROR", e instanceof Error ? e.message : "Invalid redirect"); }
  if (d.active) await assertNoLoop(v.sourcePath, v.destination, params.id);
  const row = await prisma.redirect.update({ where: { id: params.id }, data: { ...d, sourcePath: v.sourcePath, destination: v.destination } });
  await audit({ actorId: session.userId, action: "redirect.update", entity: "Redirect", entityId: row.id });
  refreshRedirectCache();
  refreshPublicSite();
  return ok(row);
});

export const DELETE = admin<{ id: string }>("seo.edit", async ({ session, params }) => {
  await prisma.redirect.delete({ where: { id: params.id } });
  await audit({ actorId: session.userId, action: "redirect.delete", entity: "Redirect", entityId: params.id });
  refreshRedirectCache();
  refreshPublicSite();
  return ok({ deleted: true });
});
