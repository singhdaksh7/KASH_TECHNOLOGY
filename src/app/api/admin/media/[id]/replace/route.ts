import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { replaceMediaEverywhere } from "@/lib/cms/media-replace";

const schema = z.object({
  targetAssetId: z.string().min(1),
});

export const POST = admin<{ id: string }>("media.edit", async ({ request, session, params }) => {
  const { targetAssetId } = await body(request, schema);
  const result = await replaceMediaEverywhere(actorFromSession(session), params.id, targetAssetId);
  return ok(result);
});
