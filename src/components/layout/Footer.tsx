import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { KashLogo } from "@/components/branding/KashLogo";
import { FormEmbed } from "@/components/cms/FormEmbed";
import { FALLBACK_FOOTER } from "@/lib/cms/fallback-content";
import { safeHref } from "@/lib/cms/url-safety";
import type { FooterColumn, FooterConfig, SocialLink } from "@/lib/cms/types";
import { Phone, Mail, MapPin, MessageSquare, Globe } from "lucide-react";

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

const SOCIAL_LABEL: Record<SocialLink["platform"], string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  facebook: "Facebook",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

const ACCENT = {
  primary: { text: "text-[#f36b21]", dot: "bg-[#f36b21]" },
  gold: { text: "text-[#c5a880]", dot: "bg-[#c5a880]" },
  neutral: { text: "text-white", dot: "bg-[#f36b21]" },
} as const;

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  if (platform === "linkedin") return <LinkedInIcon className="w-3.5 h-3.5" />;
  if (platform === "github") return <GithubIcon className="w-3.5 h-3.5" />;
  if (platform === "whatsapp") return <MessageSquare className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
}

function ColumnBlock({ col }: { col: FooterColumn }) {
  const accent = ACCENT[col.accent ?? "neutral"];
  const isAreas = col.grid;
  return (
    <div className="space-y-3">
      <h4 className={`text-xs font-mono font-bold tracking-wider ${accent.text} uppercase flex items-center gap-1.5`}>
        {isAreas ? <MapPin className="w-3.5 h-3.5 text-[#f36b21]" /> : <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />} {col.title}
      </h4>
      {isAreas ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-[#9ca3af]">
          {col.links.map((l) => (
            <Link key={l.label} href={safeHref(l.href) ?? "/"} className="hover:text-white transition-colors hover:translate-x-0.5 transform duration-150">
              {l.label}
            </Link>
          ))}
        </div>
      ) : (
        <ul className="space-y-2 text-xs text-[#9ca3af]">
          {col.links.map((l) => (
            <li key={l.label}>
              <Link href={safeHref(l.href) ?? "/"} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const GENERIC_SPAN: Record<number, string> = { 1: "lg:col-span-8", 2: "lg:col-span-4", 3: "lg:col-span-2" };

interface FooterProps {
  /** CMS footer config. Omitted → current static footer content. */
  config?: FooterConfig;
}

export function Footer({ config = FALLBACK_FOOTER }: FooterProps) {
  const cols = config.columns;
  const areas = cols.filter((c) => c.grid);
  const regular = cols.filter((c) => !c.grid);
  // The approved layout: [Technology] [Creative + Marketing stacked] [Areas We Serve].
  const approvedLayout = regular.length === 3 && areas.length === 1;
  const waHref = config.whatsapp ? safeHref(config.whatsapp) : null;

  return (
    <footer className="border-t border-white/10 bg-[#050708] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background subtle circuit glow */}
      <div className="absolute inset-0 circuit-pattern-dark opacity-20 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-white/10">
          {/* Brand info & socials */}
          <div className="lg:col-span-4 space-y-4">
            <KashLogo variant="header" />
            <p className="text-xs text-[#9ca3af] leading-relaxed max-w-sm pt-2">{config.description}</p>
            {config.tagline && (
              <div className="text-[11px] font-mono text-[#f36b21] tracking-wider uppercase font-semibold">{config.tagline}</div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              {config.social
                .filter((s) => s.platform !== "whatsapp" && safeHref(s.href))
                .map((s) => (
                  <a
                    key={s.platform}
                    href={safeHref(s.href)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABEL[s.platform]}
                    className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-[#f36b21] hover:border-[#f36b21]/40 transition-colors"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="space-y-2 pt-2 text-xs text-[#9ca3af]">
              {config.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#f36b21]" />
                  <a href={`tel:${config.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors">
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#f36b21]" />
                  <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                    {config.email}
                  </a>
                </div>
              )}
            </div>

            {config.newsletter?.enabled && config.newsletter.formSlug && (
              <div className="pt-2 text-white">
                <FormEmbed formSlug={config.newsletter.formSlug} heading={config.newsletter.heading ?? "Newsletter"} />
              </div>
            )}
          </div>

          {approvedLayout ? (
            <>
              <div className="lg:col-span-2">
                <ColumnBlock col={regular[0]} />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <ColumnBlock col={regular[1]} />
                <ColumnBlock col={regular[2]} />
              </div>
              <div className="lg:col-span-3 space-y-3">
                <ColumnBlock col={areas[0]} />
                {config.note && <div className="pt-3 text-[11px] font-mono text-white/40">{config.note}</div>}
              </div>
            </>
          ) : (
            cols.map((c) => (
              <div key={c.title} className={GENERIC_SPAN[Math.min(cols.length, 3)] ?? "lg:col-span-2"}>
                <ColumnBlock col={c} />
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <p>{config.copyright}</p>
          <div className="flex items-center gap-6">
            {config.legal.map((l, i) => (
              <span key={l.label} className="flex items-center gap-6">
                {i > 0 && <span className="text-white/20">|</span>}
                <Link href={safeHref(l.href) ?? "/"} className="hover:text-white transition-colors">
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
