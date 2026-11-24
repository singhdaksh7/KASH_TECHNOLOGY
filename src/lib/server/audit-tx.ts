import type { Prisma } from "@prisma/client";

export interface AuditInput {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}

/** Writes an AuditLog row inside the caller's transaction, so the log commits (or rolls back) with the change. */
export const auditTx = (tx: Prisma.TransactionClient, d: AuditInput) =>
  tx.auditLog.create({ data: { actorId: d.actorId ?? undefined, action: d.action, entity: d.entity, entityId: d.entityId, metadata: d.metadata } });
