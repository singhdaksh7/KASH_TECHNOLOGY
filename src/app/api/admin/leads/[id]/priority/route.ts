import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as l from "@/lib/crm/leads";
const schema = z.object({ priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(), estimatedValue: z.number().min(0).max(1e9).nullable().optional(), tags: z.array(z.string().max(40)).max(20).optional() });
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await l.updateLeadMeta(actorFromSession(session), params.id, await body(request, schema))));
