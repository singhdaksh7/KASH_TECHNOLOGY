import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as svc from "@/lib/cms/global-blocks";
export const GET = admin<{ id: string }>(null, async ({ session, params }) => ok((await svc.getBlock(actorFromSession(session), params.id)).usage));
