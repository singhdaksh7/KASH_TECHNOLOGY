"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "nav-scrolled" : "bg-transparent"
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "py-3 h-16" : "py-5 h-20"
        )}
      >
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-[var(--radius-sm)]"
        >
          {SITE_CONFIG.companyName}
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-10" aria-label="Primary">
          {SITE_CONFIG.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-[var(--radius-sm)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LinkButton 
            href="/#contact" 
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold hover:brightness-110 transition-all"
          >
            Start a Project
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-[var(--radius-sm)] p-2 text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </Container>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
