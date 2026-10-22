import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Social Media Management Services | KASH Technology",
  description: "End-to-end social media management for Instagram, LinkedIn, and Facebook. Consistent posting, custom content calendars, community engagement, and growth analytics.",
  alternates: {
    canonical: "/social-media-management",
  },
  openGraph: {
    title: "Social Media Management Services | KASH Technology",
    description: "Keep your brand active, professional, and growing with managed social media strategy, content, and reporting.",
    url: "https://kash-technology.com/social-media-management",
  },
};

const SOCIAL_FEATURES = [
  {
    title: "Strategic Content Calendars",
    description: "Organized monthly publishing roadmaps tailored to your industry, target audience, and business milestones so your channels never go silent.",
    icon: Calendar,
  },
  {
    title: "Instagram Management",
    description: "Grid curation, high-retention reels, story series, strategic hashtag research, and bio optimization to establish an active, credible visual presence.",
    icon: InstagramIcon,
  },
  {
    title: "LinkedIn Executive & Brand Presence",
    description: "Thought-leadership posts, company updates, custom carousel decks, and B2B positioning designed to build authority with decision-makers.",
    icon: LinkedinIcon,
  },
  {
    title: "Post Scheduling & Caption Writing",
    description: "Persuasive, on-brand copy with clear calls to action, scheduled at peak audience engagement windows for optimal organic reach.",
    icon: Clock,
  },
  {
    title: "Community Management & Inquiries",
    description: "Monitoring comments, direct messages, and brand mentions to ensure prompt, professional engagement and route qualified sales leads.",
    icon: MessageSquare,
  },
  {
    title: "Monthly Analytics & Growth Reporting",
    description: "Transparent, metric-driven reports reviewing engagement rates, audience growth, top-performing creatives, and actionable next steps.",
    icon: BarChart3,
  },
];

const SOCIAL_PROCESS = [
  {
    number: "01",
    title: "Audit & Strategy",
    description: "We analyze your current profiles, competitor landscape, target audience, and brand voice to establish a focused social media strategy.",
  },
  {
    number: "02",
    title: "Monthly Content Planning",
    description: "We develop a structured content calendar with post concepts, visual themes, captions, and publication schedules for your review and approval.",
  },
  {
    number: "03",
    title: "Production & Scheduling",
    description: "Our creative team designs branded graphics, carousels, and video clips, scheduling them across your channels at optimal high-engagement times.",
  },
  {
    number: "04",
    title: "Engagement & Monthly Review",
    description: "We manage community interactions, track performance metrics, and deliver a clear monthly progress report to refine ongoing results.",
  },
];

const SOCIAL_FAQS = [
  {
    question: "Which social media platforms does KASH Technology manage?",
    answer: "We primarily manage Instagram, LinkedIn, and Facebook, tailored to whether your business is consumer-facing (B2C) or business-to-business (B2B). We can also coordinate YouTube shorts and supporting channels.",
  },
  {
    question: "Do I get to review and approve posts before they go live?",
    answer: "Yes, absolutely. We prepare content calendars in advance and submit them for your review. Nothing is published without your final sign-off.",
  },
  {
    question: "How do you maintain our brand voice?",
    answer: "During onboarding, we document your brand guidelines, terminology, target audience personas, and communication style to ensure every caption and graphic feels authentically yours.",
  },
  {
    question: "How does social media management integrate with your technology services?",
    answer: "As an integrated digital agency, we connect your social media directly to custom landing pages, CRM systems, and WhatsApp automation so audience interest converts into trackable business inquiries.",
  },
];

export default function SocialMediaManagementPage() {
  return (
    <>
      <HeroDiagonal
        badge="SOCIAL MEDIA MANAGEMENT"
        titlePrimary="Social Media Management That Keeps"
        titleAccent="Your Brand Active & Growing"
        description="Consistent posting, strategic content calendars, branded creatives, and active community management across Instagram, LinkedIn, and Facebook."
        primaryCtaText="Grow Your Social Presence"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Creative Services"
        secondaryCtaHref="/content-creation"
        breadcrumbs={[
          { label: "Marketing", href: "/digital-marketing" },
          { label: "Social Media Management" },
        ]}
      />

      {/* Services Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              WHAT WE HANDLE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Everything Needed for an Active, Professional Profile
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We eliminate the burden of daily posting so your business maintains a polished, authoritative digital footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOCIAL_FEATURES.map((item) => {
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

      {/* Process Steps on Dark */}
      <ProcessSteps
        badge="OUR WORKFLOW"
        title="How We Manage Your Channels"
        steps={SOCIAL_PROCESS}
        variant="dark"
      />

      {/* Why KASH Tech on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              THE KASH ADVANTAGE
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Social Media Connected to Real Business Outcomes
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              Most social agencies operate in an isolated vacuum of vanity metrics. At KASH Technology, your social media presence is aligned with your website, landing pages, CRM systems, and lead capture workflows.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Custom branded graphics tailored to your identity</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Dedicated account manager and content strategist</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Zero fake followers or automated bot engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Seamless handoff to WhatsApp and lead capture</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <FaqAccordion
        badge="COMMON QUESTIONS"
        title="Frequently Asked Questions"
        faqs={SOCIAL_FAQS}
        variant="dark"
      />

      {/* Conversion Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready to Transform Your Social Media?"
        subtitle="Let's build a consistent, authoritative social presence that elevates your brand and attracts real customers."
        buttonText="Grow Your Social Presence"
        buttonHref="/contact"
      />
    </>
  );
}
