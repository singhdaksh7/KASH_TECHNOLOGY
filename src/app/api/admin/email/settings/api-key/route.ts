import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { apiKeySchema, removeApiKey, setApiKey } from "@/lib/email/settings-admin";
/** Write-only: the key goes in, only { configured, lastFour } ever comes out. */
export const PUT = admin(null, async ({ request, session }) => ok(await setApiKey(actorFromSession(session), await body(request, apiKeySchema))));
export const DELETE = admin(null, async ({ session }) => ok(await removeApiKey(actorFromSession(session))));
