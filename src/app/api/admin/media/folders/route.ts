import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import * as m from "@/lib/cms/media";
export const GET = admin(null, async ({ session }) => ok(await m.listFolders(actorFromSession(session))));
export const POST = admin(null, async ({ request, session }) => ok(await m.createFolder(actorFromSession(session), await body(request, m.createFolderSchema)), 201));
