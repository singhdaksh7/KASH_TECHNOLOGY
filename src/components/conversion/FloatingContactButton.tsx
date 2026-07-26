"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useConsultation } from "@/components/conversion/ConsultationContext";

export function FloatingContactButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { setLeadSource } = useConsultation();

  // Scroll threshold handler (300px scroll depth before showing the floating button)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger check immediately in case page is already scrolled on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter which routes should display the floating button (Homepage and case studies)
  const allowedRoutes = ["/", "/work/exora", "/work/schoolsync", "/work/crypto-launchpad"];
  if (!allowedRoutes.includes(pathname || "")) {
    return null;
  }

  // Smooth scroll handler for homepage
  const handleScrollToContact = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        contactSection.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    setLeadSource("Floating CTA");
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    trackEvent("cta_click", {
      location: "floating_button",
      label: isMobile ? "lets_build_mobile" : "lets_build_desktop",
      route: pathname || "/",
    });
    handleScrollToContact(e);
  };

  const handleLinkClick = () => {
    setLeadSource("Floating CTA");
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    trackEvent("cta_click", {
      location: "floating_button",
      label: isMobile ? "lets_build_mobile" : "lets_build_desktop",
      route: pathname || "/",
    });
  };

  const buttonContent = (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
        <MessageSquare className="w-4 h-4" />
      </div>
      {/* Text label with responsive shortenings */}
      <span className="font-bold text-sm text-white pr-1">
        {/* Desktop text */}
        <span className="hidden sm:inline">Let&apos;s Build Your Product</span>
        {/* Mobile text */}
        <span className="inline sm:hidden">Let&apos;s Build</span>
      </span>
      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-200 hidden sm:inline" />
    </div>
  );

  const hoverAnimation = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -4, scale: 1.02 },
        whileTap: { y: 0, scale: 0.98 },
      };

  const entranceVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.8, y: 30 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 30 },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[90] pointer-events-auto"
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {pathname === "/" ? (
            <motion.button
              onClick={handleButtonClick}
              className="group flex items-center bg-[#0d0d0f]/95 hover:bg-[#131317]/95 border border-white/10 hover:border-blue-500/40 rounded-full p-2 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              aria-label="Let's build your product (scrolls to contact form)"
              {...hoverAnimation}
            >
              {buttonContent}
            </motion.button>
          ) : (
            <Link href="/#contact" passHref legacyBehavior>
              <motion.a
                onClick={handleLinkClick}
                className="group flex items-center bg-[#0d0d0f]/95 hover:bg-[#131317]/95 border border-white/10 hover:border-blue-500/40 rounded-full p-2 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                aria-label="Let's build your product (navigates to contact form)"
                {...hoverAnimation}
              >
                {buttonContent}
              </motion.a>
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
