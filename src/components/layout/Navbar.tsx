"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ArrowRight, X, Code2, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { cn } from "@/lib/utils";
import type { HeaderConfig } from "@/lib/cms/types";
import { FALLBACK_HEADER } from "@/lib/cms/fallback-content";
import { safeHref } from "@/lib/cms/url-safety";

interface NavbarProps {
  config?: HeaderConfig;
}

export function Navbar({ config = FALLBACK_HEADER }: NavbarProps) {
  const primaryCta = config.primaryCta ?? FALLBACK_HEADER.primaryCta!;
  const secondaryCta = config.secondaryCta ?? FALLBACK_HEADER.secondaryCta;
  const announcement = config.announcement;
  const announcementHref = announcement?.href ? safeHref(announcement.href) : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on path change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  const SERVICE_GROUPS = [
    {
      pillar: "BUILD",
      desc: "Engineered platforms, high-speed software & apps",
      icon: Code2,
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      services: [
        { label: "Website Development", href: "/website-development", desc: "Next.js & high-converting platforms" },
        { label: "Custom Software & CRM", href: "/custom-software-development", desc: "Tailored business logic & tools" },
        { label: "Mobile App Development", href: "/mobile-app-development", desc: "iOS, Android & cross-platform" },
        { label: "ERP / CRM Systems", href: "/erp-development", desc: "Operations & inventory pipelines" },
        { label: "SaaS Development", href: "/saas-development", desc: "Multi-tenant software & cloud" },
        { label: "AI & Automation", href: "/ai-automation", desc: "Autonomous workflows & smart LLMs" },
      ],
    },
    {
      pillar: "CREATE",
      desc: "Distinct visual identities, videos & content",
      icon: Sparkles,
      accent: "text-purple-600 bg-purple-50 border-purple-200",
      services: [
        { label: "Content Creation", href: "/content-creation", desc: "Brand copy, articles & narrative" },
        { label: "Video Editing", href: "/video-editing", desc: "Reels, explainers & studio cuts" },
        { label: "Branding & Design", href: "/branding", desc: "Logos, type, voice & guidelines" },
      ],
    },
    {
      pillar: "GROW",
      desc: "Performance marketing, high-intent SEO & social",
      icon: TrendingUp,
      accent: "text-[#FF5A00] bg-[#FFF3E9] border-[#FF5A00]/20",
      services: [
        { label: "Digital Marketing", href: "/digital-marketing", desc: "Multi-channel paid campaigns" },
        { label: "Social Media Management", href: "/social-media-management", desc: "Active community distribution" },
        { label: "SEO Services", href: "/seo-services", desc: "Technical & regional SERP dominance" },
      ],
    },
  ];

  return (
    <header
      className={cn(
        "top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b",
        config.sticky === false ? "absolute" : "fixed",
        scrolled
          ? "bg-[#FFF9F4]/90 backdrop-blur-xl border-[#E8E5E2] py-3 shadow-xs"
          : "bg-[#FFF9F4] border-[#E8E5E2]/80 py-4"
      )}
    >
      {announcement?.text && (
        <div className="-mt-4 mb-3 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] px-4 py-1.5 text-center text-xs font-semibold text-white">
          {announcementHref ? (
            <Link href={announcementHref} className="hover:underline">
              {announcement.text}
            </Link>
          ) : (
            announcement.text
          )}
        </div>
      )}

      <Container className="flex items-center justify-between">
        {/* Brand Logo */}
        <KashLogo variant="header" />

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {/* Services Mega-Menu Trigger */}
          <div
            className="relative py-2 group"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 hover:text-[#FF5A00]",
                pathname.startsWith("/services") || pathname.includes("-development") || pathname.includes("-marketing")
                  ? "text-[#FF5A00]"
                  : "text-[#0B0B0F]"
              )}
            >
              <span>Services</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-stone-400 group-hover:text-[#FF5A00] transition-transform duration-200",
                  servicesOpen && "rotate-180 text-[#FF5A00]"
                )}
              />
            </Link>

            {/* Services Mega-Menu Panel */}
            <div
              className={cn(
                "absolute top-full -left-20 pt-3 w-[840px] transition-all duration-200 z-50",
                servicesOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              )}
            >
              <div className="bg-white border border-[#E8E5E2] rounded-2xl p-6 shadow-2xl grid grid-cols-3 gap-6">
                {SERVICE_GROUPS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.pillar} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#E8E5E2]">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border", group.accent)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold tracking-wider text-[#0B0B0F]">
                            {group.pillar}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {group.services.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-2 rounded-lg hover:bg-[#FFF9F4] group/item transition-colors"
                          >
                            <p className="text-xs font-bold text-[#0B0B0F] group-hover/item:text-[#FF5A00] transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-[#4B5563] line-clamp-1">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href="/portfolio"
            className={cn(
              "text-sm font-semibold transition-colors hover:text-[#FF5A00]",
              pathname.startsWith("/portfolio") || pathname.startsWith("/work")
                ? "text-[#FF5A00]"
                : "text-[#0B0B0F]"
            )}
          >
            Work
          </Link>

          <Link
            href="/about"
            className={cn(
              "text-sm font-semibold transition-colors hover:text-[#FF5A00]",
              pathname === "/about" ? "text-[#FF5A00]" : "text-[#0B0B0F]"
            )}
          >
            About
          </Link>

          <Link
            href="/insights"
            className={cn(
              "text-sm font-semibold transition-colors hover:text-[#FF5A00]",
              pathname.startsWith("/insights") ? "text-[#FF5A00]" : "text-[#0B0B0F]"
            )}
          >
            Insights
          </Link>

          <Link
            href="/contact"
            className={cn(
              "text-sm font-semibold transition-colors hover:text-[#FF5A00]",
              pathname === "/contact" ? "text-[#FF5A00]" : "text-[#0B0B0F]"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {secondaryCta && (
            <Link
              href={safeHref(secondaryCta.href) ?? "/contact?type=audit"}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E8E5E2] text-xs font-bold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-all shadow-2xs"
            >
              {secondaryCta.label}
            </Link>
          )}

          <Link
            href={safeHref(primaryCta.href) ?? "/contact"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-xs font-bold text-white hover:brightness-105 transition-all shadow-sm shadow-[#FF5A00]/25"
          >
            <span>{primaryCta.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="lg:hidden p-2 text-[#0B0B0F] hover:text-[#FF5A00] transition-colors focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* Mobile Drawer Navigation with Grouped Accordions */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 bg-[#FFF9F4] border-t border-[#E8E5E2] overflow-y-auto px-6 py-6 flex flex-col justify-between shadow-2xl z-40">
          <div className="space-y-6">
            <div className="space-y-1">
              <Link
                href="/"
                className="block py-2.5 text-base font-bold text-[#0B0B0F]"
              >
                Home
              </Link>

              {/* Mobile Services Group */}
              <div className="py-2 border-y border-[#E8E5E2] my-2 space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider text-[#FF5A00] uppercase block">
                  Capabilities & Services
                </span>
                {SERVICE_GROUPS.map((group) => (
                  <div key={group.pillar} className="pl-2 border-l-2 border-[#FF5A00]/40 space-y-1 py-1">
                    <span className="text-xs font-bold text-[#0B0B0F] block">
                      {group.pillar}
                    </span>
                    <div className="grid grid-cols-1 gap-1 pt-1">
                      {group.services.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="text-xs text-[#4B5563] hover:text-[#FF5A00] py-1 block"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/portfolio"
                className="block py-2 text-base font-bold text-[#0B0B0F]"
              >
                Work & Case Studies
              </Link>
              <Link
                href="/about"
                className="block py-2 text-base font-bold text-[#0B0B0F]"
              >
                About KASH
              </Link>
              <Link
                href="/insights"
                className="block py-2 text-base font-bold text-[#0B0B0F]"
              >
                Insights & Engineering
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-base font-bold text-[#0B0B0F]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Bottom CTAs */}
          <div className="pt-6 border-t border-[#E8E5E2] space-y-3">
            <Link
              href="/contact"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-center text-sm font-bold shadow-md block"
            >
              Start Your Project &rarr;
            </Link>
            <Link
              href="/contact?type=audit"
              className="w-full py-3 rounded-xl bg-white border border-[#E8E5E2] text-[#0B0B0F] text-center text-xs font-bold block"
            >
              Get a Free Digital Audit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
