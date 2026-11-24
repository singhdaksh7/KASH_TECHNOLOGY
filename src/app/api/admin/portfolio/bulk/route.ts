import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { bulkPortfolio, portfolioBulkSchema } from "@/lib/cms/bulk";
export const POST = admin(null, async ({ request, session }) => ok(await bulkPortfolio(actorFromSession(session), await body(request, portfolioBulkSchema))));
