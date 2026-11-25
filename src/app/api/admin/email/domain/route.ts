import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { domainInfo } from "@/lib/email/settings-admin";
export const GET = admin(null, async ({ session }) => ok(await domainInfo(actorFromSession(session))));
