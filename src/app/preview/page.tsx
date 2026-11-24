import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { authorizePreview } from "@/lib/cms/preview";
import { CmsPageRenderer } from "@/components/cms/CmsPageRenderer";
import { PreviewBanner } from "@/components/cms/PreviewBanner";

/**
 * Draft preview: /preview?page=<id>&token=<signed token>
 * Always dynamic, never cached, always noindex. Access is decided solely by authorizePreview()
 * (src/lib/cms/preview.ts) — the integration hook for admin auth. Denied/missing → 404.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
};

interface Props {
  searchParams: Promise<{ page?: string | string[]; token?: string | string[] }>;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PreviewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageId = first(sp.page);
  if (!pageId || !/^[A-Za-z0-9_-]{1,64}$/.test(pageId)) notFound();

  const auth = await authorizePreview({ pageId, token: first(sp.token) });
  if (!auth.ok) notFound();

  const page = await cms.getPreviewPage(pageId, auth.credential);
  if (!page) notFound();

  return (
    <>
      <PreviewBanner title={page.title} status={page.status} />
      <CmsPageRenderer page={page} legacy={<div className="mx-auto max-w-3xl p-10 text-center text-sm text-stone-500">Built-in page content is shown here on the live site (preview shows the draft sections only).</div>} />
    </>
  );
}
