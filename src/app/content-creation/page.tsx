import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Film, 
  Image as ImageIcon, 
  Layers, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Video 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Content Creation Services | KASH Technology",
  description: "High-retention reels, short-form videos, branded social graphics, and product creatives. We design content that captures attention and elevates your brand.",
  alternates: {
    canonical: "/content-creation",
  },
  openGraph: {
    title: "Content Creation Services | KASH Technology",
    description: "Creative content designed to capture attention and communicate your business value across social platforms.",
    url: "https://kash-technology.com/content-creation",
  },
};

const CREATIVE_OFFERINGS = [
  {
    title: "High-Retention Reels & Short-Form Video",
    description: "Dynamic video concepts scripted and crafted for Instagram Reels, YouTube Shorts, and TikTok to maximize watch time and audience retention.",
    icon: Film,
  },
  {
    title: "Social Media Creatives & Carousels",
    description: "Multi-slide educational decks, infographic posts, and branded visual carousels engineered for high save and share rates.",
    icon: Layers,
  },
  {
    title: "Branded Static Graphics",
    description: "Polished promotional graphics, announcement banners, quote cards, and campaign visuals that align with your brand typography and color palette.",
    icon: ImageIcon,
  },
  {
    title: "Campaign & Ad Creatives",
    description: "Conversion-optimized imagery and video hooks designed specifically for Meta and Google paid advertising campaigns.",
    icon: Target,
  },
  {
    title: "Product Showcases & Feature Demos",
    description: "Clean, high-fidelity digital mockups and screen recordings demonstrating your software, application, or physical products in action.",
    icon: Video,
  },
  {
    title: "Content Strategy & Editorial Planning",
    description: "Research-backed content pillars, topic ideation, and monthly batch schedules so you always know what to create next.",
    icon: Calendar,
  },
];

const CREATIVE_STEPS = [
  {
    number: "01",
    title: "Creative Briefing & Ideation",
    description: "We review your brand guidelines, audience interests, and campaign goals to develop content pillars and storyboard concepts.",
  },
  {
    number: "02",
    title: "Asset Production & Design",
    description: "Our design team crafts on-brand graphics, carousels, video cuts, and dynamic motion sequences adhering to your visual system.",
  },
  {
    number: "03",
    title: "Review & Refinement",
    description: "You review drafts in a centralized workflow. We incorporate your feedback to ensure brand voice and message accuracy.",
  },
  {
    number: "04",
    title: "Multi-Format Export & Delivery",
    description: "Assets are delivered in native resolutions (9:16 for stories/reels, 1:1 and 4:5 for feeds) ready for immediate publishing.",
  },
];

const CREATIVE_FAQS = [
  {
    question: "Do you create video content from our existing raw footage?",
    answer: "Yes. Many clients provide raw phone or camera recordings, podcast segments, or product videos. We edit, re-frame, color grade, add captions, and turn them into punchy short-form reels.",
  },
  {
    question: "Can you design content that matches our existing brand guidelines?",
    answer: "Absolutely. We strictly follow your existing color palette, typography, logo placement rules, and aesthetic standards so every graphic feels consistent with your brand identity.",
  },
  {
    question: "In what formats do you deliver the final content?",
    answer: "We deliver full-resolution assets optimized for each destination: 1080x1920 (9:16) for Reels/Shorts, 1080x1080 (1:1) and 1080x1350 (4:5) for feed posts and carousels, plus web-ready export formats.",
  },
  {
    question: "Can KASH also manage the posting and scheduling of this content?",
    answer: "Yes, our Social Media Management service pairs directly with Content Creation to handle full scheduling, caption writing, and community engagement.",
  },
];

export default function ContentCreationPage() {
  return (
    <>
      <HeroDiagonal
        badge="CONTENT CREATION SERVICES"
        titlePrimary="Content That"
        titleAccent="Gets Attention"
        description="Reels, short-form video, branded graphics, campaign creatives, and content strategy that stop the scroll and build lasting brand authority."
        primaryCtaText="Create With KASH"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Video Editing"
        secondaryCtaHref="/video-editing"
        breadcrumbs={[
          { label: "Creative", href: "/content-creation" },
          { label: "Content Creation" },
        ]}
      />

      {/* Offerings Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR CAPABILITIES
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Content Engineered to Stop the Scroll
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We combine storytelling, typography, and motion design to produce content people actually want to watch and remember.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CREATIVE_OFFERINGS.map((item) => {
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

      {/* Production Steps on Dark */}
      <ProcessSteps
        badge="PRODUCTION WORKFLOW"
        title="From Concept to Final Export"
        steps={CREATIVE_STEPS}
        variant="dark"
      />

      {/* Philosophy Section on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              CREATIVE STANDARDS
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Quality Over Volume
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              Low-effort templates dilute your brand. We design bespoke visual assets that look intentional, clean, and premium — reinforcing your positioning in every frame.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Zero generic Canva templates or clip-art</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Custom motion graphics and audio mastering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Structured around clear viewer hooks and retention</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Organized batches delivered on strict timelines</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <FaqAccordion
        badge="FREQUENT QUESTIONS"
        title="Everything You Need to Know"
        faqs={CREATIVE_FAQS}
        variant="dark"
      />

      {/* Conversion Banner */}
      <CtaBanner
        variant="ivory"
        title="Ready for Standout Content?"
        subtitle="Let's build a creative asset engine that elevates your brand and grabs real audience attention."
        buttonText="Create With KASH"
        buttonHref="/contact"
      />
    </>
  );
}
