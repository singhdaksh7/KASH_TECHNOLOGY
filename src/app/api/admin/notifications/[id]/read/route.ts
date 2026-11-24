import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { markNotificationRead } from "@/lib/notifications";
import { HttpError } from "@/lib/server/api";
import { assertCan } from "@/lib/rbac/actor";
export const POST = admin<{ id: string }>(null, async ({ session, params }) => {
  assertCan(actorFromSession(session), "notifications.view");
  if (!(await markNotificationRead(session.userId, params.id))) throw new HttpError(404, "NOT_FOUND", "Notification not found");
  return ok({ id: params.id, read: true });
});
