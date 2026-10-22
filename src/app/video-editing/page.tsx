import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { 
  Film, 
  Scissors, 
  Sparkles, 
  Volume2, 
  Subtitles, 
  CheckCircle2 
} from "lucide-react";

function YoutubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Professional Video Editing Services | KASH Technology",
  description: "High-retention video editing built for attention. Short-form reels, YouTube production, ad creatives, motion graphics, and sound design. Engineered for brands that care about quality.",
  alternates: {
    canonical: "/video-editing",
  },
  openGraph: {
    title: "Professional Video Editing Services | KASH Technology",
    description: "Studio-grade video editing for reels, YouTube, commercials, and paid ad campaigns. Retain viewers and elevate your brand perception.",
    url: "https://kash-technology.com/video-editing",
  },
};

const VIDEO_CAPABILITIES = [
  {
    title: "High-Retention Reels & Short-Form Edits",
    description: "Fast-paced, hook-driven edits for Instagram Reels, YouTube Shorts, and TikTok with tight pacing, zoom transitions, and visual retention resets.",
    icon: Film,
  },
  {
    title: "YouTube Long-Form Production",
    description: "Documentary-style and educational long-form editing with comprehensive B-roll sequencing, timeline pacing, storytelling arcs, and chapter design.",
    icon: YoutubeIcon,
  },
  {
    title: "Dynamic Subtitles & Typography",
    description: "Word-by-word synced animated captions, custom brand typography, and styled highlight callouts that ensure silent-view engagement.",
    icon: Subtitles,
  },
  {
    title: "Motion Graphics & Kinetic Titles",
    description: "Sophisticated 2D animations, custom lower thirds, screen mockups, and sleek infographics integrated seamlessly into live-action footage.",
    icon: Sparkles,
  },
  {
    title: "Immersive Sound Design & Mixing",
    description: "Layered Foley effects, risers, whooshes, ambient backgrounds, and balanced voice-over leveling that make edits feel cinematic and polished.",
    icon: Volume2,
  },
  {
    title: "Long-Form Repurposing Engine",
    description: "Extracting multiple high-impact short-form clips from podcasts, webinars, keynotes, or interviews with custom aspect ratio reframing.",
    icon: Scissors,
  },
];

const VIDEO_STEPS = [
  {
    number: "01",
    title: "Footage Ingestion & Script Review",
    description: "You share your raw video files, talking head clips, or podcast recordings via secure cloud transfer alongside your narrative goals.",
  },
  {
    number: "02",
    title: "The Assembly & A-Roll Pacing",
    description: "We cut pauses, dead air, and filler words, establishing a razor-sharp A-roll narrative with high-energy viewer hooks.",
  },
  {
    number: "03",
    title: "B-Roll, Sound & Motion Graphics",
    description: "We weave in contextual B-roll, custom motion graphics, sound design layers, and dynamic subtitles styled to your brand guide.",
  },
  {
    number: "04",
    title: "Color Grading & Master Delivery",
    description: "Final audio mastering, color balancing, and multi-resolution rendering delivered in pro formats ready for immediate distribution.",
  },
];

const VIDEO_FAQS = [
  {
    question: "How is KASH Technology different from standard freelance video editors?",
    answer: "We treat video as an engineering discipline. Every cut, sound hit, and caption is designed around viewer retention and brand credibility. You work with a dedicated production team using professional NLE suites, calibrated color pipelines, and reliable turnaround schedules.",
  },
  {
    question: "How do we send our large raw footage files?",
    answer: "We provide high-speed cloud upload folders (Google Drive, Dropbox, or frame.io) where you can securely upload raw multi-camera files, 4K footage, and audio stems.",
  },
  {
    question: "What is your standard turnaround time?",
    answer: "Short-form reels typically take 24 to 48 hours per batch, while complex YouTube long-form projects or commercial videos average 3 to 5 business days, including your revision rounds.",
  },
  {
    question: "Can you create paid ad variations for testing?",
    answer: "Yes. For marketing campaigns, we frequently deliver multiple hook variations (the first 3–5 seconds) for a single core creative, allowing you to test which intro delivers the lowest cost per acquisition.",
  },
];

export default function VideoEditingPage() {
  return (
    <>
      <HeroDiagonal
        badge="STUDIO-GRADE VIDEO EDITING"
        titlePrimary="Video Editing Built"
        titleAccent="For Attention"
        description="High-retention reels, YouTube productions, commercial ad creatives, motion graphics, and sound design engineered for brands that refuse to look generic."
        primaryCtaText="Start Your Video Project"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Content Creation"
        secondaryCtaHref="/content-creation"
        breadcrumbs={[
          { label: "Creative", href: "/content-creation" },
          { label: "Video Editing" },
        ]}
      />

      {/* Capabilities Grid on Ivory */}
      <section className="py-20 md:py-28 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              POST-PRODUCTION SUITE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Every Cut Intentional. Every Frame Polished.
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280] max-w-xl mx-auto">
              We move far beyond basic cuts to produce cinematic, high-retention video that commands respect and drives conversions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEO_CAPABILITIES.map((item) => {
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

      {/* Production Pipeline on Dark */}
      <ProcessSteps
        badge="PRODUCTION PIPELINE"
        title="Our Precision Editing Workflow"
        steps={VIDEO_STEPS}
        variant="dark"
      />

      {/* Quality Standards on Ivory */}
      <section className="py-20 md:py-24 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-xl">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block mb-3">
              PREMIUM POSITIONING
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Engineered for Serious Brands
            </h3>
            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed mb-6">
              In a landscape flooded with generic automated cap-cuts, true craft stands out. We work with founders, educators, agencies, and businesses that understand that video quality directly defines brand credibility.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium text-[#111827]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Custom subtitle animations & typography styling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Multi-channel retention optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Broadcast audio loudness normalization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
                <span>Multi-hook variations for paid ad campaigns</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <FaqAccordion
        badge="QUESTIONS & ANSWERS"
        title="Frequently Asked Questions"
        faqs={VIDEO_FAQS}
        variant="dark"
      />

      {/* CTA */}
      <CtaBanner
        variant="ivory"
        title="Ready to Elevate Your Video Content?"
        subtitle="Let's transform your raw footage into high-retention video assets that command attention and grow your brand."
        buttonText="Start Your Video Project"
        buttonHref="/contact"
      />
    </>
  );
}
