import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as f from "@/lib/forms/admin";
import { formUpdateSchema } from "@/lib/forms/config";
export const GET = admin<{ id: string }>(null, async ({ session, params }) => ok(await f.getForm(actorFromSession(session), params.id)));
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await f.updateForm(actorFromSession(session), params.id, await body(request, formUpdateSchema))));
export const DELETE = admin<{ id: string }>(null, async ({ session, params }) => { await f.deleteForm(actorFromSession(session), params.id); return ok({ deleted: true }); });
