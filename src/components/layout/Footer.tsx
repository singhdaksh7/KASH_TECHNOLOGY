"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { SITE_CONFIG } from "@/lib/constants";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_LINKS = [
  { label: "Web Development", href: "/services" },
  { label: "Mobile Apps", href: "/services" },
  { label: "Custom Software", href: "/services" },
  { label: "AI Automation", href: "/services" },
  { label: "ERP / CRM Systems", href: "/services" },
  { label: "E-commerce Solutions", href: "/services" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050708] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background subtle circuit glow */}
      <div className="absolute inset-0 circuit-pattern-dark opacity-20 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand info & socials (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <KashLogo variant="header" />
            <p className="text-xs text-[#9ca3af] leading-relaxed max-w-sm pt-2">
              We build custom software, apps, and digital solutions that help businesses innovate, grow, and scale.
            </p>

            {/* Social & Contact Direct Actions */}
            <div className="flex items-center gap-2.5 pt-3">
              {SITE_CONFIG.social.linkedin && (
                <a
                  href={SITE_CONFIG.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-[#f36b21] hover:border-[#f36b21]/40 transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {SITE_CONFIG.social.github && (
                <a
                  href={SITE_CONFIG.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-[#f36b21] hover:border-[#f36b21]/40 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-2 or 3) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9ca3af]">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors duration-150">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9ca3af]">
              {SERVICES_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors duration-150">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-[#9ca3af]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#f36b21] shrink-0" />
                <a href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.contactPhonePrimary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#f36b21] shrink-0" />
                <a href={`tel:${SITE_CONFIG.contactPhoneAlternate.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.contactPhoneAlternate}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#f36b21] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="hover:text-white transition-colors break-all">
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f36b21] shrink-0 mt-0.5" />
                <span className="text-[#9ca3af]">
                  {SITE_CONFIG.locationText}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <p>© 2026 KASH Technology. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
