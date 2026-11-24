import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { compareSnapshots, type PageSnapshot } from "./diff";

const who = (u: { name: string | null; email: string } | null) => u?.name || u?.email || null;

export async function listVersions(pageId: string) {
  if (!(await prisma.page.findFirst({ where: { id: pageId, deletedAt: null }, select: { id: true } }))) throw new HttpError(404, "NOT_FOUND", "Page not found");
  const rows = await prisma.pageVersion.findMany({
    where: { pageId }, orderBy: { version: "desc" }, take: 200,
    select: { id: true, version: true, createdAt: true, reason: true, createdBy: { select: { name: true, email: true } } },
  });
  return rows.map((v) => ({ id: v.id, version: v.version, createdAt: v.createdAt.toISOString(), reason: v.reason ?? "", by: who(v.createdBy) ?? "—" }));
}

async function loadVersion(pageId: string, version: number) {
  const v = await prisma.pageVersion.findUnique({ where: { pageId_version: { pageId, version } }, include: { createdBy: { select: { name: true, email: true } } } });
  if (!v) throw new HttpError(404, "NOT_FOUND", `Version ${version} not found`);
  return v;
}

/** Structured diff between two stored versions of a page (a = "from", b = "to"). */
export async function compareVersions(pageId: string, a: number, b: number) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) throw new HttpError(400, "VALIDATION_ERROR", "Version numbers must be positive integers");
  const [va, vb] = await Promise.all([loadVersion(pageId, a), loadVersion(pageId, b)]);
  const meta = (v: typeof va) => ({ version: v.version, createdAt: v.createdAt.toISOString(), reason: v.reason ?? "", by: who(v.createdBy) ?? "—" });
  return { pageId, from: meta(va), to: meta(vb), diff: compareSnapshots(va.snapshot as unknown as PageSnapshot, vb.snapshot as unknown as PageSnapshot) };
}
