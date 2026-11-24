import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { unpublishPage } from "@/lib/cms/page-workflow";
import { pageInclude } from "@/lib/cms/pages";
import { prisma } from "@/lib/db/prisma";
import { toAdminPageDetail } from "@/lib/server/dto-pages";

export const POST = admin<{ id: string }>(null, async ({ session, params }) => {
  await unpublishPage(actorFromSession(session), params.id);
  return ok(await toAdminPageDetail(await prisma.page.findUniqueOrThrow({ where: { id: params.id }, include: pageInclude })));
});
