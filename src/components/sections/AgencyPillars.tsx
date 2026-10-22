import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Sparkles, TrendingUp, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

const PILLARS = [
  {
    key: "build",
    badge: "PILLAR 01 // BUILD",
    title: "BUILD",
    tagline: "Technology that works for your business.",
    icon: Code2,
    accent: "#f36b21",
    accentBg: "bg-[#f36b21]/10",
    accentBorder: "border-[#f36b21]/30",
    badgeText: "text-[#f36b21]",
    items: [
      { name: "Websites", href: "/website-development" },
      { name: "Apps", href: "/mobile-app-development" },
      { name: "Software", href: "/custom-software-development" },
      { name: "ERP / CRM", href: "/erp-development" },
      { name: "SaaS", href: "/saas-development" },
      { name: "Automation", href: "/ai-automation" },
    ],
    ctaText: "Explore Technology",
    ctaHref: "/website-development",
  },
  {
    key: "create",
    badge: "PILLAR 02 // CREATE",
    title: "CREATE",
    tagline: "Content people want to watch and remember.",
    icon: Sparkles,
    accent: "#c5a880",
    accentBg: "bg-[#c5a880]/10",
    accentBorder: "border-[#c5a880]/30",
    badgeText: "text-[#c5a880]",
    items: [
      { name: "Reels", href: "/content-creation" },
      { name: "Video Editing", href: "/video-editing" },
      { name: "Graphics", href: "/content-creation" },
      { name: "Branding", href: "/branding" },
      { name: "Creative Campaigns", href: "/content-creation" },
    ],
    ctaText: "Explore Creative",
    ctaHref: "/content-creation",
  },
  {
    key: "grow",
    badge: "PILLAR 03 // GROW",
    title: "GROW",
    tagline: "Marketing focused on attention, leads, and business growth.",
    icon: TrendingUp,
    accent: "#f36b21",
    accentBg: "bg-[#f36b21]/10",
    accentBorder: "border-[#f36b21]/30",
    badgeText: "text-[#f36b21]",
    items: [
      { name: "Social Media", href: "/social-media-management" },
      { name: "Performance Marketing", href: "/performance-marketing" },
      { name: "Lead Generation", href: "/lead-generation" },
      { name: "SEO", href: "/seo-services" },
      { name: "Campaigns", href: "/digital-marketing" },
    ],
    ctaText: "Explore Marketing",
    ctaHref: "/digital-marketing",
  },
];

export function AgencyPillars() {
  return (
    <section className="py-20 md:py-24 bg-[#080a0e] text-white relative overflow-hidden border-b border-white/10">
      {/* Background Subtle Grid & Circuits */}
      <div className="absolute inset-0 circuit-pattern-dark opacity-25 pointer-events-none" />

      {/* Decorative center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial from-[#f36b21]/8 via-transparent to-transparent blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-2.5">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
            HOW WE PARTNER WITH YOU
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-white leading-tight">
            One Integrated Digital Partner
          </h2>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl mx-auto font-sans">
            We unite engineering, content, and performance marketing so your business doesn&apos;t have to manage disconnected vendors.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.key}
                className="bg-[#0c0e14] rounded-2xl p-7 border border-white/10 hover:border-[#f36b21]/40 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)] group hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl ${pillar.accentBg} border ${pillar.accentBorder} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${pillar.badgeText}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Pillar Heading & Tagline */}
                  <h3 className="font-serif-heading text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-[#f36b21] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed mb-6 font-medium">
                    {pillar.tagline}
                  </p>

                  {/* Bulleted Capabilities */}
                  <ul className="space-y-2.5 pb-6 border-b border-white/5">
                    {pillar.items.map((item) => (
                      <li key={item.name} className="flex items-center gap-2.5 text-xs text-white/80">
                        <span className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#f36b21] shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <Link
                          href={item.href}
                          className="hover:text-[#f36b21] hover:underline underline-offset-4 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Link */}
                <div className="pt-5">
                  <Link
                    href={pillar.ctaHref}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#c5a880] group-hover:text-[#f36b21] transition-colors"
                  >
                    <span>{pillar.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
