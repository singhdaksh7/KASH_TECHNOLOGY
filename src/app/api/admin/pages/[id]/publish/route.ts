import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { publishPage } from "@/lib/cms/page-workflow";
import { pageInclude } from "@/lib/cms/pages";
import { prisma } from "@/lib/db/prisma";
import { toAdminPageDetail } from "@/lib/server/dto-pages";

/**
 * Publish (V1 contract, Phase 2 rules): the workflow state machine decides what is allowed
 * (APPROVED → PUBLISHED; DRAFT/CHANGES_REQUESTED only for approvers; re-publishing a live page's pending changes).
 * Validates, applies the working copy to live rows, snapshots a version, audits, notifies and refreshes the public site.
 */
export const POST = admin<{ id: string }>(null, async ({ session, params }) => {
  await publishPage(actorFromSession(session), params.id);
  return ok(await toAdminPageDetail(await prisma.page.findUniqueOrThrow({ where: { id: params.id }, include: pageInclude })));
});
