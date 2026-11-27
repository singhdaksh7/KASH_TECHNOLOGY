"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, ChevronDown, ArrowRight } from "lucide-react";
import { KashLogo } from "@/components/branding/KashLogo";
import { SITE_CONFIG } from "@/lib/constants";
import type { HeaderConfig } from "@/lib/cms/types";
import { FALLBACK_HEADER } from "@/lib/cms/fallback-content";
import { safeHref } from "@/lib/cms/url-safety";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  config?: HeaderConfig;
}

export function MobileNavigation({ open, onClose, config = FALLBACK_HEADER }: MobileNavigationProps) {
  const primaryCta = config.primaryCta ?? FALLBACK_HEADER.primaryCta!;
  const pathname = usePathname();
  // Store expanded accordion keys (default open currently active section)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Technology: true,
    Creative: false,
    Marketing: false,
  });

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
              <KashLogo variant="dark" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Links with Nested Accordions */}
            <nav className="flex flex-col gap-1.5 py-6">
              {config.menu.map((link) => {
                const hasChildren = "children" in link && Boolean(link.children?.length);
                const isChildActive = hasChildren && link.children?.some((c) => pathname === c.href);
                const isActive = pathname === link.href || isChildActive;
                const isExpanded = Boolean(expandedSections[link.label]);

                if (hasChildren && link.children) {
                  return (
                    <div key={link.label} className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                      <button
                        type="button"
                        onClick={() => toggleSection(link.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold transition-colors",
                          isActive ? "text-[#f36b21]" : "text-white/90 hover:text-white"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span>{link.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f36b21]" />
                          )}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-white/50 transition-transform duration-200",
                            isExpanded ? "rotate-180 text-[#f36b21]" : ""
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 pb-3 space-y-1 overflow-hidden"
                          >
                            {link.children.map((child) => {
                              const isCurrent = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isCurrent
                                      ? "bg-[#f36b21]/15 text-[#f36b21] font-semibold"
                                      : "text-white/70 hover:bg-white/5 hover:text-white"
                                  )}
                                >
                                  <span>{child.label}</span>
                                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors",
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
              href={safeHref(primaryCta.href) ?? "/contact"}
              onClick={() => {
                trackEvent("book_call_click", { location: "mobile_navigation" });
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white font-bold tracking-wide transition-all shadow-[0_4px_14px_rgba(243,107,33,0.35)]"
            >
              <Calendar className="w-4 h-4" />
              <span>{primaryCta.label}</span>
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
