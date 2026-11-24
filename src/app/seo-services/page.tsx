import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Search, 
  MapPin, 
  Code, 
  FileCode, 
  BarChart3, 
  Zap, 
  CheckCircle2 
} from "lucide-react";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const baseMetadata: Metadata = {
  title: "Technical & Local SEO Services | KASH Technology",
  description: "Improve search visibility and organic discovery. Technical SEO audits, local Google Business optimization, schema markup, Core Web Vitals, and content planning.",
  alternates: {
    canonical: "/seo-services",
  },
  openGraph: {
    title: "Technical & Local SEO Services | KASH Technology",
    description: "Search engine optimization grounded in code quality, site speed, local business visibility, and structured data.",
    url: "https://kash-technology.com/seo-services",
  },
};

const SEO_CAPABILITIES = [
  {
    title: "Technical SEO & Site Architecture",
    description: "Resolving crawl errors, canonical duplicates, XML sitemaps, robots directives, and rendering bottlenecks so search engines index your site cleanly.",
    icon: Code,
  },
  {
    title: "Local SEO & Business Visibility",
    description: "Optimizing Google Business profiles, local citations, geo-targeted landing pages, and regional business directories to capture local customers.",
    icon: MapPin,
  },
  {
    title: "Core Web Vitals & Speed Optimization",
    description: "Engineering lightweight assets, font preloading, and server-side rendering to achieve 95+ Google Lighthouse speed and passing Core Web Vitals.",
    icon: Zap,
  },
  {
    title: "Structured Schema Markup (JSON-LD)",
    description: "Implementing rich organizational, local business, product, FAQ, and article schema markup to help Google display prominent search rich snippets.",
    icon: FileCode,
  },
  {
    title: "On-Page Optimization & Content Structure",
    description: "Refining semantic heading hierarchies (H1-H4), metadata descriptions, image alt tags, and keyword density without unnatural keyword stuffing.",
    icon: Search,
  },
  {
    title: "Search Console & Organic Analytics",
    description: "Continuous monitoring of indexing coverage, search query impressions, average position trends, and click-through rates in Google Search Console.",
    icon: BarChart3,
  },
];

const SEO_STEPS = [
  {
    number: "01",
    title: "Technical Crawl & Audit",
    description: "We perform an in-depth audit identifying broken links, slow pages, missing metadata, indexing blockers, and mobile responsiveness issues.",
  },
  {
    number: "02",
    title: "Code-Level Fixes & Schema Injection",
    description: "Our developers fix technical issues directly in your codebase, optimizing Core Web Vitals, metadata, and JSON-LD structured data.",
  },
  {
    number: "03",
    title: "Keyword & Content Architecture",
    description: "We map high-intent commercial search queries to dedicated service and regional pages, establishing clean internal link pathways.",
  },
  {
    number: "04",
    title: "Monitoring & Visibility Refinement",
    description: "We track organic impression growth and search console telemetry, updating content and structure to sustain long-term discovery.",
  },
];

const SEO_FAQS = [
  {
    question: "Do you guarantee that my website will rank #1 on Google?",
    answer: "No, and any agency promising a guaranteed '#1 ranking' is misleading you. Google's algorithms change constantly and involve hundreds of ranking factors. What we deliver is rigorous technical SEO compliance, fast page speed, clean schema markup, and transparent visibility tracking.",
  },
  {
    question: "How long does it typically take to see organic SEO results?",
    answer: "Technical fixes and indexing improvements often reflect in Google Search Console within 2 to 4 weeks. Meaningful organic traffic growth and improved search visibility typically develop over 3 to 6 months of consistent optimization.",
  },
  {
    question: "Why is technical SEO more effective than basic keyword stuffing?",
    answer: "Search engines reward websites that provide fast, secure, and accessible user experiences. A technically flawless site built with clean semantic code, fast server response, and valid schema will consistently outperform a slow, bloated site regardless of how many keywords it uses.",
  },
  {
    question: "Does KASH optimize local business visibility in Delhi NCR and Western UP?",
    answer: "Yes, we specialize in local SEO architectures for businesses across Noida, Meerut, Ghaziabad, Baghpat, and Delhi NCR, ensuring your service areas are cleanly represented and discovered by local searchers.",
  },
];

function SeoServicesPage() {
  return (
    <>
      <HeroDiagonal
        badge="TECHNICAL & LOCAL SEARCH OPTIMIZATION"
        titlePrimary="Search Engine Optimization Built on"
        titleAccent="Technical Excellence"
        description="Improve your search visibility through clean site architecture, Core Web Vitals performance, structured JSON-LD schema, and targeted local SEO."
        primaryCtaText="Improve Your Search Visibility"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Web Development"
        secondaryCtaHref="/website-development"
        breadcrumbs={[
          { label: "Marketing", href: "/digital-marketing" },
          { label: "SEO Services" },
        ]}
      />

      {/* Capabilities Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              FOUNDATIONAL SEARCH DISCOVERY
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Engineered for Search Engines &amp; Real Humans
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We focus on technical health, structured data, and authentic local visibility — not risky gimmicks or false ranking promises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SEO_CAPABILITIES.map((item) => {
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

      {/* SEO Roadmap on Dark */}
      <ProcessSteps
        badge="EXECUTION ROADMAP"
        title="Our Technical SEO Process"
        steps={SEO_STEPS}
        variant="dark"
      />

      {/* Honesty Section on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              INTEGRITY IN SEO
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Real Visibility Built on Solid Code
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              Search algorithms prioritize websites that load quickly, communicate clearly with structured metadata, and serve genuine user intent. As software engineers, we fix the code and architecture that non-technical agencies simply cannot touch.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Zero black-hat techniques or automated spam links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Valid schema.org JSON-LD structured data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Passing Core Web Vitals (LCP, INP, CLS)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Transparent Google Search Console performance data</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FaqAccordion
        badge="SEARCH FAQS"
        title="Frequently Asked Questions"
        faqs={SEO_FAQS}
        variant="dark"
      />

      {/* CTA */}
      <CtaBanner
        variant="ivory"
        title="Ready to Strengthen Your Search Foundation?"
        subtitle="Let's optimize your website's technical health, structured data, and local search visibility."
        buttonText="Improve Your Search Visibility"
        buttonHref="/contact"
      />
    </>
  );
}

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/seo-services", pageType: "service", Fallback: SeoServicesPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
