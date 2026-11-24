import { z } from "zod";
import { admin, body, HttpError } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { actorFromSession } from "@/lib/rbac/actor";
import { schedulePage } from "@/lib/cms/page-workflow";
import { DEFAULT_TIMEZONE, zonedToUtc } from "@/lib/cms/schedule-time";
import { pageInclude } from "@/lib/cms/pages";
import { prisma } from "@/lib/db/prisma";
import { toAdminPageDetail } from "@/lib/server/dto-pages";

/**
 * Either exact UTC instants ({publishAt, unpublishAt}) or the admin UI's wall-clock form
 * ({publishDate, publishTime, timezone, unpublishDate?, unpublishTime?}). Only UTC instants are stored.
 */
const schema = z.object({
  publishAt: z.coerce.date().nullish(), unpublishAt: z.coerce.date().nullish(),
  publishDate: z.string().optional(), publishTime: z.string().optional(), timezone: z.string().max(64).optional(),
  unpublishDate: z.string().optional(), unpublishTime: z.string().optional(),
});

export const POST = admin<{ id: string }>(null, async ({ request, session, params }) => {
  const d = await body(request, schema);
  const tz = d.timezone || DEFAULT_TIMEZONE;
  let publishAt = d.publishAt ?? null, unpublishAt = d.unpublishAt ?? null;
  try {
    if (d.publishDate) publishAt = zonedToUtc(d.publishDate, d.publishTime || "00:00", tz);
    if (d.unpublishDate) unpublishAt = zonedToUtc(d.unpublishDate, d.unpublishTime || "00:00", tz);
  } catch (e) {
    throw new HttpError(400, "VALIDATION_ERROR", e instanceof Error ? e.message : "Invalid schedule");
  }
  await schedulePage(actorFromSession(session), params.id, { publishAt, unpublishAt });
  return ok(await toAdminPageDetail(await prisma.page.findUniqueOrThrow({ where: { id: params.id }, include: pageInclude })));
});
