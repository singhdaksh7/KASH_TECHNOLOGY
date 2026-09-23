import type { Metadata } from "next";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { ProcessSteps, ABOUT_STEPS } from "@/components/sections/ProcessSteps";
import { SITE_CONFIG } from "@/lib/constants";
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Lightbulb, 
  Award, 
  Users, 
  TrendingUp, 
  User,
  Mail,
  CheckCircle2,
  Cpu
} from "lucide-react";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
    </svg>
  );
}

export const metadata: Metadata = {
  title: "About Us — Custom Software. Real Impact. | KASH Technology",
  description: "Learn about KASH Technology's engineering philosophy, mission, values, and experienced leadership team.",
};

const PILLARS = [
  {
    title: "Client-Focused",
    description: "Built around your needs.",
    icon: Users,
  },
  {
    title: "Innovation",
    description: "Modern technology. Practical value.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    description: "Reliable solutions built to last.",
    icon: Award,
  },
];

const CORE_VALUES = [
  { title: "Integrity", desc: "Transparent.", icon: ShieldCheck },
  { title: "Innovation", desc: "Forward-thinking.", icon: Lightbulb },
  { title: "Quality", desc: "Reliable.", icon: Award },
  { title: "Collaboration", desc: "Together.", icon: Users },
  { title: "Growth", desc: "Scalable.", icon: TrendingUp },
];

const STATS_DATA = [
  { value: "100%", label: "Custom Architecture", icon: CheckCircle2 },
  { value: "Full", label: "Cycle Delivery", icon: Cpu },
  { value: "Modern", label: "Tech Stacks", icon: Lightbulb },
  { value: "Agile", label: "Sprint Delivery", icon: TrendingUp },
  { value: "Direct", label: "Engineer Support", icon: Award },
];

const TEAM_MEMBERS = [
  {
    name: "Solutions Architecture",
    role: "System Design & Strategy",
    linkedin: SITE_CONFIG.social.linkedin,
    email: SITE_CONFIG.contactEmail,
  },
  {
    name: "Full-Stack Development",
    role: "Web, Mobile & APIs",
    linkedin: SITE_CONFIG.social.linkedin,
    email: SITE_CONFIG.contactEmail,
  },
  {
    name: "UI/UX & Product Design",
    role: "Design Systems & UX",
    linkedin: SITE_CONFIG.social.linkedin,
    email: SITE_CONFIG.contactEmail,
  },
  {
    name: "Cloud & DevOps",
    role: "Security & Infrastructure",
    linkedin: SITE_CONFIG.social.linkedin,
    email: SITE_CONFIG.contactEmail,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroDiagonal
        badge="ABOUT KASH TECHNOLOGY"
        titlePrimary="Custom Software."
        titleSecondary="Real Impact."
        titleAccent="Built Around You."
        description="We help businesses simplify, automate and scale through technology."
        primaryCtaText="Our Story"
        primaryCtaHref="#our-story"
        secondaryCtaText="Explore Services"
        secondaryCtaHref="/services"
      />

      {/* 2. Driven by Purpose on Ivory */}
      <section id="our-story" className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR STORY
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
              Built for Real Business Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Story narrative */}
            <div className="lg:col-span-6 space-y-4 text-[#4b5563] text-sm sm:text-base leading-relaxed">
              <p>
                KASH Technology builds practical digital solutions for businesses that want to work smarter and grow faster.
              </p>
              <p>
                We focus on scalable technology that solves real operational challenges.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="lg:col-span-6 space-y-3">
              {PILLARS.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={p.title}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:border-[#f36b21]/40 transition-all duration-200"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#f36b21]/10 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-heading text-base font-bold text-[#111827] mb-0.5">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#6b7280] leading-tight">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Mission & Vision on Dark */}
      <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
        <CircuitBackground variant="dark" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Mission */}
            <div className="bg-[#0b0d0e] rounded-3xl p-7 border border-white/10 shadow-xl relative overflow-hidden flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#f36b21]/15 border border-[#f36b21]/40 flex items-center justify-center text-[#f36b21] mb-4 shadow-[0_0_12px_rgba(243,107,33,0.15)]">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#f36b21] uppercase block mb-1.5">
                OUR MISSION
              </span>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Build tailored, affordable and scalable technology for growing businesses.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#0b0d0e] rounded-3xl p-7 border border-white/10 shadow-xl relative overflow-hidden flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] mb-4 shadow-[0_0_12px_rgba(197,168,128,0.15)]">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#c5a880] uppercase block mb-1.5">
                OUR VISION
              </span>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Make powerful digital solutions accessible to every growing business.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Core Values on Ivory */}
      <section className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR CORE VALUES
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {CORE_VALUES.map((val) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-center flex flex-col items-center hover:border-[#f36b21]/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f36b21]/10 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] mb-3">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-heading text-base font-bold text-[#111827] mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Why We Exist on Dark */}
      <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
        <CircuitBackground variant="dark" />

        <Container className="relative z-10">
          <div className="text-center mb-10 space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              WHY WE EXIST
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold text-white">
              We Simplify Technology. You Focus on Growth.
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
              We handle the technology so you can focus on your business.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 max-w-4xl mx-auto">
            {STATS_DATA.map((m) => {
              const IconComponent = m.icon;
              return (
                <div key={m.label} className="bg-white rounded-2xl p-5 border border-black/5 text-center shadow-lg flex flex-col items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21] mb-1.5">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-serif-heading text-xl sm:text-2xl font-bold text-[#111827] block mb-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-[#6b7280] font-medium leading-tight">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Our Team on Dark */}
      <section className="py-16 md:py-20 bg-[#050708] text-white relative overflow-hidden border-b border-white/10">
        <Container className="relative z-10">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              OUR TEAM
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-white">
              Experts Who Build and Care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-[#0b0d0e] rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center shadow-lg hover:border-[#f36b21]/40 transition-all duration-200 group"
              >
                {/* Silhouette Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#14161f] border-2 border-white/10 flex items-center justify-center text-white/50 mb-3 shadow-inner group-hover:border-[#f36b21]/50 transition-colors">
                  <User className="w-10 h-10 text-[#c5a880]" />
                </div>

                <h3 className="font-serif-heading text-base font-bold text-white mb-1 group-hover:text-[#f36b21] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-[#9ca3af] mb-3">
                  {member.role}
                </p>

                <div className="flex items-center gap-2.5 pt-2.5 border-t border-white/10 w-full justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#f36b21] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    aria-label={`${member.name} Email`}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#f36b21] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Proven Process on Ivory */}
      <ProcessSteps
        badge="OUR PROCESS"
        title="From Idea to Launch"
        steps={ABOUT_STEPS}
        variant="ivory"
      />

      {/* 8. Bottom CTA Banner */}
      <CtaBanner
        variant="dark"
        title="Let's Build Something Great Together"
        subtitle="Have a project in mind? We're ready to bring your ideas to life."
        buttonText="Contact KASH Technology"
        buttonHref="/contact"
        emblemPosition="left"
      />
    </>
  );
}
