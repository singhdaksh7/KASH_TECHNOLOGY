"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, ArrowRight } from "lucide-react";
import { KashLogo } from "@/components/branding/KashLogo";
import { SITE_CONFIG } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#050708]/98 backdrop-blur-xl flex flex-col justify-between lg:hidden p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <KashLogo variant="header" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2 py-8">
              {SITE_CONFIG.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-lg text-lg font-medium transition-colors",
                      isActive
                        ? "bg-[#f36b21]/15 text-[#f36b21] font-semibold border-l-2 border-[#f36b21]"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <Link
              href={SITE_CONFIG.bookingUrl}
              onClick={() => {
                trackEvent("book_call_click", { location: "mobile_navigation" });
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white font-bold tracking-wide transition-all shadow-[0_4px_14px_rgba(243,107,33,0.35)]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Call</span>
            </Link>
            <p className="text-center text-xs text-white/40 font-mono tracking-wider">
              {SITE_CONFIG.tagline}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
