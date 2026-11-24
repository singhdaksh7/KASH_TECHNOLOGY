import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cms, getPublishedArticles, getSettings } from "@/lib/cms";
import { isValidSlugSegment } from "@/lib/cms/reserved-slugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/cms/JsonLd";
import { RichText } from "@/components/cms/RichText";
import { SafeImage } from "@/components/cms/SafeImage";
import { safeImageSrc } from "@/lib/cms/url-safety";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;
export const dynamicParams = true;

async function loadArticle(slug: string) {
  if (!isValidSlugSegment(slug)) return null;
  const article = await cms.getArticle(slug);
  return article && article.status === "published" ? article : null;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return {};
  const settings = await getSettings();

  return buildMetadata({
    path: `/insights/${article.slug}`,
    seo: article.seo ? { ogImage: article.cover, ...article.seo } : article.cover ? { ogImage: article.cover } : undefined,
    // Existing static metadata is the second tier.
    fallback: {
      title: `${article.title} | KASH Technology`,
      description: article.excerpt,
      openGraph: { title: article.title, description: article.excerpt },
    },
    settings,
    ogType: "article",
  });
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const settings = await getSettings();
  const all = await getPublishedArticles();
  const related = (article.relatedSlugs?.length
    ? article.relatedSlugs.map((s) => all.find((a) => a.slug === s)).filter((a): a is NonNullable<typeof a> => !!a)
    : all.filter((a) => a.slug !== article.slug && a.category === article.category)
  ).slice(0, 3);

  return (
    <>
      <JsonLd data={articleSchema(article, `/insights/${article.slug}`, settings)} />

      {/* Hero Header */}
      <HeroDiagonal
        badge={article.category.toUpperCase()}
        titlePrimary={article.title}
        titleAccent=""
        description={article.excerpt}
        primaryCtaText="Consult an Architect"
        primaryCtaHref="/contact"
        secondaryCtaText="All Insights"
        secondaryCtaHref="/insights"
        breadcrumbs={[
          { label: "Insights", href: "/insights" },
          { label: article.category },
        ]}
      />

      {/* Article Content on Ivory Surface */}
      <article className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10 max-w-4xl">
          {/* Article Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-black/10 text-xs font-mono text-[#6b7280]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#e86024]" />
                <span className="font-semibold text-[#111827]">{article.author.name}</span>
                {article.author.role && (
                  <>
                    <span className="text-black/30">•</span>
                    <span>{article.author.role}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </div>
              {article.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Body */}
          {article.cover && safeImageSrc(article.cover) && (
            <SafeImage src={safeImageSrc(article.cover)} alt="" priority wrapperClassName="mb-10 aspect-[16/9] w-full rounded-2xl" />
          )}

          {/* Article Body (structured rich text, sanitised) */}
          <RichText value={article.content} gap="space-y-6" className="text-[#374151] leading-relaxed" />

          {/* Engineering Key Takeaways Card */}
          <div className="mt-12 p-8 rounded-2xl bg-[#0e0e12] text-white border border-white/5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e86024] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Architectural Takeaway</span>
            </div>
            <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
              Software scalability is not an accident—it is the direct outcome of disciplined architecture, schema normalization, and removing communication latency between business leaders and engineers.
            </p>
          </div>

          {related.length > 0 && (
            <nav aria-label="Related articles" className="mt-12 pt-8 border-t border-black/10">
              <h2 className="font-serif-heading text-xl font-bold mb-4">Related reading</h2>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/insights/${r.slug}`} className="text-[#e86024] font-semibold hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Back Navigation & Share */}
          <div className="mt-12 pt-8 border-t border-black/10 flex items-center justify-between">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-mono font-bold text-[#e86024] hover:text-[#d35219] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Insights</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e86024] text-white text-xs font-mono font-bold hover:bg-[#d35219] transition-colors shadow-sm"
            >
              <span>Discuss Your Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </article>

      {/* Bottom CTA */}
      <CtaBanner
        variant="dark"
        title="Ready to Engineer Your Custom Software Solution?"
        subtitle="Schedule a direct technical consultation with our engineering team today."
        buttonText="Book an Architecture Call"
        buttonHref="/contact"
      />
    </>
  );
}
