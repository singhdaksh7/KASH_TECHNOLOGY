import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/global-blocks";
const schema = z.object({ pageId: z.string().optional(), sectionId: z.string().optional() });
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await svc.detachBlock(actorFromSession(session), params.id, await body(request, schema.default({})))));
