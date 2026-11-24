import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { getEmailTemplate, saveEmailTemplate, updateEmailTemplateSchema } from "@/lib/email/template-admin";
export const GET = admin<{ key: string }>(null, async ({ session, params }) => ok(await getEmailTemplate(actorFromSession(session), params.key)));
export const PATCH = admin<{ key: string }>(null, async ({ request, session, params }) => ok(await saveEmailTemplate(actorFromSession(session), params.key, await body(request, updateEmailTemplateSchema))));
