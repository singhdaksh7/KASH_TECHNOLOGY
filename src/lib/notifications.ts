import type { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface NotifyInput {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  link?: string;
  /** Same (user, dedupeKey) is only ever delivered once — retries and double-clicks cannot spam. */
  dedupeKey?: string;
}

/** Creates notifications. Duplicate (user, dedupeKey) pairs are skipped by the database. Returns the number created. */
export async function notifyUsers(input: NotifyInput, client: Prisma.TransactionClient | typeof prisma = prisma): Promise<number> {
  const userIds = [...new Set(input.userIds)];
  if (!userIds.length) return 0;
  const res = await client.notification.createMany({
    data: userIds.map((userId) => ({
      userId, type: input.type, title: input.title.slice(0, 200), message: input.message.slice(0, 1000),
      entityType: input.entityType, entityId: input.entityId, link: input.link, dedupeKey: input.dedupeKey,
    })),
    skipDuplicates: true,
  });
  return res.count;
}

/** Non-critical variant: a notification failure must never fail the business operation that triggered it. */
export async function notifySafe(input: NotifyInput): Promise<number> {
  try {
    return await notifyUsers(input);
  } catch (e) {
    console.error("[notifications] delivery failed", e instanceof Error ? e.message : e);
    return 0;
  }
}

/** Active users who hold `permission` (SUPER_ADMIN always qualifies). */
export async function usersWithPermission(permission: string | string[], excludeUserId?: string | null): Promise<string[]> {
  const keys = Array.isArray(permission) ? permission : [permission];
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null, status: "ACTIVE", ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      roles: { some: { role: { OR: [{ name: "SUPER_ADMIN" }, { permissions: { some: { permission: { key: { in: keys } } } } }] } } },
    },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

export async function listNotifications(userId: string, opts: { unreadOnly?: boolean; limit?: number; cursor?: string } = {}) {
  const limit = Math.min(Math.max(opts.limit ?? 30, 1), 100);
  const where = { userId, ...(opts.unreadOnly ? { readAt: null } : {}) };
  const [rows, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: limit + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  return { items, unreadCount, nextCursor: hasMore ? items[items.length - 1].id : null };
}

/** Only the owner's notification can be marked read; unknown / foreign ids report `false`. */
export async function markNotificationRead(userId: string, id: string): Promise<boolean> {
  const res = await prisma.notification.updateMany({ where: { id, userId, readAt: null }, data: { readAt: new Date() } });
  if (res.count) return true;
  return (await prisma.notification.count({ where: { id, userId } })) > 0;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  return (await prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } })).count;
}
