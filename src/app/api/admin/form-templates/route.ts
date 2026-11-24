import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { listFormTemplates } from "@/lib/forms/admin";
export const GET = admin(null, async ({ session }) => ok(await listFormTemplates(actorFromSession(session))));
