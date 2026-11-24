import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
const schema = z.object({ folderId: z.string().nullable() });
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await m.moveAsset(actorFromSession(session), params.id, (await body(request, schema)).folderId)));
