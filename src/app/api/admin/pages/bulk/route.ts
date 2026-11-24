import { admin, body } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { bulkPages, pagesBulkSchema } from "@/lib/cms/bulk";
export const POST = admin(null, async ({ request, session }) => ok(await bulkPages(actorFromSession(session), await body(request, pagesBulkSchema))));
