"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { SITE_CONFIG } from "@/lib/constants";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#FFF9F4] border-t border-[#E8E5E2] pt-14 pb-8 text-[#0B0B0F]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8E5E2]">
          
          {/* Col 1: Brand & Bio (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <KashLogo variant="footer" />
            <p className="text-xs text-[#4B5563] leading-relaxed max-w-xs">
              A full-service digital & technology agency helping businesses Build, Create and Grow.
            </p>
            {/* Social Icons row */}
            <div className="flex items-center gap-2 pt-2">
              {SITE_CONFIG.social.linkedin && (
                <a
                  href={SITE_CONFIG.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-2xs"
                >
                  <SocialIcon name="linkedin" className="w-4 h-4" />
                </a>
              )}
              {SITE_CONFIG.social.github && (
                <a
                  href={SITE_CONFIG.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-2xs"
                >
                  <SocialIcon name="github" className="w-4 h-4" />
                </a>
              )}
              {SITE_CONFIG.social.instagram && (
                <a
                  href={SITE_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-2xs"
                >
                  <SocialIcon name="instagram" className="w-4 h-4" />
                </a>
              )}
              {SITE_CONFIG.social.youtube && (
                <a
                  href={SITE_CONFIG.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-2xs"
                >
                  <SocialIcon name="youtube" className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#4B5563]">
              <li>
                <Link href="/" className="hover:text-[#FF5A00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5A00] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FF5A00] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#FF5A00] transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services#packages" className="hover:text-[#FF5A00] transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#FF5A00] transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#FF5A00] font-semibold hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Our Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs text-[#4B5563]">
              <li>
                <Link href="/website-development" className="hover:text-[#FF5A00] transition-colors">
                  Website Development
                </Link>
              </li>
              <li>
                <Link href="/mobile-app-development" className="hover:text-[#FF5A00] transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link href="/custom-software-development" className="hover:text-[#FF5A00] transition-colors">
                  Custom Software / CRM / ERP
                </Link>
              </li>
              <li>
                <Link href="/social-media-management" className="hover:text-[#FF5A00] transition-colors">
                  Social Media Management
                </Link>
              </li>
              <li>
                <Link href="/content-creation" className="hover:text-[#FF5A00] transition-colors">
                  Content & Video Production
                </Link>
              </li>
              <li>
                <Link href="/seo-services" className="hover:text-[#FF5A00] transition-colors">
                  SEO & Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/lead-generation" className="hover:text-[#FF5A00] transition-colors">
                  Lead Generation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#4B5563]">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                <a href={`tel:${SITE_CONFIG.contactPhonePrimary.replace(/\s+/g, "")}`} className="hover:text-[#FF5A00] transition-colors font-medium">
                  {SITE_CONFIG.contactPhonePrimary}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="hover:text-[#FF5A00] transition-colors break-all">
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Serving businesses across<br />
                  Delhi NCR &amp; Western UP
                </span>
              </div>
            </div>
          </div>

          {/* Col 5: Stay Updated / Newsletter (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
              Stay in the Loop
            </h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Get digital tips, industry insights and KASH updates, straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E8E5E2] rounded-lg text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="p-2 bg-[#FF5A00] text-white rounded-lg hover:bg-[#FF8A3D] transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-[#FF5A00] font-medium">Thank you for subscribing!</p>
            )}
          </div>

        </div>

        {/* Bottom Rights & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563]">
          <p>© 2026 KASH Technology. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#FF5A00] transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-[#FF5A00] transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/sitemap" className="hover:text-[#FF5A00] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
