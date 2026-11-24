import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/global-blocks";
const schema = z.object({ pageId: z.string().min(1), position: z.number().int().min(0).optional() });
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => { const d = await body(request, schema); return ok(await svc.linkBlockToPage(actorFromSession(session), params.id, d.pageId, d.position), 201); });
