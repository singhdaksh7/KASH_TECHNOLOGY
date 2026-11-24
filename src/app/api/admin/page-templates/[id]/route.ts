import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/templates";
export const GET = admin<{ id: string }>(null, async ({ session, params }) => ok(await svc.getTemplate(actorFromSession(session), params.id)));
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await svc.updateTemplate(actorFromSession(session), params.id, await body(request, svc.updateTemplateSchema))));
export const DELETE = admin<{ id: string }>(null, async ({ session, params }) => { await svc.deleteTemplate(actorFromSession(session), params.id); return ok({ deleted: true }); });
