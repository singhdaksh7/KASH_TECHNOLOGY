import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
import { flag } from "@/lib/server/query";
export const PATCH = admin<{ id: string }>(null, async ({ request, session, params }) => ok(await m.updateFolder(actorFromSession(session), params.id, await body(request, m.updateFolderSchema))));
export const DELETE = admin<{ id: string }>(null, async ({ request, session, params }) => { await m.deleteFolder(actorFromSession(session), params.id, { moveContentsToParent: flag(new URL(request.url).searchParams, "moveContentsToParent") }); return ok({ deleted: true }); });
