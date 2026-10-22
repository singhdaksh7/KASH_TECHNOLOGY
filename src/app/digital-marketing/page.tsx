import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  TrendingUp, 
  Target, 
  Search, 
  Share2, 
  BarChart3, 
  CheckCircle2, 
  Zap 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Full-Funnel Digital Marketing Services | KASH Technology",
  description: "Digital marketing built around growth. Multi-channel campaign strategy, performance ads, lead funnels, SEO, content marketing, and conversion optimization.",
  alternates: {
    canonical: "/digital-marketing",
  },
  openGraph: {
    title: "Full-Funnel Digital Marketing Services | KASH Technology",
    description: "Integrated digital marketing combining campaign strategy, performance advertising, SEO, and lead automation for sustainable growth.",
    url: "https://kash-technology.com/digital-marketing",
  },
};

const MARKETING_PILLARS = [
  {
    title: "Comprehensive Campaign Strategy",
    description: "Full-funnel blueprints aligning your audience personas, competitive advantages, messaging pillars, and commercial objectives before spending a dollar.",
    icon: Target,
  },
  {
    title: "Performance Marketing & Paid Ads",
    description: "Targeted customer acquisition on Meta (Facebook & Instagram) and Google Ads engineered with disciplined budget allocation and audience segmentation.",
    icon: Zap,
  },
  {
    title: "Lead Generation & Funnel Architecture",
    description: "High-speed landing pages paired with automated CRM routing and instant WhatsApp alerts that turn anonymous clicks into qualified inquiries.",
    icon: TrendingUp,
  },
  {
    title: "Search Engine Optimization (SEO)",
    description: "Technical audit foundation, high-intent keyword mapping, on-page optimization, and internal link structures that build enduring organic visibility.",
    icon: Search,
  },
  {
    title: "Social Media & Content Marketing",
    description: "Active multi-platform presence, authority-building articles, and branded visual creatives that nurture prospects across the buyer journey.",
    icon: Share2,
  },
  {
    title: "Conversion Optimization & Analytics",
    description: "Continuous landing page A/B testing, heatmaps, form abandonment audits, and server-side conversion tracking for maximum return on spend.",
    icon: BarChart3,
  },
];

const MARKETING_PROCESS = [
  {
    number: "01",
    title: "Growth Audit & Opportunity Map",
    description: "We analyze your existing traffic channels, conversion bottlenecks, competitive positioning, and customer acquisition costs.",
  },
  {
    number: "02",
    title: "Full-Funnel Infrastructure",
    description: "We configure tracking pixels, build tailored high-converting landing pages, and establish automated CRM lead routing.",
  },
  {
    number: "03",
    title: "Campaign Launch & Controlled Scaling",
    description: "We launch paid and organic campaigns with rigorous budget controls, testing audiences and creative hooks methodically.",
  },
  {
    number: "04",
    title: "Optimization & Attribution",
    description: "We review real business leads, optimize ad delivery towards high-value prospects, and refine funnels based on verified revenue data.",
  },
];

const MARKETING_FAQS = [
  {
    question: "How does KASH Technology approach digital marketing differently?",
    answer: "Most marketing agencies lack technical capability; most web developers lack marketing sense. KASH Technology bridges both. We build the fast landing pages, set up the tracking infrastructure, write the ad copy, and automate the CRM handoff in one seamless ecosystem.",
  },
  {
    question: "Do you guarantee specific ROAS or revenue numbers?",
    answer: "No, we strictly avoid unsubstantiated marketing hype or false guarantees. Success depends on product-market fit, pricing, and market conditions. What we commit to is transparent reporting, disciplined testing, and high-performance technical execution.",
  },
  {
    question: "What platforms do you advertise on?",
    answer: "We primarily run campaigns on Meta Ads (Instagram and Facebook) and Google Search & Display, supplemented by LinkedIn Ads for select B2B and enterprise software clients.",
  },
  {
    question: "How do we receive updates on campaign performance?",
    answer: "You receive clean, transparent weekly or monthly dashboards focusing on metrics that matter: cost per lead, qualified inquiries, click-through rates, and conversion volumes.",
  },
];

export default function DigitalMarketingPage() {
  return (
    <>
      <HeroDiagonal
        badge="INTEGRATED DIGITAL MARKETING"
        titlePrimary="Digital Marketing Built"
        titleAccent="Around Growth"
        description="Campaign strategy, performance advertising, lead generation funnels, SEO, and conversion optimization — integrated seamlessly with your technology."
        primaryCtaText="Plan Your Growth Strategy"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Performance Marketing"
        secondaryCtaHref="/performance-marketing"
        breadcrumbs={[
          { label: "Marketing", href: "/digital-marketing" },
          { label: "Digital Marketing" },
        ]}
      />

      {/* Offerings Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              FULL-FUNNEL ARCHITECTURE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Cohesive Marketing from Awareness to Conversion
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              Connecting ads, organic search, creative assets, and conversion engineering into an integrated commercial engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MARKETING_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-7 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(243,107,33,0.1)] hover:border-[#f36b21]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#f36b21]/10 border border-[#f36b21]/20 flex items-center justify-center text-[#f36b21] mb-5 group-hover:bg-[#f36b21] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-2.5 group-hover:text-[#f36b21] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process on Dark */}
      <ProcessSteps
        badge="THE ROADMAP"
        title="Our Growth Execution Framework"
        steps={MARKETING_PROCESS}
        variant="dark"
      />

      {/* Technology + Marketing Differentiator on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              THE UNFAIR ADVANTAGE
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Marketing Backed by Software Engineering
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              Great marketing cannot survive a slow website or broken lead capture. Because we are engineers first, we engineer sub-second landing page speed, pristine tracking event data, and instant CRM synchronization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Next.js headless landing pages with 95+ performance scores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Direct CRM & WhatsApp business integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Server-side Meta Conversions API (CAPI) setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Transparent metrics with zero vanity jargon</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FaqAccordion
        badge="QUESTIONS"
        title="Frequently Asked Questions"
        faqs={MARKETING_FAQS}
        variant="dark"
      />

      {/* CTA Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build a Predictable Growth Engine?"
        subtitle="Let's align your marketing strategy, creative assets, and lead infrastructure to drive measurable business growth."
        buttonText="Plan Your Growth Strategy"
        buttonHref="/contact"
      />
    </>
  );
}
