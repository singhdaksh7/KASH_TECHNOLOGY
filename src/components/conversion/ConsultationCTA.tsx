"use client";

import React from "react";
import { useConsultation } from "./ConsultationContext";
import { PhoneCall } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ConsultationCTAProps {
  className?: string;
  variant?: "hero" | "contact" | "outline" | "text";
}

export function ConsultationCTA({ className = "", variant = "outline" }: ConsultationCTAProps) {
  const { setIsConsultationSelected, setLeadSource } = useConsultation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Set context state to true
    setIsConsultationSelected(true);

    // Set lead source based on variant context
    if (variant === "hero") {
      setLeadSource("Homepage Hero");
    } else if (variant === "contact") {
      setLeadSource("Homepage Contact");
    }

    // Track analytics event
    trackEvent("consultation_click", { location: variant });

    // Get contact section and form fields
    const contactSection = document.getElementById("contact");
    const fullNameInput = document.getElementById("fullName") as HTMLInputElement | null;

    if (contactSection) {
      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      contactSection.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });

      // Move focus after scroll animation completes to ensure accessibility
      setTimeout(() => {
        if (fullNameInput) {
          fullNameInput.focus();
        }
      }, prefersReduced ? 50 : 800);
    }
  };

  // Styling options matching the KASH design system
  const baseClasses = "rounded-full font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50";
  
  let variantClasses = "";
  if (variant === "hero") {
    variantClasses = "text-slate-400 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-blue-500 py-2.5 px-4";
  } else if (variant === "contact") {
    variantClasses = "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 px-6 py-3 shadow-[0_0_20px_rgba(59,130,246,0.2)]";
  } else if (variant === "text") {
    variantClasses = "text-primary hover:text-primary-hover underline underline-offset-4 decoration-primary/40 hover:decoration-primary";
  } else {
    // outline
    variantClasses = "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white px-6 py-3";
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      type="button"
      aria-label="Book a Free 30-Minute Consultation"
    >
      <PhoneCall className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
      <span>Book a Free 30-Minute Consultation</span>
    </button>
  );
}
