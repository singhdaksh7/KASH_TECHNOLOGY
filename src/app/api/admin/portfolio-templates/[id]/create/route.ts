import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { createProjectFromTemplate, createProjectSchema } from "@/lib/cms/portfolio-templates";
export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await createProjectFromTemplate(actorFromSession(session), params.id, await body(request, createProjectSchema)), 201));
