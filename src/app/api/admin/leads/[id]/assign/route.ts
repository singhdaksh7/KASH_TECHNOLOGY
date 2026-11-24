import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as l from "@/lib/crm/leads";
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await l.assignLead(actorFromSession(session), params.id, (await body(request, z.object({ assignedToId: z.string().nullable() }))).assignedToId)));
