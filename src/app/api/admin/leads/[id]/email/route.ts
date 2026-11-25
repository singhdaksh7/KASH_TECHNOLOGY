import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { deliveriesForLead } from "@/lib/email/lead-mail";

/** Email outcomes for one lead (status only). Retrying needs email.retry, enforced by the retry endpoint. */
export const GET = admin<{ id: string }>("leads.view", async ({ params }) => ok(await deliveriesForLead(params.id)));
