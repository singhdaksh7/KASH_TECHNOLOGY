import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Target, 
  Zap, 
  MessageSquare, 
  Database, 
  Bot, 
  BarChart3, 
  CheckCircle2 
} from "lucide-react";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const baseMetadata: Metadata = {
  title: "Lead Generation & Pipeline Automation Services | KASH Technology",
  description: "End-to-end lead generation combining paid campaigns, high-converting landing pages, instant WhatsApp workflows, automated CRM capture, and lead qualification.",
  alternates: {
    canonical: "/lead-generation",
  },
  openGraph: {
    title: "Lead Generation & Pipeline Automation Services | KASH Technology",
    description: "Connect marketing directly to sales automation. High-intent paid campaigns paired with instant WhatsApp and CRM routing.",
    url: "https://kash-technology.com/lead-generation",
  },
};

const LEAD_SYSTEMS = [
  {
    title: "Paid Lead Acquisition Campaigns",
    description: "Targeted campaigns on Meta and Google Ads optimized exclusively for qualified lead generation rather than useless vanity traffic.",
    icon: Target,
  },
  {
    title: "Conversion-Focused Landing Pages",
    description: "Sub-second Next.js landing pages featuring clear value propositions, interactive forms, and zero page friction to maximize submission rates.",
    icon: Zap,
  },
  {
    title: "Instant CRM Lead Capture",
    description: "Every form submission is instantly parsed, validated, and pushed directly into your CRM (HubSpot, Zoho, or custom ERP) within seconds.",
    icon: Database,
  },
  {
    title: "Automated WhatsApp & SMS Workflows",
    description: "Trigger immediate WhatsApp confirmations, brochure PDFs, and appointment booking links the moment a prospective client submits an inquiry.",
    icon: MessageSquare,
  },
  {
    title: "Intelligent Lead Qualification",
    description: "Automated logic and qualification questions that filter out window-shoppers, scoring leads so your sales team talks only to serious buyers.",
    icon: Bot,
  },
  {
    title: "Pipeline Attribution & Reporting",
    description: "End-to-end tracking connecting each lead back to the exact campaign, ad creative, and keyword that generated it for total budget clarity.",
    icon: BarChart3,
  },
];

const LEAD_STEPS = [
  {
    number: "01",
    title: "Funnel Strategy & ICP Definition",
    description: "We define your Ideal Customer Profile (ICP), identify their primary pain points, and craft the high-value offer or consultation hook.",
  },
  {
    number: "02",
    title: "Landing Page & Pipeline Engineering",
    description: "We code high-speed landing pages and establish the webhooks connecting form submissions directly to your CRM and WhatsApp messaging.",
  },
  {
    number: "03",
    title: "Campaign Launch & Verification",
    description: "We launch targeted ads, verifying that every test lead successfully triggers the instant WhatsApp confirmation and salesperson notification.",
  },
  {
    number: "04",
    title: "Qualification & Cost Optimization",
    description: "We continuously analyze lead quality and conversion feedback, optimizing targeting to drive down the cost per qualified business opportunity.",
  },
];

const LEAD_FAQS = [
  {
    question: "Why is combining marketing with software automation so important for leads?",
    answer: "Studies consistently show that contacting a lead within 5 minutes increases conversion odds by over 300%. Standard marketing agencies leave leads in an unread spreadsheet. KASH Technology automatically triggers an instant WhatsApp message and pings your sales team in real time.",
  },
  {
    question: "Can this system integrate with our existing CRM?",
    answer: "Yes. Whether you use Zoho, HubSpot, Salesforce, Google Sheets, or a custom internal ERP, our engineering team sets up secure API webhooks for seamless data flow.",
  },
  {
    question: "Do you provide the ad creative and copywriting?",
    answer: "Yes. Our team handles everything from the ad hook copy and graphic design to the landing page text, form layout, and automated follow-up messaging sequences.",
  },
  {
    question: "How do you prevent spam or fake form submissions?",
    answer: "We implement OTP phone verification, intelligent honeypots, rate limiting, and form validation rules to ensure only authentic prospective clients enter your pipeline.",
  },
];

function LeadGenerationPage() {
  return (
    <>
      <HeroDiagonal
        badge="MARKETING + SOFTWARE + AUTOMATION"
        titlePrimary="Lead Generation Built With"
        titleAccent="Automated Pipelines"
        description="High-intent paid campaigns paired with high-speed landing pages, instant WhatsApp workflows, automated CRM capture, and smart lead qualification."
        primaryCtaText="Automate Your Lead Pipeline"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore AI Automation"
        secondaryCtaHref="/ai-automation"
        breadcrumbs={[
          { label: "Marketing", href: "/digital-marketing" },
          { label: "Lead Generation" },
        ]}
      />

      {/* Systems Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              THE FULL PIPELINE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              From Click to Qualified Inquiry in Seconds
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We eliminate dropped leads, manual data entry, and delayed follow-ups by fusing customer acquisition with software automation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {LEAD_SYSTEMS.map((item) => {
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

      {/* Step by Step on Dark */}
      <ProcessSteps
        badge="HOW IT WORKS"
        title="Our Lead Automation Architecture"
        steps={LEAD_STEPS}
        variant="dark"
      />

      {/* Differentiator on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              THE KASH DIFFERENTIATOR
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Marketing + Software + Automation Under One Roof
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              Most businesses lose leads because their marketing team blames the website, the web developer blames the CRM, and the sales team complains leads are cold. KASH Technology engineers the entire chain so your pipeline works flawlessly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Instant automated WhatsApp response within seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Seamless webhook integration into your existing CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>OTP validation preventing fake phone submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Direct sales alerts delivered to team phones</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FaqAccordion
        badge="COMMON INQUIRIES"
        title="Frequently Asked Questions"
        faqs={LEAD_FAQS}
        variant="dark"
      />

      {/* CTA Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready to Scale Your Lead Pipeline?"
        subtitle="Let's build an automated lead acquisition and follow-up engine that ensures no potential customer slips through the cracks."
        buttonText="Automate Your Lead Pipeline"
        buttonHref="/contact"
      />
    </>
  );
}

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/lead-generation", pageType: "service", Fallback: LeadGenerationPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
