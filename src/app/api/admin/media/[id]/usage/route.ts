import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
export const GET = admin<{ id: string }>(null, async ({ session, params }) => ok(await m.getAssetUsage(actorFromSession(session), params.id)));
