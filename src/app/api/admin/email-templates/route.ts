import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { listEmailTemplates } from "@/lib/email/template-admin";
export const GET = admin(null, async ({ session }) => ok(await listEmailTemplates(actorFromSession(session))));
