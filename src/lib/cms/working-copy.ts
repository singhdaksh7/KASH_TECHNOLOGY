import { Prisma } from "@prisma/client";
import { HttpError } from "@/lib/server/api";
import { pageInclude, type PageWithRelations } from "./pages";

// The V1 implementations are the single source of truth for working copies, validation and applying drafts to live rows.
export { applyToLive, pageInclude, validateWorkingCopy, workingCopy } from "./pages";
export type { PageWithRelations, StoredSection, StoredSeo, WorkingCopy } from "./pages";

export const SLUG_RE = /^\/[a-z0-9/-]*$/;
const json = (v: unknown) => v as Prisma.InputJsonValue;

export async function snapshotPage(tx: Prisma.TransactionClient, pageId: string, userId: string | null, reason?: string) {
  const page = await tx.page.findUniqueOrThrow({ where: { id: pageId }, include: { sections: { orderBy: { order: "asc" } }, seo: true } });
  const last = await tx.pageVersion.aggregate({ where: { pageId }, _max: { version: true } });
  return tx.pageVersion.create({ data: { pageId, version: (last._max.version ?? 0) + 1, snapshot: json(page), createdById: userId ?? undefined, reason } });
}

export async function loadPage(tx: Prisma.TransactionClient | { page: Prisma.TransactionClient["page"] }, id: string) {
  const page = await tx.page.findFirst({ where: { id, deletedAt: null }, include: pageInclude });
  if (!page) throw new HttpError(404, "NOT_FOUND", "Page not found");
  return page;
}

export { resolveSections, type BlockLike } from "./global-block-resolve";
