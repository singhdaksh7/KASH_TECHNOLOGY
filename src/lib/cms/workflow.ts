import { HttpError } from "@/lib/server/api";

export type ContentStatus = "DRAFT" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export const CONTENT_STATUSES: ContentStatus[] = ["DRAFT", "IN_REVIEW", "CHANGES_REQUESTED", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

/** Legal status moves. Anything not listed here is rejected with 409 INVALID_TRANSITION. */
export const TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ["IN_REVIEW", "ARCHIVED"],
  IN_REVIEW: ["CHANGES_REQUESTED", "APPROVED"],
  CHANGES_REQUESTED: ["IN_REVIEW", "ARCHIVED"],
  APPROVED: ["PUBLISHED", "SCHEDULED", "CHANGES_REQUESTED", "ARCHIVED"],
  SCHEDULED: ["PUBLISHED", "APPROVED", "ARCHIVED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

/** Statuses from which an approver (content.approve) may publish/schedule directly, performing review + approval in one step. */
export const FAST_TRACK_FROM: ContentStatus[] = ["DRAFT", "CHANGES_REQUESTED"];
const FAST_TRACK_TO: ContentStatus[] = ["PUBLISHED", "SCHEDULED"];

export function canTransition(from: ContentStatus, to: ContentStatus, opts: { fastTrack?: boolean } = {}): boolean {
  if (TRANSITIONS[from]?.includes(to)) return true;
  return !!opts.fastTrack && FAST_TRACK_FROM.includes(from) && FAST_TRACK_TO.includes(to);
}

export function assertTransition(from: ContentStatus, to: ContentStatus, opts: { fastTrack?: boolean } = {}) {
  if (!canTransition(from, to, opts)) {
    throw new HttpError(409, "INVALID_TRANSITION", `A ${from} page cannot move to ${to}`, { from, to, allowed: TRANSITIONS[from] ?? [] });
  }
}

/** Permission(s) required for each workflow action (any-of). */
export const ACTION_PERMISSIONS = {
  submit_review: ["content.submit_review"],
  request_changes: ["content.review"],
  approve: ["content.approve"],
  publish: ["content.publish", "pages.publish"],
  schedule: ["content.schedule"],
  cancel_schedule: ["content.schedule"],
  unpublish: ["content.publish", "pages.publish"],
  archive: ["content.approve", "content.publish", "pages.publish"],
  unarchive: ["content.approve", "content.publish", "pages.publish"],
} as const;
export type WorkflowAction = keyof typeof ACTION_PERMISSIONS;

/** Validates a publishAt / unpublishAt pair. Returns an error message or null. */
export function validateSchedule(publishAt: Date | null, unpublishAt: Date | null, now = new Date()): string | null {
  if (publishAt && publishAt.getTime() <= now.getTime()) return "publishAt must be in the future";
  if (publishAt && unpublishAt && unpublishAt.getTime() <= publishAt.getTime()) return "unpublishAt must be after publishAt";
  if (!publishAt && unpublishAt && unpublishAt.getTime() <= now.getTime()) return "unpublishAt must be in the future";
  return null;
}
