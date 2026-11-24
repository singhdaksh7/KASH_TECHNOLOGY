import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { flag } from "@/lib/server/query";
export const GET = admin<{ id: string }>("media.view", async ({ session, params }) => {
  const asset = await prisma.mediaAsset.findFirst({ where: { id: params.id, deletedAt: null } });
  if (!asset) throw new HttpError(404, "NOT_FOUND", "Media asset not found");
  const usage = await m.getAssetUsage(actorFromSession(session), params.id);
  return ok({ ...asset, usage: { inUse: usage.inUse, total: usage.total } });
});
export const DELETE = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await m.deleteMediaAsset(actorFromSession(session), params.id, { force: flag(new URL(request.url).searchParams, "force") })));
