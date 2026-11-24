"use client";

import { useState } from "react";
import Link from "next/link";
import { INSIGHT_ARTICLES, INSIGHT_CATEGORIES } from "@/lib/insights-data";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export default function InsightsPage() {
  const [selectedCat, setSelectedCat] = useState("All");

  const filtered = selectedCat === "All"
    ? INSIGHT_ARTICLES
    : INSIGHT_ARTICLES.filter((a) => a.category.toLowerCase().includes(selectedCat.toLowerCase()));

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] overflow-hidden pt-16">
      
      {/* Hero */}
      <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 overflow-hidden">
        <div className="hidden lg:block hero-diagonal-bg" />
        <div className="hidden lg:block hero-diagonal-soft" />

        <Container className="relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3.5 py-1.5 rounded-md">
              Insights & Engineering
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#0B0B0F]">
              Insights, Architecture &<br />
              <span className="text-[#FF5A00]">Digital Growth</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              Practical guides, engineering blueprints and growth strategies designed for founders and business leaders building modern companies.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories & Articles List */}
      <section className="py-14 bg-white border-y border-[#E8E5E2]">
        <Container>
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <button
              onClick={() => setSelectedCat("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCat === "All"
                  ? "bg-[#FF5A00] text-white shadow-xs"
                  : "bg-[#FFF9F4] text-[#4B5563] border border-[#E8E5E2] hover:border-[#FF5A00]"
              }`}
            >
              All Articles
            </button>
            {INSIGHT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCat === cat
                    ? "bg-[#FF5A00] text-white shadow-xs"
                    : "bg-[#FFF9F4] text-[#4B5563] border border-[#E8E5E2] hover:border-[#FF5A00]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <article
                key={article.slug}
                className="bg-[#FFF9F4] rounded-2xl p-6 border border-[#E8E5E2] hover:border-[#FF5A00]/50 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#FFF3E9] text-[#FF5A00]">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#4B5563]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-[#0B0B0F] hover:text-[#FF5A00] transition-colors leading-snug">
                    <Link href={`/insights/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E5E2] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4B5563]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.publishedAt}</span>
                  </div>

                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A00] hover:underline"
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

      {/* CTA */}
      <CtaBanner
        headline="Ready to Build, Create
and Grow Your Business?"
        subtext="Let's discuss your goals and create a digital plan that actually works for your business."
      />

    </div>
  );
}
