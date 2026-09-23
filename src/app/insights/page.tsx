import type { Metadata } from "next";
import Link from "next/link";
import { INSIGHT_ARTICLES, INSIGHT_CATEGORIES } from "@/lib/insights-data";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights & Engineering Perspectives | KASH Technology",
  description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses in Delhi NCR and Western UP.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights & Engineering Perspectives | KASH Technology",
    description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses.",
    url: "https://kash-technology.com/insights",
  },
};

export default function InsightsPage() {
  return (
    <>
      <HeroDiagonal
        badge="ENGINEERING & TECH INSIGHTS"
        titlePrimary="Insights, Architecture &"
        titleAccent="Engineering Strategy"
        description="Practical blueprints, database architecture insights, and technical guides designed for founders and business leaders scaling their operations."
        primaryCtaText="Explore Services"
        primaryCtaHref="/services"
        secondaryCtaText="View Portfolio"
        secondaryCtaHref="/portfolio"
        breadcrumbs={[{ label: "Insights" }]}
      />

      {/* Categories & Articles List on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16 max-w-4xl mx-auto">
            <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#e86024] text-white shadow-sm">
              All Categories
            </span>
            {INSIGHT_CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#6b7280] border border-black/5"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {INSIGHT_ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-[#0e0e12] text-[#c5a880]">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-3 leading-snug hover:text-[#e86024] transition-colors">
                    <Link href={`/insights/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.publishedAt}</span>
                  </div>

                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#e86024] hover:text-[#d35219] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Conversion Banner */}
      <CtaBanner
        variant="dark"
        title="Have a Software Challenge to Solve?"
        subtitle="Schedule a direct technical consultation with our lead engineering team."
        buttonText="Discuss Your Architecture"
        buttonHref="/contact"
      />
    </>
  );
}
