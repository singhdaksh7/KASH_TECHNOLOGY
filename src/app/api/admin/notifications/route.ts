import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { listNotifications } from "@/lib/notifications";
import { assertCan } from "@/lib/rbac/actor";
import { flag } from "@/lib/server/query";
export const GET = admin(null, async ({ request, session }) => {
  assertCan(actorFromSession(session), "notifications.view");
  const sp = new URL(request.url).searchParams;
  return ok(await listNotifications(session.userId, { unreadOnly: flag(sp, "unread"), limit: Number(sp.get("limit")) || undefined, cursor: sp.get("cursor") ?? undefined }));
});
