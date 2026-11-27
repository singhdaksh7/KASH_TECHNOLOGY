import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { FALLBACK_FOOTER } from "@/lib/cms/fallback-content";
import { safeHref } from "@/lib/cms/url-safety";
import type { FooterConfig } from "@/lib/cms/types";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface FooterProps {
  /** CMS footer config. Omitted → approved static footer (FALLBACK_FOOTER). */
  config?: FooterConfig;
}

const ICON_PLATFORMS = ["linkedin", "github", "instagram", "youtube"] as const;
type IconPlatform = (typeof ICON_PLATFORMS)[number];
const ICON_LABEL: Record<IconPlatform, string> = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram", youtube: "YouTube" };
const isIconPlatform = (p: string): p is IconPlatform => (ICON_PLATFORMS as readonly string[]).includes(p);

export function Footer({ config = FALLBACK_FOOTER }: FooterProps) {
  return (
    <footer className="bg-[#FFF9F4] border-t border-[#E8E5E2] pt-16 pb-12 text-[#0B0B0F]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#E8E5E2]">
          
          {/* Brand & Mission Statement (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <KashLogo variant="footer" />
            <p className="text-sm text-[#4B5563] leading-relaxed max-w-sm">
              KASH Technology is an engineering-driven digital product studio. We architect high-performance web systems, custom business software, brand identities, and high-converting growth funnels.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              {config.social
                .filter((s) => isIconPlatform(s.platform) && safeHref(s.href))
                .map((s) => (
                  <a
                    key={s.platform}
                    href={safeHref(s.href)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ICON_LABEL[s.platform as IconPlatform]}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-xs"
                  >
                    <SocialIcon name={s.platform as IconPlatform} className="w-4 h-4" />
                  </a>
                ))}
            </div>

            <div className="pt-2 text-xs font-mono text-[#0B0B0F]/70">
              Regional HQ: Delhi NCR &bull; Western UP &bull; Operating Globally
            </div>
          </div>

          {/* Navigation Columns (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A00]">
                CAPABILITIES
              </h4>
              <ul className="space-y-2.5 text-sm text-[#4B5563]">
                <li>
                  <Link href="/website-development" className="hover:text-[#FF5A00] transition-colors">
                    Web &amp; SaaS Platforms
                  </Link>
                </li>
                <li>
                  <Link href="/custom-software-development" className="hover:text-[#FF5A00] transition-colors">
                    Custom Software &amp; CRM
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app-development" className="hover:text-[#FF5A00] transition-colors">
                    Mobile Applications
                  </Link>
                </li>
                <li>
                  <Link href="/branding" className="hover:text-[#FF5A00] transition-colors">
                    Brand &amp; Identity Systems
                  </Link>
                </li>
                <li>
                  <Link href="/content-creation" className="hover:text-[#FF5A00] transition-colors">
                    Video &amp; Motion Media
                  </Link>
                </li>
                <li>
                  <Link href="/seo-services" className="hover:text-[#FF5A00] transition-colors">
                    Technical SEO &amp; Growth
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A00]">
                STUDIO
              </h4>
              <ul className="space-y-2.5 text-sm text-[#4B5563]">
                <li>
                  <Link href="/portfolio" className="hover:text-[#FF5A00] transition-colors">
                    Selected Work &amp; Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#FF5A00] transition-colors">
                    Our Team &amp; Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#FF5A00] transition-colors">
                    All Services &amp; Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="hover:text-[#FF5A00] transition-colors">
                    Engineering Insights
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#FF5A00] transition-colors font-semibold text-[#0B0B0F]">
                    Request a Project Brief
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Direct & Quick Inquiries (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A00]">
              DIRECT ENGAGEMENT
            </h4>
            <div className="space-y-3 text-sm text-[#4B5563]">
              {config.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <a href={`tel:${config.phone.replace(/[^\d+]/g, "")}`} className="hover:text-[#FF5A00] transition-colors font-medium">
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:text-[#FF5A00] transition-colors break-all">
                    {config.email}
                  </a>
                </div>
              )}
              {config.whatsapp && safeHref(config.whatsapp) && (
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <a href={safeHref(config.whatsapp)!} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A00] transition-colors font-medium">
                    WhatsApp Studio Direct
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B0B0F] text-white text-xs font-bold hover:bg-black transition-all shadow-sm"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563]">
          <p>{config.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#FF5A00] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FF5A00] transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-[#FF5A00] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
