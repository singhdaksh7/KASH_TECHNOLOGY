import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { scrub } from "@/lib/server/scrub";

export interface AuditInput {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  before?: unknown;
  after?: unknown;
  requestId?: string;
  ipHash?: string;
}

export const audit = (data: AuditInput) => {
  const meta: Record<string, unknown> = {
    ...(data.metadata ?? {}),
  };
  if (data.before !== undefined) meta.before = data.before;
  if (data.after !== undefined) meta.after = data.after;
  if (data.requestId) meta.requestId = data.requestId;

  const safeMeta = scrub(meta) as Prisma.InputJsonValue;

  return prisma.auditLog
    .create({
      data: {
        actorId: data.actorId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        metadata: safeMeta,
        ipHash: data.ipHash,
      },
    })
    .catch((err) => {
      console.error("[audit] failed to write audit log", err);
      return undefined;
    });
};
