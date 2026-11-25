import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { emailSettingsSchema, saveSettings, viewSettings } from "@/lib/email/settings-admin";
export const GET = admin(null, async ({ session }) => ok(await viewSettings(actorFromSession(session))));
export const PUT = admin(null, async ({ request, session }) => ok(await saveSettings(actorFromSession(session), await body(request, emailSettingsSchema))));
