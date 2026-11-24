"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ArrowRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    hasDropdown: true,
    children: [
      { label: "Website Development", href: "/website-development" },
      { label: "Custom Software & CRM", href: "/custom-software-development" },
      { label: "Mobile App Development", href: "/mobile-app-development" },
      { label: "ERP / CRM Systems", href: "/erp-development" },
      { label: "SaaS Development", href: "/saas-development" },
      { label: "AI & Automation", href: "/ai-automation" },
      { label: "Content Creation", href: "/content-creation" },
      { label: "Video Editing", href: "/video-editing" },
      { label: "Branding", href: "/branding" },
      { label: "Digital Marketing", href: "/digital-marketing" },
      { label: "Social Media Management", href: "/social-media-management" },
      { label: "SEO Services", href: "/seo-services" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Packages", href: "/services#packages" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200 border-b",
        scrolled
          ? "bg-[#FFF9F4]/95 backdrop-blur-md border-[#E8E5E2] py-2.5 shadow-sm"
          : "bg-[#FFF9F4] border-[#E8E5E2] py-3.5"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Logo */}
        <KashLogo variant="header" />

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || (item.children && pathname.startsWith(item.href));

            if (item.hasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative group py-1"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-[13.5px] font-medium transition-colors hover:text-[#FF5A00]",
                      isActive ? "text-[#FF5A00] font-semibold" : "text-[#0B0B0F]"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#4B5563] group-hover:text-[#FF5A00] group-hover:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full -left-4 pt-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="bg-[#FFFFFF] border border-[#E8E5E2] rounded-xl p-2 shadow-xl space-y-0.5">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#FF5A00] hover:bg-[#FFF3E9] rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13.5px] font-medium transition-colors hover:text-[#FF5A00]",
                  isActive ? "text-[#FF5A00] font-semibold" : "text-[#0B0B0F]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact?type=audit"
            className="px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#E8E5E2] text-xs font-semibold text-[#0B0B0F] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors shadow-2xs"
          >
            Get a Free Audit
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-xs font-semibold text-white hover:brightness-105 transition-all shadow-sm shadow-[#FF5A00]/25"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
          className="lg:hidden p-2 text-[#0B0B0F] hover:text-[#FF5A00] focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E8E5E2] px-6 py-6 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-[#0B0B0F] hover:text-[#FF5A00]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#E8E5E2] flex flex-col gap-2.5">
            <Link
              href="/contact?type=audit"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-[#E8E5E2] text-sm font-semibold text-[#0B0B0F]"
            >
              Get a Free Audit
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-sm font-semibold text-white"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
