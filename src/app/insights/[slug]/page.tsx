import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INSIGHT_ARTICLES } from "@/lib/insights-data";
import { SITE_CONFIG } from "@/lib/constants";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INSIGHT_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = INSIGHT_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} | KASH Technology`,
    description: article.excerpt,
    alternates: {
      canonical: `/insights/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://kash-technology.com/insights/${article.slug}`,
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = INSIGHT_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author.name,
      url: SITE_CONFIG.websiteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.companyName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.websiteUrl}/images/logo/kash-logo-emblem.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.websiteUrl}/insights/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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
                <span className="text-black/30">•</span>
                <span>{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="space-y-6 text-base sm:text-lg text-[#374151] leading-relaxed">
            {article.contentHtml.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

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
