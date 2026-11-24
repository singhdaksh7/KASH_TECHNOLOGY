import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";

export const GET = admin<{ id: string }>("pages.view", async ({ params }) => {
  const versions = await prisma.pageVersion.findMany({
    where: { pageId: params.id }, orderBy: { version: "desc" }, take: 100,
    select: { version: true, createdAt: true, reason: true, createdBy: { select: { name: true, email: true } } },
  });
  return ok(versions.map((v) => ({ version: v.version, createdAt: v.createdAt.toISOString(), reason: v.reason ?? "", by: v.createdBy?.name || v.createdBy?.email || "—" })));
});
