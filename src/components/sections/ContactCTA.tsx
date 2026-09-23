"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { Reveal } from "@/components/motion/Reveal";

export function ContactCTA() {
  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 lg:px-16 w-full max-w-[1520px] mx-auto scroll-mt-24 bg-[#050505] relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
        
        {/* Left Side: Copy and Contacts (col-span-5) */}
        <div className="lg:col-span-5 text-left shrink-0">
          <Reveal>
            <span className="text-[10px] tracking-[0.25em] font-mono text-primary uppercase font-bold mb-4 block">
              09 / Contact
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.12]">
              LET&apos;S BUILD
              <br />
              WHAT&apos;S NEXT.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[#8e9aa8] text-base md:text-lg max-w-sm mb-8 leading-relaxed">
              Tell us what you&apos;re building. We&apos;ll help turn it into production-ready software.
            </p>
          </Reveal>

          {/* Direct contact info */}
          <Reveal className="border-t border-white/5 pt-8 w-full max-w-xs space-y-6">
            <div>
              <span className="text-[9px] tracking-[0.2em] font-mono text-white/30 uppercase font-bold block mb-2">
                Founder Email
              </span>
              <Link 
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "email_link" })}
                className="text-white hover:text-primary transition-colors text-sm font-semibold tracking-tight"
              >
                {SITE_CONFIG.contactEmail}
              </Link>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.2em] font-mono text-white/30 uppercase font-bold block mb-2">
                Primary Phone
              </span>
              <Link 
                href={`tel:${SITE_CONFIG.contactPhonePrimary?.replace(/\s+/g, '')}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "phone_primary" })}
                className="text-white hover:text-primary transition-colors text-sm font-semibold tracking-tight"
              >
                {SITE_CONFIG.contactPhonePrimary}
              </Link>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.2em] font-mono text-white/30 uppercase font-bold block mb-2">
                Alternate Phone
              </span>
              <Link 
                href={`tel:${SITE_CONFIG.contactPhoneAlternate?.replace(/\s+/g, '')}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "phone_alternate" })}
                className="text-[#8e9aa8] hover:text-primary transition-colors text-xs font-semibold tracking-tight"
              >
                {SITE_CONFIG.contactPhoneAlternate}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right Side: Form (col-span-7) */}
        <Reveal delay={0.2} className="lg:col-span-7 w-full relative">
          {/* Subtle radial ambient blue glow behind the form container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative border border-white/5 bg-[#0b0b0d] p-6 sm:p-8 rounded-lg shadow-2xl">
            <ContactForm />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
