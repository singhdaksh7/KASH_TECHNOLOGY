import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import * as l from "@/lib/crm/leads";
export const GET = admin<{ id: string }>("leads.view", async ({ params }) => ok(await l.getLeadDetail(params.id)));
