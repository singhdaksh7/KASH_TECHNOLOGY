import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { adminSearch } from "@/lib/cms/search";
export const GET = admin(null, async ({ request, session }) => { const sp = new URL(request.url).searchParams; return ok(await adminSearch(actorFromSession(session), sp.get("q") ?? "", Number(sp.get("limit")) || 5)); });
