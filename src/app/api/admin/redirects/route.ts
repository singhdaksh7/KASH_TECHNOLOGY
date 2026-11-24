import { prisma } from "@/lib/db/prisma";
import { admin, body, HttpError, refreshPublicSite } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { audit } from "@/lib/server/audit";
import { refreshRedirectCache, validateRedirect } from "@/lib/server/redirects";
import { assertNoLoop, redirectSchema } from "@/lib/server/redirect-admin";

export const GET = admin("seo.view", async () => ok(await prisma.redirect.findMany({ orderBy: { sourcePath: "asc" } })));

export const POST = admin("seo.edit", async ({ request, session }) => {
  const d = await body(request, redirectSchema);
  let v;
  try { v = validateRedirect(d.sourcePath, d.destination); } catch (e) { throw new HttpError(400, "VALIDATION_ERROR", e instanceof Error ? e.message : "Invalid redirect"); }
  await assertNoLoop(v.sourcePath, v.destination);
  const row = await prisma.redirect.create({ data: { ...d, sourcePath: v.sourcePath, destination: v.destination } });
  await audit({ actorId: session.userId, action: "redirect.create", entity: "Redirect", entityId: row.id });
  refreshRedirectCache();
  refreshPublicSite();
  return ok(row, 201);
});
