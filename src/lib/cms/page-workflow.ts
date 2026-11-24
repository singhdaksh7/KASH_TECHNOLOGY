import { Prisma, type PageStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, can, type Actor } from "@/lib/rbac/actor";
import { notifySafe, usersWithPermission } from "@/lib/notifications";
import { sendTemplatedEmail } from "@/lib/email/templates";
import { afterContentPublished } from "./publish-hooks";
import { ACTION_PERMISSIONS, FAST_TRACK_FROM, assertTransition, validateSchedule, type WorkflowAction } from "./workflow";
import { applyToLive, loadPage, snapshotPage, validateWorkingCopy, workingCopy } from "./working-copy";

export const PAGE_STATE_SELECT = {
  id: true, title: true, slug: true, status: true, publishedAt: true, publishAt: true, unpublishAt: true, submittedForReviewAt: true,
  submittedById: true, reviewedAt: true, reviewedById: true, reviewNote: true, approvedAt: true, approvedById: true, updatedAt: true,
} as const;

const pageLink = (id: string) => `/admin/pages/${id}`;
const authorsOf = (p: { createdById: string | null; submittedById: string | null }, actorId: string) =>
  [p.submittedById, p.createdById].filter((x): x is string => !!x && x !== actorId);

/** Atomic guarded status change: succeeds only if the row still has the status we validated against. */
async function claim(tx: Prisma.TransactionClient, id: string, from: PageStatus, data: Prisma.PageUpdateManyMutationInput & Record<string, unknown>) {
  const res = await tx.page.updateMany({ where: { id, status: from, deletedAt: null }, data });
  if (res.count !== 1) throw new HttpError(409, "CONFLICT", "The page changed while this action was running; reload and try again");
}

export async function submitForReview(actor: Actor, pageId: string, note?: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.submit_review);
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "IN_REVIEW");
  const problem = validateWorkingCopy(workingCopy(page));
  if (problem) throw new HttpError(400, "VALIDATION_ERROR", problem);
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, page.status, { status: "IN_REVIEW", submittedForReviewAt: now, submittedById: actor.id, reviewNote: note ?? null, reviewedAt: null, reviewedById: null, approvedAt: null, approvedById: null });
    await auditTx(tx, { actorId: actor.id, action: "page.submit_review", entity: "Page", entityId: pageId, metadata: { from: page.status, note: note ?? null } });
  });
  await notifySafe({
    userIds: await usersWithPermission(["content.review", "content.approve"], actor.id), type: "PAGE_REVIEW",
    title: `Review requested: ${page.title}`, message: `${page.title} (${page.slug}) is waiting for review.`,
    entityType: "Page", entityId: pageId, link: pageLink(pageId), dedupeKey: `page:${pageId}:review:${now.getTime()}`,
  });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function requestChanges(actor: Actor, pageId: string, note: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.request_changes);
  if (!note?.trim()) throw new HttpError(400, "VALIDATION_ERROR", "A note explaining the requested changes is required");
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "CHANGES_REQUESTED");
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, page.status, { status: "CHANGES_REQUESTED", reviewedAt: now, reviewedById: actor.id, reviewNote: note.trim(), approvedAt: null, approvedById: null });
    await auditTx(tx, { actorId: actor.id, action: "page.request_changes", entity: "Page", entityId: pageId, metadata: { from: page.status, note: note.trim() } });
  });
  await notifySafe({
    userIds: authorsOf(page, actor.id), type: "PAGE_CHANGES_REQUESTED", title: `Changes requested: ${page.title}`,
    message: note.trim().slice(0, 500), entityType: "Page", entityId: pageId, link: pageLink(pageId), dedupeKey: `page:${pageId}:changes:${now.getTime()}`,
  });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function approvePage(actor: Actor, pageId: string, note?: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.approve);
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "APPROVED");
  if (page.submittedById === actor.id && !actor.isSuper) throw new HttpError(403, "SELF_APPROVAL", "A page cannot be approved by the person who submitted it");
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, page.status, { status: "APPROVED", reviewedAt: now, reviewedById: actor.id, approvedAt: now, approvedById: actor.id, ...(note ? { reviewNote: note } : {}) });
    await auditTx(tx, { actorId: actor.id, action: "page.approve", entity: "Page", entityId: pageId, metadata: { note: note ?? null } });
  });
  const people = authorsOf(page, actor.id);
  await notifySafe({
    userIds: people, type: "PAGE_APPROVED", title: `Approved: ${page.title}`, message: `${page.title} (${page.slug}) was approved and is ready to publish.`,
    entityType: "Page", entityId: pageId, link: pageLink(pageId), dedupeKey: `page:${pageId}:approved:${now.getTime()}`,
  });
  // Best-effort templated email to the author(s); a mail outage never affects the approval.
  const recipients = await prisma.user.findMany({ where: { id: { in: people }, deletedAt: null }, select: { email: true } }).catch(() => []);
  for (const r of recipients) {
    await sendTemplatedEmail("page_approval", r.email, { pageTitle: page.title, pageSlug: page.slug, reviewerNote: note ?? "", adminUrl: pageLink(pageId) }).catch(() => undefined);
  }
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

function fastTrackCheck(actor: Actor, status: PageStatus) {
  const fastTrack = FAST_TRACK_FROM.includes(status);
  if (fastTrack && !can(actor, "content.approve")) {
    throw new HttpError(403, "FORBIDDEN", "Only an approver can publish or schedule content that has not been approved", { status });
  }
  return fastTrack;
}

/** Applies the working copy (if any) and makes the page live. Used by manual publish and by the scheduler. */
export async function publishPageInTx(tx: Prisma.TransactionClient, pageId: string, from: PageStatus, actorId: string | null, extra: Prisma.PageUpdateInput = {}, reason = "publish") {
  const page = await loadPage(tx, pageId);
  const w = workingCopy(page);
  const problem = validateWorkingCopy(w);
  if (problem) throw new HttpError(400, "VALIDATION_ERROR", problem);
  const clash = await tx.page.findFirst({ where: { slug: w.slug, id: { not: pageId }, deletedAt: null }, select: { id: true } });
  if (clash) throw new HttpError(409, "CONFLICT", "Another page already uses that slug");
  const now = new Date();
  const claimed = await tx.page.updateMany({ where: { id: pageId, status: from, deletedAt: null }, data: { status: "PUBLISHED", publishedAt: now, publishAt: null } });
  if (claimed.count !== 1) throw new HttpError(409, "CONFLICT", "The page changed while publishing");
  await applyToLive(tx, pageId, w, actorId, { status: "PUBLISHED", publishedAt: now, publishAt: null, ...extra });
  await snapshotPage(tx, pageId, actorId, reason);
  return { page, slug: w.slug, title: w.title, publishedAt: now };
}

export async function publishPage(actor: Actor, pageId: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.publish);
  const page = await loadPage(prisma, pageId);
  const fastTrack = fastTrackCheck(actor, page.status);
  assertTransition(page.status, "PUBLISHED", { fastTrack });
  const result = await prisma.$transaction(async (tx) => {
    const r = await publishPageInTx(tx, pageId, page.status, actor.id, fastTrack ? { approvedAt: new Date(), approvedById: actor.id, reviewedAt: new Date(), reviewedById: actor.id } : {});
    await auditTx(tx, { actorId: actor.id, action: "page.publish_transition", entity: "Page", entityId: pageId, metadata: { from: page.status, fastTrack } });
    return r;
  });
  await afterContentPublished({ entity: "Page", id: pageId, title: result.title, slug: result.slug, actorId: actor.id, via: "manual", occurrence: String(result.publishedAt.getTime()), metadata: { from: page.status, fastTrack } });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function schedulePage(actor: Actor, pageId: string, input: { publishAt?: Date | null; unpublishAt?: Date | null }) {
  assertCan(actor, ...ACTION_PERMISSIONS.schedule);
  const page = await loadPage(prisma, pageId);
  const publishAt = input.publishAt ?? null, unpublishAt = input.unpublishAt ?? null;

  // Expiry on already-live content: only unpublishAt, status unchanged.
  if (page.status === "PUBLISHED") {
    if (publishAt || !unpublishAt) throw new HttpError(400, "VALIDATION_ERROR", "A published page can only be given an unpublishAt date");
    const err = validateSchedule(null, unpublishAt);
    if (err) throw new HttpError(400, "VALIDATION_ERROR", err);
    await prisma.$transaction(async (tx) => {
      await claim(tx, pageId, "PUBLISHED", { unpublishAt });
      await auditTx(tx, { actorId: actor.id, action: "page.schedule_unpublish", entity: "Page", entityId: pageId, metadata: { unpublishAt: unpublishAt.toISOString() } });
    });
    return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
  }

  if (!publishAt) throw new HttpError(400, "VALIDATION_ERROR", "publishAt is required");
  const err = validateSchedule(publishAt, unpublishAt);
  if (err) throw new HttpError(400, "VALIDATION_ERROR", err);
  const fastTrack = fastTrackCheck(actor, page.status);
  assertTransition(page.status, "SCHEDULED", { fastTrack });
  const problem = validateWorkingCopy(workingCopy(page));
  if (problem) throw new HttpError(400, "VALIDATION_ERROR", problem);
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, page.status, { status: "SCHEDULED", publishAt, unpublishAt, ...(fastTrack ? { approvedAt: new Date(), approvedById: actor.id, reviewedAt: new Date(), reviewedById: actor.id } : {}) });
    await auditTx(tx, { actorId: actor.id, action: "page.schedule", entity: "Page", entityId: pageId, metadata: { from: page.status, publishAt: publishAt.toISOString(), unpublishAt: unpublishAt?.toISOString() ?? null, fastTrack } });
  });
  await notifySafe({
    userIds: authorsOf(page, actor.id), type: "PAGE_SCHEDULED", title: `Scheduled: ${page.title}`,
    message: `${page.title} will be published on ${publishAt.toISOString()}.`, entityType: "Page", entityId: pageId, link: pageLink(pageId),
    dedupeKey: `page:${pageId}:scheduled:${publishAt.getTime()}`,
  });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function cancelSchedule(actor: Actor, pageId: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.cancel_schedule);
  const page = await loadPage(prisma, pageId);
  if (page.status === "PUBLISHED" && page.unpublishAt) {
    await prisma.$transaction(async (tx) => {
      await claim(tx, pageId, "PUBLISHED", { unpublishAt: null });
      await auditTx(tx, { actorId: actor.id, action: "page.cancel_schedule", entity: "Page", entityId: pageId, metadata: { cleared: "unpublishAt" } });
    });
    return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
  }
  assertTransition(page.status, "APPROVED");
  if (page.status !== "SCHEDULED") throw new HttpError(409, "INVALID_TRANSITION", "Only scheduled pages can have their schedule cancelled");
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, "SCHEDULED", { status: "APPROVED", publishAt: null, unpublishAt: null });
    await auditTx(tx, { actorId: actor.id, action: "page.cancel_schedule", entity: "Page", entityId: pageId, metadata: { publishAt: page.publishAt?.toISOString() ?? null } });
  });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function unpublishPage(actor: Actor, pageId: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.unpublish);
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "DRAFT");
  if (page.status !== "PUBLISHED") throw new HttpError(409, "INVALID_TRANSITION", "Only published pages can be unpublished");
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, "PUBLISHED", { status: "DRAFT", unpublishAt: null, approvedAt: null, approvedById: null, updatedById: actor.id });
    await auditTx(tx, { actorId: actor.id, action: "page.unpublish_transition", entity: "Page", entityId: pageId });
  });
  await afterContentPublished({ entity: "Page", id: pageId, title: page.title, slug: page.slug, actorId: actor.id, via: "manual", action: "unpublish", occurrence: String(Date.now()) });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function archivePage(actor: Actor, pageId: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.archive);
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "ARCHIVED");
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, page.status, { status: "ARCHIVED", publishAt: null, unpublishAt: null, updatedById: actor.id });
    await auditTx(tx, { actorId: actor.id, action: "page.archive", entity: "Page", entityId: pageId, metadata: { from: page.status } });
  });
  if (page.status === "PUBLISHED") await afterContentPublished({ entity: "Page", id: pageId, title: page.title, slug: page.slug, actorId: actor.id, via: "manual", action: "unpublish", occurrence: String(Date.now()) });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export async function unarchivePage(actor: Actor, pageId: string) {
  assertCan(actor, ...ACTION_PERMISSIONS.unarchive);
  const page = await loadPage(prisma, pageId);
  assertTransition(page.status, "DRAFT");
  if (page.status !== "ARCHIVED") throw new HttpError(409, "INVALID_TRANSITION", "Only archived pages can be restored");
  await prisma.$transaction(async (tx) => {
    await claim(tx, pageId, "ARCHIVED", { status: "DRAFT", updatedById: actor.id });
    await auditTx(tx, { actorId: actor.id, action: "page.unarchive", entity: "Page", entityId: pageId });
  });
  return prisma.page.findUniqueOrThrow({ where: { id: pageId }, select: PAGE_STATE_SELECT });
}

export type { WorkflowAction };
