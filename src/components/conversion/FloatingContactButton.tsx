"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";

export function FloatingContactButton() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    trackEvent("whatsapp_click", { location: "floating_whatsapp_button" });
  };

  const hoverAnimation = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -3, scale: 1.03 },
        whileTap: { y: 0, scale: 0.97 },
      };

  const entranceVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 pointer-events-auto"
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group flex items-center gap-2.5 bg-[#050708]/95 hover:bg-[#0b0d0e] border border-[#f36b21]/40 hover:border-[#f36b21] rounded-full py-2.5 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_15px_rgba(243,107,33,0.25)] backdrop-blur-md cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
            aria-label="Chat with KASH Technology on WhatsApp"
            {...hoverAnimation}
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="font-sans font-bold text-xs text-white pr-1">
              <span className="hidden sm:inline">WhatsApp Chat</span>
              <span className="inline sm:hidden">WhatsApp</span>
            </span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
