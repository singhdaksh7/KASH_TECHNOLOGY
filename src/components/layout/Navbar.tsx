"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Calendar, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { KashLogo } from "@/components/branding/KashLogo";
import { SITE_CONFIG } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200 border-b",
        scrolled 
          ? "bg-[#050708]/95 backdrop-blur-md border-[#f36b21]/20 py-3 shadow-2xl" 
          : "bg-[#050708] border-white/5 py-4"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Logo */}
        <KashLogo variant="header" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary">
          {SITE_CONFIG.navLinks.map((link) => {
            const hasChildren = "children" in link && Boolean(link.children?.length);
            const isChildActive = hasChildren && link.children?.some((c) => pathname === c.href);
            const isActive = pathname === link.href || isChildActive;

            if (hasChildren && link.children) {
              return (
                <div key={link.label} className="relative group py-2">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-all duration-200 py-1 focus:outline-none",
                      isActive
                        ? "text-[#f36b21] font-semibold"
                        : "text-[#d1d5db] group-hover:text-white"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-transform duration-200 text-[#f36b21]" />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f36b21] rounded-full shadow-[0_0_8px_#f36b21]" />
                    )}
                  </Link>

                  {/* Desktop Dropdown Flyout */}
                  <div className="absolute top-full left-0 pt-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                    <div className="bg-[#0b0e14]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.85)] space-y-1">
                      {link.children.map((child) => {
                        const isCurrent = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group/item",
                              isCurrent
                                ? "bg-[#f36b21]/15 text-[#f36b21] font-semibold border border-[#f36b21]/30"
                                : "text-white/80 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <span>{child.label}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f36b21] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 relative py-1",
                  isActive
                    ? "text-[#f36b21] font-semibold"
                    : "text-[#d1d5db] hover:text-white"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f36b21] rounded-full shadow-[0_0_8px_#f36b21]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href={SITE_CONFIG.bookingUrl}
            onClick={() => trackEvent("book_call_click", { location: "navbar" })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#f36b21] hover:bg-[#e05b14] text-white text-xs font-bold tracking-wide transition-all shadow-[0_4px_14px_rgba(243,107,33,0.35)] hover:shadow-[0_6px_20px_rgba(243,107,33,0.5)] active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Start Your Project</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
        >
          <Menu className="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </Container>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
