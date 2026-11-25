import { prisma } from "@/lib/db/prisma";
import { audit } from "@/lib/server/audit";
import { refreshPublicSite } from "@/lib/server/api";
import { notifySafe, usersWithPermission } from "@/lib/notifications";

export type ContentEntity = "Page" | "Article" | "PortfolioProject";
const ENTITY_KEY: Record<ContentEntity, string> = { Page: "page", Article: "article", PortfolioProject: "portfolio" };
const ENTITY_LINK: Record<ContentEntity, (id: string) => string> = {
  Page: (id) => `/admin/pages/${id}/edit`, Article: () => "/admin/insights", PortfolioProject: (id) => `/admin/portfolio/${id}`,
};

export interface PublishEvent {
  entity: ContentEntity;
  id: string;
  title: string;
  slug: string;
  actorId?: string | null;
  via: "manual" | "scheduler" | "bulk";
  /** Distinguishes one publication from the next so each gets exactly one notification. */
  occurrence: string;
  metadata?: Record<string, unknown>;
}

/** Who should hear about a publish: the author and whoever submitted it, never the actor. Falls back to approvers. */
async function audience(entity: ContentEntity, id: string, actorId?: string | null) {
  const row = entity === "Page" ? await prisma.page.findUnique({ where: { id }, select: { createdById: true, submittedById: true } }) : null;
  const people = [row?.createdById, row?.submittedById].filter((x): x is string => !!x && x !== actorId);
  return people.length ? people : usersWithPermission(["content.approve", "content.publish"], actorId);
}

/**
 * Single place for everything that must happen after content goes live (or is taken down):
 * audit log → notification (best effort) → public site revalidation. Never throws.
 */
export async function afterContentPublished(e: PublishEvent & { action?: "publish" | "unpublish" }) {
  const action = e.action ?? "publish";
  const key = ENTITY_KEY[e.entity];
  await audit({ actorId: e.actorId ?? undefined, action: `${key}.${action}`, entity: e.entity, entityId: e.id, metadata: { slug: e.slug, via: e.via, ...e.metadata } });
  try {
    await notifySafe({
      userIds: await audience(e.entity, e.id, e.actorId),
      type: action === "publish" ? "PAGE_PUBLISHED" : "PAGE_UNPUBLISHED",
      title: action === "publish" ? `Published: ${e.title}` : `Unpublished: ${e.title}`,
      message: `${e.title} (${e.slug}) was ${action === "publish" ? "published" : "taken offline"}${e.via === "scheduler" ? " by its schedule" : ""}.`,
      entityType: e.entity, entityId: e.id, link: ENTITY_LINK[e.entity](e.id), dedupeKey: `${key}:${e.id}:${action}:${e.occurrence}`,
    });
  } catch (err) {
    console.error("[publish-hook] notification skipped", err instanceof Error ? err.message : err);
  }
  refreshPublicSite();
}

export async function afterContentPublishFailed(e: Pick<PublishEvent, "entity" | "id" | "title" | "slug" | "occurrence"> & { error: string }) {
  const key = ENTITY_KEY[e.entity];
  await audit({ action: `${key}.publish_failed`, entity: e.entity, entityId: e.id, metadata: { slug: e.slug, error: e.error.slice(0, 500) } });
  await notifySafe({
    userIds: await usersWithPermission(["content.publish", "content.approve", "pages.publish"]).catch(() => []),
    type: "PAGE_PUBLISH_FAILED", title: `Publishing failed: ${e.title}`, message: `${e.title} (${e.slug}) could not be published: ${e.error.slice(0, 300)}`,
    entityType: e.entity, entityId: e.id, link: ENTITY_LINK[e.entity](e.id), dedupeKey: `${key}:${e.id}:publish_failed:${e.occurrence}`,
  });
}
