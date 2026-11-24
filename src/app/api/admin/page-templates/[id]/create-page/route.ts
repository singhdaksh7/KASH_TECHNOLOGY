import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/templates";
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await svc.createPageFromTemplate(actorFromSession(session), params.id, await body(request, svc.createPageSchema)), 201));
