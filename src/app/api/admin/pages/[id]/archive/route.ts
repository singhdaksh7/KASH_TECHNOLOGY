import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as wf from "@/lib/cms/page-workflow";
export const POST = admin<{ id: string }>(null, async ({ session, params }) => ok(await wf.archivePage(actorFromSession(session), params.id)));
