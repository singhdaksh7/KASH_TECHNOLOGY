import type { Metadata } from "next";
import Link from "next/link";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { TechStackStrip } from "@/components/sections/TechStackStrip";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Business Process Automation & Software Engineering | KASH Technology",
  description: "Business process automation services for companies across Delhi NCR. Eliminate manual spreadsheet entries, paper approvals, and repetitive tasks.",
  alternates: {
    canonical: "/business-automation",
  },
  openGraph: {
    title: "Business Process Automation & Software Engineering | KASH Technology",
    description: "Business process automation services for companies across Delhi NCR. Eliminate manual spreadsheet entries, paper approvals, and repetitive tasks.",
    url: "https://kash-technology.com/business-automation",
  },
};

const FEATURES = [
  {
    "title": "Spreadsheet-to-Cloud Database Migration",
    "desc": "Transform fragile Excel files into secure, multi-user web databases with relational integrity and automatic backups."
  },
  {
    "title": "Automated PDF Report & Invoice Generation",
    "desc": "Background microservices that automatically generate branded PDF statements, certificates, and challans on schedule."
  },
  {
    "title": "Webhook & Event-Driven Pipelines",
    "desc": "Instant data transmission between forms, payment gateways, messaging tools, and backend databases."
  },
  {
    "title": "Approval Workflows & Email Alerts",
    "desc": "Multi-tier manager approval chains with one-click email/WhatsApp authorization buttons for purchase orders and leaves."
  },
  {
    "title": "Automated Bank Reconciliation",
    "desc": "Parse bank statement CSVs and auto-reconcile customer payments against open invoices with fuzzy matching algorithms."
  },
  {
    "title": "Operational Health & Telemetry Alerts",
    "desc": "Automated notifications sent to leadership if critical business KPIs, shipments, or server metrics fall below thresholds."
  }
];

const FAQS = [
  {
    "question": "What business processes are best suited for automation?",
    "answer": "Any task where staff manually copy data from one system to another, retype invoices, send routine follow-up emails, or balance spreadsheets is an ideal candidate for automation."
  },
  {
    "question": "How quickly do we see return on investment from automation?",
    "answer": "Most businesses recoup their investment within 2 to 4 months through reduced administrative hours, eliminated data-entry errors, and faster billing cycles."
  }
];

export default function ServicePage() {
  return (
    <>
      {/* 1. Hero with Breadcrumbs */}
      <HeroDiagonal
        badge="WORKFLOW DIGITIZATION"
        titlePrimary="End-to-End Business Automation for"
        titleAccent="High-Efficiency Operations"
        description="We engineer custom software pipelines that connect your disconnected tools, eliminate repetitive spreadsheet copying, automate invoice dispatch, and give your team hours of productive time back every week."
        primaryCtaText="Consult an Architect"
        primaryCtaHref="/contact"
        secondaryCtaText="View Portfolio"
        secondaryCtaHref="/portfolio"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "High-Efficiency Operations" },
        ]}
        quickLinks={[
          { label: "Delhi NCR", href: "/delhi-ncr" },
          { label: "Noida", href: "/noida" },
          { label: "Meerut", href: "/meerut" },
          { label: "Ghaziabad", href: "/ghaziabad" },
          { label: "Baghpat", href: "/baghpat" },
        ]}
      />

      {/* 2. Features on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Engineered for Production Resilience
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#e86024]/10 border border-[#e86024]/20 flex items-center justify-center text-[#e86024] mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-black/5 text-[10px] font-mono text-[#e86024] font-semibold">
                  CORE SPECIFICATION
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Tech Stack */}
      <TechStackStrip />

      {/* 4. Engineering Process */}
      <ProcessSteps
        badge="DELIVERY LIFECYCLE"
        title="From Architecture Blueprint to Production"
        subtitle="Transparent weekly sprint demos, staging environments, and direct developer communication."
      />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Regional Coverage & Cross-links */}
      <section className="py-16 bg-[#0c0c10] border-t border-white/5 text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider mb-4">
                Other Engineering Services
              </h3>
              <ul className="space-y-2 text-[#9ca3af]">
                <li>
                  <Link href="/website-development" className="hover:text-white transition-colors">
                    Website Development →
                  </Link>
                </li>
                <li>
                  <Link href="/custom-software-development" className="hover:text-white transition-colors">
                    Custom Software Development →
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app-development" className="hover:text-white transition-colors">
                    Mobile App Development →
                  </Link>
                </li>
                <li>
                  <Link href="/erp-development" className="hover:text-white transition-colors">
                    Custom ERP Systems →
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
                    Exora — Cryptocurrency Trading Exchange →
                  </Link>
                </li>
                <li>
                  <Link href="/work/crypto-launchpad" className="hover:text-white transition-colors">
                    BSC Crypto Launchpad — Automated Contracts →
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

      {/* 7. FAQs */}
      <FaqAccordion
        variant="ivory"
        faqs={FAQS}
        title="Frequently Asked Questions"
        badge="TECHNICAL QUESTIONS"
      />

      {/* 8. Conversion Banner */}
      <CtaBanner
        variant="dark"
        title="Let's Build Your Production Software"
        subtitle="Schedule a direct technical consultation with our engineering team today."
        buttonText="Consult an Architect"
        buttonHref="/contact"
      />
    </>
  );
}
