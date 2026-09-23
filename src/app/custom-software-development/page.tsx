import type { Metadata } from "next";
import Link from "next/link";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { IndustryGrid } from "@/components/sections/IndustryGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Cpu, Database, Network, ShieldCheck, Cog, LineChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Software Development Company in Delhi NCR & Western UP | KASH Technology",
  description: "Bespoke software development, custom business software, ERP systems, CRM platforms, and workflow automation engineered for businesses across Delhi NCR, Noida, Meerut, Ghaziabad, and Western UP.",
  alternates: {
    canonical: "/custom-software-development",
  },
  openGraph: {
    title: "Custom Software Development Company in Delhi NCR & Western UP | KASH Technology",
    description: "Enterprise-grade custom software, ERP, CRM, and workflow automation built by lead engineers.",
    url: "https://kash-technology.com/custom-software-development",
  },
};

const SOFTWARE_CAPABILITIES = [
  {
    title: "Multi-Tenant SaaS Architecture",
    description: "Isolated database schemas, tenant routing, role-based access control, and automated subscription billing.",
    icon: Database,
  },
  {
    title: "High-Throughput APIs & Microservices",
    description: "RESTful, GraphQL, and event-driven architectures designed to process millions of requests with low latency.",
    icon: Network,
  },
  {
    title: "Complex Business Automation",
    description: "Eliminate repetitive manual operations with intelligent background worker queues, cron jobs, and ERP connectors.",
    icon: Cog,
  },
  {
    title: "Real-Time Telemetry & Dashboards",
    description: "WebSocket streaming, live analytical visualization, and instant data synchronization across client sessions.",
    icon: LineChart,
  },
  {
    title: "Enterprise Security & Compliance",
    description: "End-to-end cryptographic encryption, SOC2-ready access logging, automated vulnerability scanning, and audit trails.",
    icon: ShieldCheck,
  },
  {
    title: "Cloud Infrastructure as Code",
    description: "Terraform and Docker containerization ensuring reliable multi-region staging and zero-downtime production deploys.",
    icon: Cpu,
  },
];

export default function CustomSoftwareDevelopmentPage() {
  return (
    <>
      <HeroDiagonal
        badge="CUSTOM SOFTWARE COMPANY"
        titlePrimary="Custom Software Development Company in"
        titleAccent="Delhi NCR & Western UP"
        description="We engineer bespoke business software, custom ERP platforms, CRM systems, SaaS applications, and workflow automation tools tailored to your operational realities. Direct collaboration with senior engineers from day one."
        primaryCtaText="Consult an Architect"
        primaryCtaHref="/contact"
        secondaryCtaText="View Portfolio"
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
          { label: "Custom Software Development" },
        ]}
      />

      {/* Capabilities on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Engineered for Mission-Critical Reliability
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOFTWARE_CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e86024]/10 border border-[#e86024]/20 flex items-center justify-center text-[#e86024] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Industry Expertise */}
      <IndustryGrid />

      {/* Engineering Process */}
      <ProcessSteps
        badge="DEVELOPMENT CYCLE"
        title="Predictable, Transparent Software Delivery"
        subtitle="From initial architecture design docs to automated deployment and SLA monitoring."
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
                Specialized Enterprise Modules
              </h3>
              <ul className="space-y-2 text-[#9ca3af]">
                <li>
                  <Link href="/erp-development" className="hover:text-white transition-colors">
                    Custom ERP Systems Development →
                  </Link>
                </li>
                <li>
                  <Link href="/crm-development" className="hover:text-white transition-colors">
                    Custom CRM Platforms →
                  </Link>
                </li>
                <li>
                  <Link href="/business-automation" className="hover:text-white transition-colors">
                    Business Workflow Automation →
                  </Link>
                </li>
                <li>
                  <Link href="/saas-development" className="hover:text-white transition-colors">
                    Multi-Tenant SaaS Engineering →
                  </Link>
                </li>
                <li>
                  <Link href="/api-integration" className="hover:text-white transition-colors">
                    APIs & Microservice Integration →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Verified Engineering Case Studies
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
                    BSC Crypto Launchpad — Automated Contracts →
                  </Link>
                </li>
                <li>
                  <Link href="/website-development" className="hover:text-white transition-colors">
                    High-Performance Website Development →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Regional Service Coverage
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
        title="Ready to Build Your Custom Software System?"
        subtitle="Schedule a direct technical consultation with our engineering team today."
        buttonText="Book an Architecture Call"
        buttonHref="/contact"
      />
    </>
  );
}
