import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Zap, 
  Target, 
  Layers, 
  Search, 
  CheckCircle2, 
  Sliders, 
  FileText 
} from "lucide-react";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const baseMetadata: Metadata = {
  title: "Performance Marketing Services | Meta & Google Ads | KASH Technology",
  description: "Disciplined performance marketing on Meta Ads and Google Ads. Campaign strategy, audience targeting, conversion landing pages, and transparent reporting.",
  alternates: {
    canonical: "/performance-marketing",
  },
  openGraph: {
    title: "Performance Marketing Services | Meta & Google Ads | KASH Technology",
    description: "Data-driven paid advertising on Meta and Google Ads paired with high-conversion landing page engineering.",
    url: "https://kash-technology.com/performance-marketing",
  },
};

const PERFORMANCE_PILLARS = [
  {
    title: "Meta Ads (Facebook & Instagram)",
    description: "Multi-layered prospecting, lookalike modeling, and dynamic retargeting campaigns built around high-retention video creatives and carousels.",
    icon: Target,
  },
  {
    title: "Google Search & Intent Ads",
    description: "Capturing high-intent prospective buyers actively searching for your services with structured keyword bidding, negative keyword filtering, and ad copy testing.",
    icon: Search,
  },
  {
    title: "Campaign Strategy & Funnel Planning",
    description: "Mapping the complete customer journey from initial impression to consideration and final purchase, aligning budget weights across each funnel stage.",
    icon: Layers,
  },
  {
    title: "Custom High-Speed Landing Pages",
    description: "Bespoke Next.js landing pages built specifically for ad campaigns that load in milliseconds, eliminate distractions, and maximize form completion.",
    icon: Zap,
  },
  {
    title: "Audience Segmentation & Targeting",
    description: "Granular audience exclusions, custom CRM list uploads, and demographic filters that prevent budget waste on unqualified clicks.",
    icon: Sliders,
  },
  {
    title: "Transparent Attribution & Reporting",
    description: "Clear weekly reporting focused on genuine inquiries and customer acquisition metrics, backed by server-side Meta Conversions API (CAPI).",
    icon: FileText,
  },
];

const PERFORMANCE_STEPS = [
  {
    number: "01",
    title: "Tracking Infrastructure Audit",
    description: "We configure server-side tracking, Google Tag Manager, and Meta Conversions API to ensure 100% data integrity before running ads.",
  },
  {
    number: "02",
    title: "Creative & Copy Development",
    description: "We design ad creatives, test multiple hook variations, and write clear, persuasive copy aligned with your value proposition.",
  },
  {
    number: "03",
    title: "Controlled Budget Launch",
    description: "We launch campaigns with disciplined initial testing budgets, isolating audience segments to identify winning combinations.",
  },
  {
    number: "04",
    title: "Optimization & Strategic Scaling",
    description: "We reallocate budget toward top-performing ad sets, pause underperforming assets, and optimize post-click landing page conversion.",
  },
];

const PERFORMANCE_FAQS = [
  {
    question: "Do you take a percentage of ad spend or a flat fee?",
    answer: "We offer transparent flat monthly management retainers based on campaign scope and channels managed. You pay the ad networks (Meta and Google) directly through your own ad account, ensuring complete ownership and billing transparency.",
  },
  {
    question: "Why do you emphasize landing page engineering alongside ads?",
    answer: "Because over 50% of ad budgets are wasted sending traffic to slow, confusing websites. By building lightweight, dedicated landing pages that load instantly, we give your ad spend the highest possible chance of conversion.",
  },
  {
    question: "What is the recommended minimum ad budget?",
    answer: "We recommend a testing budget that allows for statistically significant data in your market segment, typically starting at ₹30,000 to ₹50,000 monthly for local/regional campaigns, scaling as performance validates.",
  },
  {
    question: "Do I own my ad account and data?",
    answer: "Always. All campaigns are built inside your company's own Meta Business Manager and Google Ads accounts. You retain full ownership of all data, pixels, and creative assets at all times.",
  },
];

function PerformanceMarketingPage() {
  return (
    <>
      <HeroDiagonal
        badge="DISCIPLINED PAID ACQUISITION"
        titlePrimary="Performance Marketing"
        titleAccent="Built for Efficiency"
        description="Data-driven paid campaigns across Meta and Google Ads, paired with high-converting custom landing pages and transparent performance tracking."
        primaryCtaText="Launch Your Ad Strategy"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Lead Generation"
        secondaryCtaHref="/lead-generation"
        breadcrumbs={[
          { label: "Marketing", href: "/digital-marketing" },
          { label: "Performance Marketing" },
        ]}
      />

      {/* Services Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              ADVERTISING METHODOLOGY
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Disciplined Paid Traffic Management
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We eliminate ad waste through tight targeting, server-side tracking, and dedicated conversion landing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PERFORMANCE_PILLARS.map((item) => {
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

      {/* Execution Steps on Dark */}
      <ProcessSteps
        badge="THE WORKFLOW"
        title="Our Campaign Lifecycle"
        steps={PERFORMANCE_STEPS}
        variant="dark"
      />

      {/* Ethics & Standards on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              INTEGRITY FIRST
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Real Reporting. Zero Fabricated Claims.
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              We never fabricate screenshots, ROAS guarantees, or imaginary ad spend numbers. Paid marketing is an iterative process governed by data, message-market resonance, and technical rigor.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Client owns 100% of ad accounts and audience data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Server-side Meta Conversions API (CAPI) compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Dedicated custom landing page for each campaign</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Regular review calls with lead campaign strategists</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FaqAccordion
        badge="FAQS"
        title="Frequently Asked Questions"
        faqs={PERFORMANCE_FAQS}
        variant="dark"
      />

      {/* CTA */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build High-Yield Paid Campaigns?"
        subtitle="Let's build a disciplined paid acquisition framework that attracts qualified customers without wasting ad spend."
        buttonText="Launch Your Ad Strategy"
        buttonHref="/contact"
      />
    </>
  );
}

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/performance-marketing", pageType: "service", Fallback: PerformanceMarketingPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
