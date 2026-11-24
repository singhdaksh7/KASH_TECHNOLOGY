import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { HttpError } from "@/lib/server/api";
import { toLeadDetail } from "@/lib/server/dto-leads";

/** One lead with notes, related tasks and the activity timeline. */
export const GET = admin<{ id: string }>("leads.view", async ({ params }) => {
  try { return ok(await toLeadDetail(params.id)); } catch { throw new HttpError(404, "NOT_FOUND", "Lead not found"); }
});
