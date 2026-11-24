import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as wf from "@/lib/cms/page-workflow";
const schema = z.object({ note: z.string().max(2000).optional() });
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await wf.approvePage(actorFromSession(session), params.id, (await body(request, schema.default({}))).note)));
