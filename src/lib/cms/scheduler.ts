import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { afterContentPublishFailed, afterContentPublished, type ContentEntity } from "./publish-hooks";
import { publishPageInTx } from "./page-workflow";

export interface ScheduledItem { entity: ContentEntity; id: string; slug: string }
export interface SchedulerResult {
  ranAt: string;
  published: ScheduledItem[];
  unpublished: ScheduledItem[];
  failed: Array<ScheduledItem & { error: string }>;
  /** Due items another run (or an admin) already handled between the query and the claim. */
  skipped: number;
}

const BATCH = 100;

/** Constant-time check of the shared scheduler secret. Returns false when no secret is configured. */
export function schedulerSecretMatches(provided: string | null | undefined, secret = process.env.CMS_SCHEDULER_SECRET): boolean {
  if (!secret || !provided) return false;
  const a = Buffer.from(provided), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Publishes content whose `publishAt` has passed and unpublishes content whose `unpublishAt` has passed.
 *
 * Idempotent and safe to run concurrently: every item is claimed with a conditional UPDATE
 * (`WHERE status = <expected>`), so exactly one runner acts on an item and a re-run finds nothing to do.
 * One failing item never stops the others; failures are audited and notified once per scheduled time.
 */
export async function processScheduledContent(now = new Date()): Promise<SchedulerResult> {
  const result: SchedulerResult = { ranAt: now.toISOString(), published: [], unpublished: [], failed: [], skipped: 0 };

  // ── Pages ────────────────────────────────────────────────────────────────
  const duePages = await prisma.page.findMany({ where: { status: "SCHEDULED", publishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, publishAt: true }, orderBy: { publishAt: "asc" }, take: BATCH });
  for (const p of duePages) {
    const item: ScheduledItem = { entity: "Page", id: p.id, slug: p.slug };
    try {
      const r = await prisma.$transaction((tx) => publishPageInTx(tx, p.id, "SCHEDULED", null, {}, "scheduled publish"));
      result.published.push({ ...item, slug: r.slug });
      await afterContentPublished({ entity: "Page", id: p.id, title: r.title, slug: r.slug, via: "scheduler", occurrence: String(p.publishAt?.getTime() ?? now.getTime()), metadata: { scheduledFor: p.publishAt?.toISOString() } });
    } catch (e) {
      if (e instanceof HttpError && e.status === 409 && e.code === "CONFLICT" && /changed while publishing/.test(e.message)) { result.skipped++; continue; }
      const error = e instanceof Error ? e.message : "Unknown error";
      result.failed.push({ ...item, error });
      await afterContentPublishFailed({ entity: "Page", id: p.id, title: p.title, slug: p.slug, occurrence: String(p.publishAt?.getTime() ?? 0), error });
    }
  }

  // ── Articles & portfolio projects (status flip only; they have no draft layer) ──
  const simple = [
    { entity: "Article" as const, rows: () => prisma.article.findMany({ where: { status: "SCHEDULED", publishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, publishAt: true }, take: BATCH }),
      claim: (id: string) => prisma.article.updateMany({ where: { id, status: "SCHEDULED", publishAt: { lte: now } }, data: { status: "PUBLISHED", publishedAt: now, publishAt: null } }) },
    { entity: "PortfolioProject" as const, rows: () => prisma.portfolioProject.findMany({ where: { status: "SCHEDULED", publishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, publishAt: true }, take: BATCH }),
      claim: (id: string) => prisma.portfolioProject.updateMany({ where: { id, status: "SCHEDULED", publishAt: { lte: now } }, data: { status: "PUBLISHED", publishedAt: now, publishAt: null } }) },
  ];
  for (const s of simple) {
    for (const row of await s.rows()) {
      const item: ScheduledItem = { entity: s.entity, id: row.id, slug: row.slug };
      try {
        if ((await s.claim(row.id)).count !== 1) { result.skipped++; continue; }
        result.published.push(item);
        await afterContentPublished({ entity: s.entity, id: row.id, title: row.title, slug: row.slug, via: "scheduler", occurrence: String(row.publishAt?.getTime() ?? now.getTime()) });
      } catch (e) {
        const error = e instanceof Error ? e.message : "Unknown error";
        result.failed.push({ ...item, error });
        await afterContentPublishFailed({ entity: s.entity, id: row.id, title: row.title, slug: row.slug, occurrence: String(row.publishAt?.getTime() ?? 0), error });
      }
    }
  }

  // ── Expiry: PUBLISHED with a passed unpublishAt → DRAFT ───────────────────
  const expiring = [
    { entity: "Page" as const, rows: () => prisma.page.findMany({ where: { status: "PUBLISHED", unpublishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, unpublishAt: true }, take: BATCH }),
      claim: (id: string) => prisma.page.updateMany({ where: { id, status: "PUBLISHED", unpublishAt: { lte: now } }, data: { status: "DRAFT", unpublishAt: null, approvedAt: null, approvedById: null } }) },
    { entity: "Article" as const, rows: () => prisma.article.findMany({ where: { status: "PUBLISHED", unpublishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, unpublishAt: true }, take: BATCH }),
      claim: (id: string) => prisma.article.updateMany({ where: { id, status: "PUBLISHED", unpublishAt: { lte: now } }, data: { status: "DRAFT", unpublishAt: null } }) },
    { entity: "PortfolioProject" as const, rows: () => prisma.portfolioProject.findMany({ where: { status: "PUBLISHED", unpublishAt: { lte: now }, deletedAt: null }, select: { id: true, slug: true, title: true, unpublishAt: true }, take: BATCH }),
      claim: (id: string) => prisma.portfolioProject.updateMany({ where: { id, status: "PUBLISHED", unpublishAt: { lte: now } }, data: { status: "DRAFT", unpublishAt: null } }) },
  ];
  for (const s of expiring) {
    for (const row of await s.rows()) {
      const item: ScheduledItem = { entity: s.entity, id: row.id, slug: row.slug };
      try {
        if ((await s.claim(row.id)).count !== 1) { result.skipped++; continue; }
        result.unpublished.push(item);
        await afterContentPublished({ entity: s.entity, id: row.id, title: row.title, slug: row.slug, via: "scheduler", action: "unpublish", occurrence: String(row.unpublishAt?.getTime() ?? now.getTime()), metadata: { expiredAt: row.unpublishAt?.toISOString() } });
      } catch (e) {
        result.failed.push({ ...item, error: e instanceof Error ? e.message : "Unknown error" });
      }
    }
  }
  return result;
}
