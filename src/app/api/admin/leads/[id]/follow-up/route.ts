import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as l from "@/lib/crm/leads";
const schema = z.object({ nextFollowUpAt: z.coerce.date().nullable(), note: z.string().max(5000).optional() });
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => { const d = await body(request, schema); return ok(await l.setLeadFollowUp(actorFromSession(session), params.id, d.nextFollowUpAt, d.note)); });
