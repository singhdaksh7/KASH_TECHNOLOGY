import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/templates";
export const GET = admin(null, async ({ session }) => ok(await svc.listTemplates(actorFromSession(session))));
export const POST = admin(null, async ({ request, session }) => ok(await svc.createTemplate(actorFromSession(session), await body(request, svc.createTemplateSchema)), 201));
