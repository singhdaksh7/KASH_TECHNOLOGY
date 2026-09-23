import type { Metadata } from "next";
import Link from "next/link";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { TechStackStrip } from "@/components/sections/TechStackStrip";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Code, Zap, Shield, Sparkles, Layers, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Development Company in Delhi NCR & Western UP | KASH Technology",
  description: "Custom website development, business websites, e-commerce platforms, and performant web applications engineered for businesses across Delhi NCR, Noida, Meerut, Ghaziabad, and Western UP.",
  alternates: {
    canonical: "/website-development",
  },
  openGraph: {
    title: "Website Development Company in Delhi NCR & Western UP | KASH Technology",
    description: "High-performance business website development, custom web applications, and e-commerce platforms engineered to scale.",
    url: "https://kash-technology.com/website-development",
  },
};

const WEB_FEATURES = [
  {
    title: "Next.js & React Architecture",
    description: "Server-side rendered and static architectures providing sub-second load times, superior indexability, and flawless SEO rankings.",
    icon: Code,
  },
  {
    title: "Core Web Vitals Optimization",
    description: "Every page is engineered for perfect 95+ Google Lighthouse scores, zero layout shift, and instant responsiveness across mobile and desktop.",
    icon: Zap,
  },
  {
    title: "Enterprise Security",
    description: "Hardened Content Security Policies, sanitized inputs, CSRF defense, and strict TLS encryption standards for total data integrity.",
    icon: Shield,
  },
  {
    title: "E-Commerce & Payment Gateways",
    description: "Custom storefronts with frictionless checkout, Razorpay, Stripe, and automated invoice reconciliation built for high transaction conversion.",
    icon: Layers,
  },
  {
    title: "Global Edge Delivery",
    description: "Distributed edge deployments through Vercel and AWS CloudFront for instantaneous regional and international asset delivery.",
    icon: Globe,
  },
  {
    title: "Bespoke Web Application Engineering",
    description: "Interactive client portals, admin dashboards, and custom business tools that automate workflows and replace off-the-shelf limits.",
    icon: Sparkles,
  },
];

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <HeroDiagonal
        badge="WEBSITE DEVELOPMENT AGENCY"
        titlePrimary="Website Development Company in"
        titleAccent="Delhi NCR & Western UP"
        description="We build fast, secure, and conversion-focused business websites, custom web applications, and e-commerce platforms. Partner directly with lead engineers to turn your digital presence into an unfair commercial advantage."
        primaryCtaText="Start Your Web Project"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Portfolio"
        secondaryCtaHref="/portfolio"
        quickLinks={[
          { label: "Delhi NCR", href: "/delhi-ncr" },
          { label: "Noida", href: "/noida" },
          { label: "Meerut", href: "/meerut" },
          { label: "Ghaziabad", href: "/ghaziabad" },
          { label: "Baghpat", href: "/baghpat" },
        ]}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Website Development" },
        ]}
      />

      {/* Web Features Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              CAPABILITIES
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Engineered for Speed, Scale & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {WEB_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e86024]/10 border border-[#e86024]/20 flex items-center justify-center text-[#e86024] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Tech Stack */}
      <TechStackStrip />

      {/* Process */}
      <ProcessSteps
        badge="WEB LIFECYCLE"
        title="From Wireframe to Production Launch"
        subtitle="Agile sprint execution with full staging environments and automated testing."
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* FAQs */}
      <FaqAccordion />

      {/* Internal Linking & Service Areas */}
      <section className="py-16 bg-[#0c0c10] border-t border-white/5 text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Related Capabilities
              </h3>
              <ul className="space-y-2 text-[#9ca3af]">
                <li>
                  <Link href="/custom-software-development" className="hover:text-white transition-colors">
                    Custom Software Development →
                  </Link>
                </li>
                <li>
                  <Link href="/ecommerce-development" className="hover:text-white transition-colors">
                    E-Commerce Website Development →
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app-development" className="hover:text-white transition-colors">
                    Mobile App Engineering →
                  </Link>
                </li>
                <li>
                  <Link href="/saas-development" className="hover:text-white transition-colors">
                    SaaS Platform Development →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Verified Case Studies
              </h3>
              <ul className="space-y-2 text-[#9ca3af]">
                <li>
                  <Link href="/work/schoolsync" className="hover:text-white transition-colors">
                    SchoolSync — Multi-Tenant School ERP →
                  </Link>
                </li>
                <li>
                  <Link href="/work/exora" className="hover:text-white transition-colors">
                    Exora — Cryptocurrency Trading Platform →
                  </Link>
                </li>
                <li>
                  <Link href="/work/crypto-launchpad" className="hover:text-white transition-colors">
                    BSC Crypto Launchpad — Decentralized Web3 →
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-white transition-colors">
                    View Complete Portfolio Showcase →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Areas We Serve
              </h3>
              <p className="text-xs text-[#9ca3af] mb-3">
                Serving businesses across Delhi NCR & Western Uttar Pradesh:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Delhi NCR", href: "/delhi-ncr" },
                  { name: "Noida", href: "/noida" },
                  { name: "Greater Noida", href: "/greater-noida" },
                  { name: "Ghaziabad", href: "/ghaziabad" },
                  { name: "Meerut", href: "/meerut" },
                  { name: "Baghpat", href: "/baghpat" },
                  { name: "Baraut", href: "/baraut" },
                  { name: "Western UP", href: "/western-up" },
                ].map((loc) => (
                  <Link
                    key={loc.href}
                    href={loc.href}
                    className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#e86024]/40 hover:text-[#e86024] transition-colors"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <CtaBanner
        variant="dark"
        title="Ready to Build a High-Performing Website?"
        subtitle="Let's engineer a digital platform that converts visitors into long-term clients."
        buttonText="Get a Project Quote"
        buttonHref="/contact"
      />
    </>
  );
}
