import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Palette, 
  Sparkles, 
  Type, 
  FileText, 
  CheckCircle2, 
  Compass, 
  Share2 
} from "lucide-react";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const baseMetadata: Metadata = {
  title: "Brand Strategy & Visual Identity Systems | KASH Technology",
  description: "Bespoke brand identity engineering. Logo systems, typography, curated color palettes, social media identity, and comprehensive brand guidelines built for modern companies.",
  alternates: {
    canonical: "/branding",
  },
  openGraph: {
    title: "Brand Strategy & Visual Identity Systems | KASH Technology",
    description: "Design systems and brand identity that communicate authority, coherence, and distinction across digital and physical touchpoints.",
    url: "https://kash-technology.com/branding",
  },
};

const BRANDING_CAPABILITIES = [
  {
    title: "Brand Strategy & Market Positioning",
    description: "Defining your core value proposition, audience personas, tone of voice, and competitive differentiation to establish a clear market stance.",
    icon: Compass,
  },
  {
    title: "Comprehensive Logo Systems",
    description: "Precision vector logo marks, primary emblems, secondary wordmarks, and sub-brand variants designed to scale cleanly from favicons to billboards.",
    icon: Sparkles,
  },
  {
    title: "Color Systems & Design Tokens",
    description: "Harmonious, high-contrast color palettes with defined primary, surface, accent, and utility tones engineered for WCAG accessible digital interfaces.",
    icon: Palette,
  },
  {
    title: "Typography Pairings & Hierarchy",
    description: "Curated font pairings (display serif and clean sans-serif body styles) with strict proportional scale rules for digital and print media.",
    icon: Type,
  },
  {
    title: "Social Media Visual Identity",
    description: "Branded post templates, reel cover styles, highlight icons, and carousel layout systems that give your channels an unmistakable visual signature.",
    icon: Share2,
  },
  {
    title: "Comprehensive Brand Guidelines",
    description: "A centralized, accessible brand bible detailing clear dos and don'ts, spacing geometry, logo clearances, and real-world asset usage rules.",
    icon: FileText,
  },
];

const BRANDING_PROCESS = [
  {
    number: "01",
    title: "Discovery & Brand Workshop",
    description: "We deep-dive into your company's heritage, target demographics, competitive landscape, and long-term vision to define creative guardrails.",
  },
  {
    number: "02",
    title: "Identity Exploration & Concepts",
    description: "Our design team develops distinct visual directions featuring logo concepts, typography pairings, and curated color palettes.",
  },
  {
    number: "03",
    title: "Refinement & Digital Testing",
    description: "We test the chosen visual direction across real-world digital contexts: website headers, mobile app icons, social feeds, and stationery.",
  },
  {
    number: "04",
    title: "Master Asset Delivery & Guidelines",
    description: "We export the complete vector asset kit (SVG, EPS, PNG, PDF) along with comprehensive brand guideline documentation.",
  },
];

const BRANDING_FAQS = [
  {
    question: "What files do I receive once the branding is complete?",
    answer: "You receive the full master asset package in all industry-standard formats: scalable vector files (AI, EPS, SVG) and high-resolution raster files (PNG with transparent backgrounds, JPG), along with your complete Brand Guidelines PDF.",
  },
  {
    question: "Can you rebrand an existing company without losing our heritage?",
    answer: "Yes, we frequently perform brand refreshes where we modernize existing logos, refine awkward typography, and create coherent color systems while preserving brand equity.",
  },
  {
    question: "How does your branding work with website development?",
    answer: "Because we are both designers and software engineers, our branding is built with code in mind. We provide CSS variables, design tokens, and web-safe typography ready for immediate implementation on your website and app.",
  },
  {
    question: "Do you design collateral like business cards and stationery?",
    answer: "Yes, we include core corporate collateral templates—such as letterheads, business cards, email signatures, and presentation decks—as part of our branding packages.",
  },
];

function BrandingPage() {
  return (
    <>
      <HeroDiagonal
        badge="BRAND IDENTITY & DESIGN SYSTEMS"
        titlePrimary="Brand Systems Built for"
        titleAccent="Distinction & Authority"
        description="Logo systems, typography, curated color palettes, social media identity, and comprehensive brand guidelines that make your business unforgettable."
        primaryCtaText="Build Your Brand Identity"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Creative Services"
        secondaryCtaHref="/content-creation"
        breadcrumbs={[
          { label: "Creative", href: "/content-creation" },
          { label: "Branding" },
        ]}
      />

      {/* Offerings Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              DESIGN DISCIPLINE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Identity Systems Engineered to Scale
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We create cohesive brand languages that look authoritative across software interfaces, social feeds, and print media.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BRANDING_CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-7 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(243,107,33,0.1)] hover:border-[#f36b21]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] mb-5 group-hover:bg-[#f36b21] group-hover:text-white transition-colors duration-300">
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

      {/* Brand Process on Dark */}
      <ProcessSteps
        badge="CREATIVE METHODOLOGY"
        title="From Discovery to Brand Master Kit"
        steps={BRANDING_PROCESS}
        variant="dark"
      />

      {/* Philosophy Section on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              REAL DESIGN STANDARDS
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              More Than Just a Logo
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              A logo without a system fails the moment you build a website or launch a campaign. We build complete visual identities—colors, typography rules, component tokens, and spacing geometry—that empower your team to communicate with absolute consistency.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>100% original vector geometry with full IP ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Accessible color systems with AAA contrast ratios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Direct translation into web and mobile design tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Complete digital Brand Guidelines manual</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <FaqAccordion
        badge="FAQS"
        title="Frequently Asked Questions"
        faqs={BRANDING_FAQS}
        variant="dark"
      />

      {/* Conversion Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready to Build an Unmistakable Brand?"
        subtitle="Let's craft an identity system that commands respect and sets your business apart in the market."
        buttonText="Build Your Brand Identity"
        buttonHref="/contact"
      />
    </>
  );
}

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/branding", pageType: "service", Fallback: BrandingPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
