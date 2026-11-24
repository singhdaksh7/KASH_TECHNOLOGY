import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { previewEmailTemplate } from "@/lib/email/template-admin";
const schema = z.object({ variables: z.record(z.string(), z.string().max(1000)).optional(), subject: z.string().max(300).optional(), body: z.string().max(20000).optional() });
export const POST = admin<{ key: string }>(null, async ({ request, session, params }) => { const d = await body(request, schema); return ok(await previewEmailTemplate(actorFromSession(session), params.key, d.variables, { subject: d.subject, body: d.body })); });
