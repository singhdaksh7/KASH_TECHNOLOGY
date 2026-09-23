import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface CtaBannerProps {
  variant?: "dark" | "ivory";
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  emblemPosition?: "left" | "right" | "none";
  showMailIcon?: boolean;
}

export function CtaBanner({
  variant = "dark",
  title = "Let's Build Your Next Digital Product",
  subtitle = "Ready to turn your idea into a powerful digital solution?",
  buttonText = "Contact KASH Technology",
  buttonHref = "/contact",
  emblemPosition = "left",
  showMailIcon = false,
}: CtaBannerProps) {
  const isDark = variant === "dark";

  return (
    <section className={`py-16 md:py-20 relative overflow-hidden ${isDark ? 'bg-[#050708]' : 'bg-[#fbf8f2]'}`}>
      <Container>
        <div 
          className={`relative rounded-2xl p-8 md:p-12 overflow-hidden border ${
            isDark 
              ? 'bg-[#0e0e12] border-white/10 shadow-2xl' 
              : 'bg-white border-black/5 shadow-xl'
          }`}
        >
          {/* Subtle Circuit Overlay */}
          <div className={`absolute inset-0 ${isDark ? 'circuit-pattern-dark' : 'circuit-pattern-ivory'} opacity-25 pointer-events-none`} />

          {/* Decorative Corner Circuit Line */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <path d="M 100 20 L 40 20 L 20 40 L 20 100" stroke="#f36b21" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Emblem / Icon if Position === 'left' */}
            {showMailIcon ? (
              <div className="w-16 h-16 rounded-2xl bg-[#f36b21]/15 border border-[#f36b21]/30 flex items-center justify-center text-[#f36b21] shrink-0">
                <Mail className="w-8 h-8" />
              </div>
            ) : emblemPosition === "left" ? (
              <div className="hidden lg:flex items-center justify-center shrink-0">
                <div className="relative w-24 h-24 rounded-full border border-[#f36b21]/40 p-1 shadow-[0_0_20px_rgba(243,107,33,0.15)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src="/images/logo/kash-logo-emblem.jpg"
                      alt="KASH Emblem"
                      fill
                      className="object-cover scale-105"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Center/Text Content */}
            <div className={`space-y-2 text-center lg:text-left flex-1 ${emblemPosition === 'left' || showMailIcon ? 'lg:pl-4' : ''}`}>
              <h2 className={`font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                {title}
              </h2>
              <p className={`text-sm md:text-base ${isDark ? 'text-[#9ca3af]' : 'text-[#6b7280]'}`}>
                {subtitle}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={buttonHref}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_6px_20px_rgba(243,107,33,0.35)] hover:shadow-[0_8px_25px_rgba(243,107,33,0.5)] active:scale-95 shrink-0"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Emblem if Position === 'right' */}
            {emblemPosition === "right" && !showMailIcon && (
              <div className="hidden lg:flex items-center justify-center shrink-0">
                <div className="relative w-24 h-24 rounded-full border border-[#f36b21]/40 p-1 shadow-[0_0_20px_rgba(243,107,33,0.15)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src="/images/logo/kash-logo-emblem.jpg"
                      alt="KASH Emblem"
                      fill
                      className="object-cover scale-105"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </Container>
    </section>
  );
}
