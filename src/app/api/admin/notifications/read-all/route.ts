import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { markAllNotificationsRead } from "@/lib/notifications";
import { assertCan } from "@/lib/rbac/actor";
export const POST = admin(null, async ({ session }) => { assertCan(actorFromSession(session), "notifications.view"); return ok({ updated: await markAllNotificationsRead(session.userId), unreadCount: 0 }); });
