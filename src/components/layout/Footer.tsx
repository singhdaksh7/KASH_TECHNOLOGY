import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { Phone, Mail, MapPin } from "lucide-react";
import { FALLBACK_FOOTER } from "@/lib/cms/fallback-content";
import { safeHref } from "@/lib/cms/url-safety";
import type { FooterConfig } from "@/lib/cms/types";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface FooterProps {
  /** CMS footer config. Omitted → approved static footer (FALLBACK_FOOTER). */
  config?: FooterConfig;
}

const ICON_PLATFORMS = ["linkedin", "github", "instagram", "youtube"] as const;
type IconPlatform = (typeof ICON_PLATFORMS)[number];
const isIconPlatform = (p: string): p is IconPlatform => (ICON_PLATFORMS as readonly string[]).includes(p);

export function Footer({ config = FALLBACK_FOOTER }: FooterProps) {
  return (
    <footer className="bg-[#FFF9F4] border-t border-[#E8E5E2] pt-14 pb-8 text-[#0B0B0F]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8E5E2]">
          
          {/* Col 1: Brand & Bio (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <KashLogo variant="footer" />
            <p className="text-xs text-[#4B5563] leading-relaxed max-w-xs">
              {config.description}
            </p>
            {/* Social Icons row */}
            <div className="flex items-center gap-2 pt-2">
              {config.social
                .filter((s) => isIconPlatform(s.platform) && safeHref(s.href))
                .map((s) => (
                  <a
                    key={s.platform}
                    href={safeHref(s.href)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
                    className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8E5E2] flex items-center justify-center text-[#4B5563] hover:text-[#FF5A00] hover:border-[#FF5A00] transition-colors shadow-2xs"
                  >
                    <SocialIcon name={s.platform as IconPlatform} className="w-4 h-4" />
                  </a>
                ))}
            </div>
          </div>

          {config.columns.map((col, i) => (
            <div key={col.title} className={`${i === 0 ? "lg:col-span-2" : "lg:col-span-3"} space-y-3`}>
              <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={safeHref(l.href) ?? "/"}
                      className={l.href === "/contact" ? "text-[#FF5A00] font-semibold hover:underline" : "hover:text-[#FF5A00] transition-colors"}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: Contact Us (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#4B5563]">
              {config.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <a href={`tel:${config.phone.replace(/[^\d+]/g, "")}`} className="hover:text-[#FF5A00] transition-colors font-medium">
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <a href={`mailto:${config.email}`} className="hover:text-[#FF5A00] transition-colors break-all">
                    {config.email}
                  </a>
                </div>
              )}
              {config.whatsapp && safeHref(config.whatsapp) && (
                <div className="flex items-start gap-2">
                  <span className="w-3.5 shrink-0" />
                  <a href={safeHref(config.whatsapp)!} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A00] transition-colors">
                    WhatsApp
                  </a>
                </div>
              )}
              {config.note && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5A00] shrink-0 mt-0.5" />
                  <span className="leading-snug">{config.note}</span>
                </div>
              )}
            </div>
          </div>

          {config.newsletter?.enabled && (
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
                {config.newsletter.heading ?? "Stay in the Loop"}
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Get digital tips, industry insights and KASH updates, straight to your inbox.
              </p>
              <FooterNewsletter formSlug={config.newsletter.formSlug} />
            </div>
          )}

        </div>

        {/* Bottom Rights & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563]">
          <p>{config.copyright}</p>
          <div className="flex items-center gap-4">
            {config.legal.map((l, i) => (
              <span key={l.label} className="flex items-center gap-4">
                {i > 0 && <span>|</span>}
                <Link href={safeHref(l.href) ?? "/"} className="hover:text-[#FF5A00] transition-colors">
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
