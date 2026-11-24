import { z } from "zod";
import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { createFormFromTemplate } from "@/lib/forms/admin";
const schema = z.object({ name: z.string().trim().min(1).max(200).optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).optional() });
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await createFormFromTemplate(actorFromSession(session), params.id, await body(request, schema.default({}))), 201));
