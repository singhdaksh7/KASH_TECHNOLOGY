"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { ConsultationCTA } from "@/components/conversion/ConsultationCTA";
import { trackEvent } from "@/lib/analytics";

export function ContactCTA() {
  return (
    <section id="contact" className="py-24 px-8 max-w-[1280px] mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 flex items-center gap-3">
            <MessageSquare className="text-primary w-10 h-10" />
            Let&apos;s build something remarkable.
          </h2>
          <p className="text-xl text-muted leading-relaxed mb-8">
            Whether you need a specialized engineering team or a full product build, we&apos;re ready to help bring your vision to life.
          </p>
          
          <div className="mb-8 flex justify-start">
            <ConsultationCTA variant="contact" className="w-full sm:w-auto" />
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Direct Contact
            </h3>
            <p className="text-muted text-sm mb-4">
              Prefer direct communication? Reach out to our team via email or phone.
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "email_link" })}
                className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 transition-colors"
              >
                {SITE_CONFIG.contactEmail}
              </Link>
              <Link 
                href={`tel:${SITE_CONFIG.contactPhonePrimary?.replace(/\s+/g, '')}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "phone_primary" })}
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                {SITE_CONFIG.contactPhonePrimary}
              </Link>
              <Link 
                href={`tel:${SITE_CONFIG.contactPhoneAlternate?.replace(/\s+/g, '')}`}
                onClick={() => trackEvent("cta_click", { location: "contact_section", label: "phone_alternate" })}
                className="text-muted hover:text-primary transition-colors text-sm"
              >
                {SITE_CONFIG.contactPhoneAlternate} (Alternate)
              </Link>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
