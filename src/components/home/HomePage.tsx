"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading, StudioButton, CaseStudyRow } from "@/components/public-ui";
import { HeroTypewriter } from "./HeroTypewriter";
import { ReviewTicker } from "./ReviewTicker";
import { HeroProductComposition } from "./HeroProductComposition";
import { CapabilityShowcaseInteractive } from "./CapabilityShowcaseInteractive";
import { TechnologyStack } from "./TechnologyStack";
import { ConnectedDigitalEcosystem } from "./ConnectedDigitalEcosystem";
import { InteractiveIndustrySolutions } from "./InteractiveIndustrySolutions";
import { EngineeringInfrastructure } from "./EngineeringInfrastructure";

export function HomePage() {
  const FEATURED_STUDIES = [
    {
      number: "01",
      title: "FuelOps Enterprise",
      category: "ERP & Operations",
      tagline: "Real-time pump sales, automated settlements, and fuel station logistics.",
      challenge: "Managing multi-station fuel dealerships with paper ledgers and disconnected spreadsheets created daily inventory reconciliation errors and slow audit cycles.",
      solution: "Engineered a centralized web and mobile ERP with shift-level nozzle metering, digital credit reconciliation, and automated daily bank deposit telemetry.",
      capabilities: ["Custom ERP", "Next.js Architecture", "Shift Settlement", "PostgreSQL"],
      image: "/images/projects/fuelops-mockup.png",
      href: "/contact",
      statusType: "CONCEPT" as const,
    },
    {
      number: "02",
      title: "Launchpad X Protocol",
      category: "Web3 & Financial Tech",
      tagline: "Decentralized token launch architecture and audit-grade smart contract UI.",
      challenge: "High-traffic token presales experience extreme concurrency spikes and malicious bots that compromise fairness and interface uptime.",
      solution: "Architected a server-rendered real-time token claim interface backed by resilient edge caching, Web3 wallet adapters, and cryptographic proof verification.",
      capabilities: ["Web3 Architecture", "Sub-second Edge", "Smart Contract UI", "High Concurrency"],
      image: "/images/projects/launchpad-mockup.png",
      href: "/work/crypto-launchpad",
      statusType: "PROTOTYPE" as const,
      reverse: true,
    },
    {
      number: "03",
      title: "SchoolSync Platform",
      category: "Education & SaaS",
      tagline: "Comprehensive student admissions, automated fee invoicing, and attendance.",
      challenge: "Independent educational institutions struggled with fragmented software across fee counters, teacher diaries, and parent communication channels.",
      solution: "Delivered a unified SaaS workspace combining student lifecycles, automated WhatsApp/SMS fee alerts, and class performance analytics.",
      capabilities: ["Multi-Tenant SaaS", "Role-Based Access", "Fee Invoicing", "Mobile PWA"],
      image: "/images/projects/schoolsync-mockup.png",
      href: "/work/schoolsync",
      statusType: "PROTOTYPE" as const,
    },
    {
      number: "04",
      title: "TaxiSegrator Network",
      category: "Logistics & Marketplace",
      tagline: "Intercity fleet allocation and driver dispatch marketplace for travel operators.",
      challenge: "B2B taxi dispatchers required seamless peer-to-peer route allocation without phone call bottlenecks and disputed margin calculations.",
      solution: "Built a responsive dispatcher application with instant trip bidding, driver verification, and transparent trip settlement records.",
      capabilities: ["Marketplace Logic", "Mobile Experience", "Driver Verification", "Instant Bidding"],
      image: "/images/projects/taxisegrator-mockup.png",
      href: "/contact",
      statusType: "CONCEPT" as const,
      reverse: true,
    },
  ];

  const PROCESS_STEPS = [
    {
      step: "01",
      title: "Discover & Scope",
      desc: "We analyze your commercial model, customer touchpoints, and technical requirements before writing a single line of code.",
    },
    {
      step: "02",
      title: "Design & Prototype",
      desc: "Interactive wireframes and high-fidelity design systems establish exact UX flows, visual hierarchy, and brand positioning.",
    },
    {
      step: "03",
      title: "Engineer & Build",
      desc: "Robust Next.js, Node.js, and relational database systems built with clean architecture, strict security, and comprehensive test coverage.",
    },
    {
      step: "04",
      title: "Deploy & Scale",
      desc: "Production deployments on hardened cloud infrastructure with monitoring, automated backups, and 95+ Core Web Vitals.",
    },
    {
      step: "05",
      title: "Grow & Distribute",
      desc: "We stay as your digital partner — managing SEO authority, targeted acquisition funnels, and ongoing feature iterations.",
    },
  ];

  return (
    <div className="bg-[#FFF9F4] text-[#0B0B0F] pt-[73px]">
      
      {/* ============================================================== */}
      {/* 2. CLIENT REVIEW TICKER (DIRECTLY BELOW UPPER NAV & ABOVE HERO) */}
      {/* ============================================================== */}
      <ReviewTicker />

      {/* ============================================================== */}
      {/* 3. CINEMATIC ANIMATED HERO                                     */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Stripe-inspired subtle animated warm background mesh */}
        <div 
          className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-[#FF5A00]/8 via-[#FF8A3D]/4 to-transparent pointer-events-none rounded-bl-[120px]" 
          aria-hidden="true" 
        />
        
        <Container className="relative z-10">
          <HeroTypewriter />

          {/* 4. INTERACTIVE PRODUCT COMPOSITION (Replaces generic laptop) */}
          <HeroProductComposition />
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE BUILD / CREATE / GROW CAPABILITY SHOWCASE       */}
      {/* ============================================================== */}
      <CapabilityShowcaseInteractive />

      {/* ============================================================== */}
      {/* 6. THE KASH TECHNOLOGY STACK (SCROLL-DRIVEN ARCHITECTURE)      */}
      {/* ============================================================== */}
      <TechnologyStack />

      {/* ============================================================== */}
      {/* 7. CONNECTED DIGITAL ECOSYSTEM                                 */}
      {/* ============================================================== */}
      <ConnectedDigitalEcosystem />

      {/* ============================================================== */}
      {/* 7. FEATURED CASE STUDIES (EDITORIAL DARK SHOWCASE)             */}
      {/* ============================================================== */}
      <section className="py-24 lg:py-32 bg-[#0B0B0F] text-white border-t border-white/10 relative overflow-hidden">
        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF5A00] text-xs font-mono font-bold tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                Selected Case Studies
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Engineering in action.
              </h2>
            </div>
            <p className="text-stone-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
              We design and ship high-retention software architectures, enterprise portals, and bespoke web platforms.
            </p>
          </div>

          <div className="space-y-24 lg:space-y-36">
            {FEATURED_STUDIES.map((study) => (
              <CaseStudyRow
                key={study.title}
                number={study.number}
                title={study.title}
                category={study.category}
                tagline={study.tagline}
                challenge={study.challenge}
                solution={study.solution}
                capabilities={study.capabilities}
                image={study.image}
                href={study.href}
                reverse={study.reverse}
              />
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Have a similar architectural challenge?</h3>
              <p className="text-sm text-stone-400">Our engineering leads provide direct technical evaluations within 24 hours.</p>
            </div>
            <StudioButton href="/portfolio" variant="secondary" size="lg">
              Explore All Case Studies
            </StudioButton>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 8. INDUSTRY-SPECIFIC ARCHITECTURE SOLUTIONS                    */}
      {/* ============================================================== */}
      <InteractiveIndustrySolutions />

      {/* ============================================================== */}
      {/* 9. 5-STEP DELIVERY FRAMEWORK                                   */}
      {/* ============================================================== */}
      <section className="py-24 bg-white border-b border-[#E8E5E2]">
        <Container>
          <div className="max-w-2xl mb-16">
            <SectionHeading
              eyebrow="Execution Framework"
              title="Predictable velocity from specification to deployment."
              description="Our delivery process combines agile sprint cycles with strict engineering reviews to prevent scope creep."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-4 hover:border-[#FF5A00]/40 transition-colors"
              >
                <div className="font-mono text-3xl font-extrabold text-[#FF5A00]">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-[#0B0B0F]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 10. ENGINEERING & INFRASTRUCTURE RIGOR                         */}
      {/* ============================================================== */}
      <EngineeringInfrastructure />

      {/* ============================================================== */}
      {/* 11. STRATEGIC NARRATIVE (ABOUT PREVIEW)                        */}
      {/* ============================================================== */}
      <section className="py-24 bg-white border-b border-[#E8E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-semibold">
                OUR PHILOSOPHY // ENGINEERING &bull; CREATIVE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0B0F] leading-tight">
                Software craftsmanship without the agency runaround.
              </h2>
              <p className="text-base text-[#4B5563] leading-relaxed font-normal">
                Most agencies force founders into an expensive compromise: software developers who can&apos;t design, or design agencies that write fragile code.
              </p>
              <p className="text-base text-[#4B5563] leading-relaxed font-normal">
                KASH Technology bridges this gap. Led directly by technical founders, we take pride in shipping robust code, measurable customer acquisition, and high-retention brand assets.
              </p>
              <div className="pt-2">
                <StudioButton href="/about" variant="dark">
                  Read Our Studio Story
                </StudioButton>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 rounded-3xl bg-[#FFF9F4] border border-[#E8E5E2] space-y-6">
              <div className="text-xs font-mono font-bold text-[#FF5A00] uppercase tracking-wider">
                Direct Collaboration Principles
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B0B0F]">Direct Founder &amp; Architect Access</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">No junior account managers or endless intermediary ticket queues.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B0B0F]">Deterministic Milestones &amp; Code Ownership</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">Complete intellectual property and source code handover upon completion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B0B0F]">Continuous Production Staging</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">Inspect and test your product on private staging environments at every sprint.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 12. FINAL CONVERSION SECTION                                   */}
      {/* ============================================================== */}
      <section className="py-24 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Ready to move your business forward?
            </h2>
            <p className="text-lg text-white/90 leading-relaxed font-normal">
              Whether you need to architect custom software, automate enterprise operations, or launch a category-defining brand, our studio is ready.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-[#0B0B0F] text-white font-bold text-sm hover:bg-black transition-all shadow-xl inline-flex items-center gap-2"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl bg-white text-[#0B0B0F] font-bold text-sm hover:bg-[#FFF3E9] transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Explore Our Work</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
