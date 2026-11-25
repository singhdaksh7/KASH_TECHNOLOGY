import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { retryDelivery } from "@/lib/email/lead-mail";
export const POST = admin<{ id: string }>(null, async ({ session, params }) => ok(await retryDelivery(actorFromSession(session), params.id)));
