import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as l from "@/lib/crm/leads";
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await l.addLeadNote(actorFromSession(session), params.id, (await body(request, z.object({ body: z.string().min(1).max(5000) }))).body), 201));
