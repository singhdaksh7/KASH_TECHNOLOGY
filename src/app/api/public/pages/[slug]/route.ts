import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/server/http";
import { resolveSections } from "@/lib/cms/global-block-resolve";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const raw = (await params).slug;
  const slug = raw.startsWith("/") ? raw : `/${raw}`;
  const page = await prisma.page.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() }, deletedAt: null },
    include: { sections: { where: { enabled: true }, orderBy: { order: "asc" } }, seo: true },
  });
  if (!page) return fail("NOT_FOUND", "Page not found", 404);
  // Sections linked to a global block inherit the block's current type/content/style.
  const ids = [...new Set(page.sections.map((s) => s.globalBlockId).filter((x): x is string => !!x))];
  const blocks = ids.length ? new Map((await prisma.globalBlock.findMany({ where: { id: { in: ids } } })).map((b) => [b.id, b])) : new Map();
  const { draft: _draft, ...publicPage } = page;
  void _draft;
  return ok({ ...publicPage, sections: resolveSections(page.sections, blocks) });
}
