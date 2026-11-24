import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CmsLink } from "@/components/cms/CmsLink";
import { RichText } from "@/components/cms/RichText";
import { SafeImage } from "@/components/cms/SafeImage";
import { safeImageSrc, safeHref } from "@/lib/cms/url-safety";
import { CardBox, PrimaryButton, SectionHeader, cta, num, objs, str, strs, type SectionProps } from "./util";

export function HeroSection({ section, isPrimaryHero }: SectionProps) {
  const c = section.content;
  const primary = cta(c.primaryCta);
  const secondary = cta(c.secondaryCta);
  const title = str(c.titlePrimary) ?? str(c.heading) ?? "";
  if (isPrimaryHero) {
    return (
      <HeroDiagonal
        badge={str(c.badge)}
        titlePrimary={title}
        titleAccent={str(c.titleAccent)}
        titleSecondary={str(c.titleSecondary)}
        description={str(c.description) ?? ""}
        primaryCtaText={primary?.label}
        primaryCtaHref={primary?.href}
        secondaryCtaText={secondary?.label}
        secondaryCtaHref={secondary?.href}
        quickLinks={objs(c.quickLinks, 10).flatMap((l) => {
          const x = cta(l);
          return x ? [x] : [];
        })}
      />
    );
  }
  // Secondary heroes are plain banners so a page keeps a single <h1>.
  return (
    <div className="mx-auto max-w-3xl space-y-4 py-4 text-center">
      {str(c.badge) && <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">{str(c.badge)}</span>}
      <h2 className="font-serif-heading text-3xl font-bold sm:text-5xl">
        {title} {str(c.titleAccent) && <span className="text-[var(--color-primary)]">{str(c.titleAccent)}</span>}
      </h2>
      {str(c.description) && <p className="text-lg opacity-80">{str(c.description)}</p>}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {primary && <CmsLink href={primary.href}><PrimaryButton>{primary.label}</PrimaryButton></CmsLink>}
        {secondary && <CmsLink href={secondary.href} className="inline-flex items-center border border-current/30 px-6 py-3 text-sm font-bold rounded-[var(--radius-button)]">{secondary.label}</CmsLink>}
      </div>
    </div>
  );
}

export function RichTextSection({ section }: SectionProps) {
  const c = section.content;
  return (
    <div className="mx-auto max-w-3xl">
      {str(c.heading) && <h2 className="mb-6 font-serif-heading text-3xl font-bold tracking-tight sm:text-4xl">{str(c.heading)}</h2>}
      <RichText value={c.body} />
    </div>
  );
}

export function ImageTextSection({ section }: SectionProps) {
  const c = section.content;
  const img = c.image && typeof c.image === "object" ? (c.image as Record<string, unknown>) : {};
  const action = cta(c.cta);
  const imageLeft = c.imagePosition === "left";
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={imageLeft ? "lg:order-2" : ""}>
        {str(c.badge) && <span className="mb-3 block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">{str(c.badge)}</span>}
        {str(c.heading) && <h2 className="mb-5 font-serif-heading text-3xl font-bold tracking-tight sm:text-4xl">{str(c.heading)}</h2>}
        <RichText value={c.body} />
        {action && (
          <div className="mt-6">
            <CmsLink href={action.href}><PrimaryButton>{action.label}</PrimaryButton></CmsLink>
          </div>
        )}
      </div>
      <SafeImage src={safeImageSrc(img.src)} alt={str(img.alt, 300) ?? ""} wrapperClassName="aspect-[4/3] w-full rounded-[var(--radius-card)]" />
    </div>
  );
}

export function CtaSection({ section }: SectionProps) {
  const c = section.content;
  return (
    <CtaBanner
      variant={c.variant === "dark" ? "dark" : "ivory"}
      title={str(c.title) ?? str(c.heading)}
      subtitle={str(c.subtitle) ?? str(c.description)}
      buttonText={str(c.buttonText) ?? cta(c.button)?.label}
      buttonHref={safeHref(c.buttonHref) ?? cta(c.button)?.href ?? undefined}
    />
  );
}

export function ProcessSection({ section }: SectionProps) {
  const c = section.content;
  const steps = objs(c.steps, 12).flatMap((s, i) => {
    const title = str(s.title, 120);
    return title ? [{ number: String(i + 1).padStart(2, "0"), title, description: str(s.description) ?? "" }] : [];
  });
  if (!steps.length) return null;
  return (
    <ProcessSteps
      badge={str(c.badge)}
      title={str(c.heading) ?? str(c.title)}
      subtitle={str(c.subheading)}
      steps={steps}
      variant={c.variant === "ivory" ? "ivory" : "dark"}
    />
  );
}

export function FaqSection({ section }: SectionProps) {
  const c = section.content;
  const items = objs(c.items, 40).flatMap((i) => {
    const q = str(i.question, 300);
    const a = str(i.answer, 4000);
    return q && a ? [{ q, a }] : [];
  });
  if (!items.length) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader badge={str(c.badge)} heading={str(c.heading) ?? "Frequently Asked Questions"} />
      <div className="divide-y divide-current/10 rounded-[var(--radius-card)] border border-current/10">
        {items.map((it, i) => (
          <details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">
              <span>{it.q}</span>
              <span aria-hidden className="text-[var(--color-primary)] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed opacity-80">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function StatsSection({ section }: SectionProps) {
  const c = section.content;
  const items = objs(c.items, 8).flatMap((i) => (str(i.value, 40) && str(i.label, 120) ? [{ v: str(i.value, 40)!, l: str(i.label, 120)! }] : []));
  if (!items.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="text-center">
            <dd className="font-serif-heading text-4xl font-bold text-[var(--color-primary)]">{it.v}</dd>
            <dt className="mt-1 text-sm opacity-75">{it.l}</dt>
          </div>
        ))}
      </dl>
    </>
  );
}

export function TrustStripSection({ section }: SectionProps) {
  const items = strs(section.content.items, 12);
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs font-semibold uppercase tracking-wider opacity-80">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function LogoStripSection({ section }: SectionProps) {
  const c = section.content;
  const logos = objs(c.logos, 16);
  if (!logos.length) return null;
  return (
    <>
      <SectionHeader heading={str(c.heading)} />
      <ul className="flex flex-wrap items-center justify-center gap-8">
        {logos.map((l, i) => {
          const img = <SafeImage src={safeImageSrc(l.src)} alt={str(l.alt, 200) ?? ""} className="object-contain" wrapperClassName="h-12 w-32 bg-transparent" />;
          return <li key={i}>{safeHref(l.href) ? <CmsLink href={l.href}>{img}</CmsLink> : img}</li>;
        })}
      </ul>
    </>
  );
}

export function FounderSection({ section }: SectionProps) {
  const c = section.content;
  return (
    <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
      <SafeImage src={safeImageSrc(c.image)} alt={str(c.name, 120) ?? "Founder"} wrapperClassName="aspect-square w-full rounded-[var(--radius-card)]" />
      <div>
        {str(c.badge) && <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">{str(c.badge)}</span>}
        <h2 className="font-serif-heading text-3xl font-bold">{str(c.name)}</h2>
        {str(c.role) && <p className="mb-4 text-sm font-semibold text-[var(--color-primary)]">{str(c.role)}</p>}
        <RichText value={c.bio} />
      </div>
    </div>
  );
}

export function TeamSection({ section }: SectionProps) {
  const c = section.content;
  const members = objs(c.members, 24);
  if (!members.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m, i) => (
          <li key={i}>
            <CardBox>
              <SafeImage src={safeImageSrc(m.image)} alt={str(m.name, 120) ?? "Team member"} wrapperClassName="mb-4 aspect-square w-full rounded-xl" />
              <h3 className="font-bold">{str(m.name)}</h3>
              {str(m.role) && <p className="text-sm text-[var(--color-primary)]">{str(m.role)}</p>}
              {str(m.bio) && <p className="mt-2 text-sm opacity-75">{str(m.bio)}</p>}
            </CardBox>
          </li>
        ))}
      </ul>
    </>
  );
}

function embedUrl(raw: unknown): string | null {
  const href = safeHref(raw);
  if (!href) return null;
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") ?? (u.pathname.startsWith("/embed/") ? u.pathname.slice(7) : null);
      return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d{4,12}$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* fallthrough */
  }
  return null;
}

export function VideoSection({ section }: SectionProps) {
  const c = section.content;
  const title = str(c.title, 200) ?? "Video";
  const embed = embedUrl(c.url);
  const direct = !embed && typeof c.url === "string" && /\.(mp4|webm)(\?|$)/i.test(c.url) ? safeImageSrc(c.url) : null;
  if (!embed && !direct) return null;
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeader heading={str(c.heading)} subheading={str(c.subheading)} />
      <div className="aspect-video overflow-hidden rounded-[var(--radius-card)] bg-black">
        {embed ? (
          <iframe src={embed} title={title} loading="lazy" className="h-full w-full" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allowFullScreen />
        ) : (
          <video src={direct!} controls preload="metadata" poster={safeImageSrc(c.poster) ?? undefined} className="h-full w-full" aria-label={title} />
        )}
      </div>
    </div>
  );
}

export function GallerySection({ section }: SectionProps) {
  const c = section.content;
  const images = objs(c.images, 36);
  if (!images.length) return null;
  const cols = num(c.columns, 3, 2, 4);
  const colCls = cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <ul className={`grid gap-4 sm:grid-cols-2 ${colCls}`}>
        {images.map((im, i) => (
          <li key={i}>
            <figure>
              <SafeImage src={safeImageSrc(im.src)} alt={str(im.alt, 300) ?? ""} wrapperClassName="aspect-[4/3] w-full rounded-[var(--radius-card)]" sizes="(min-width: 1024px) 33vw, 100vw" />
              {str(im.caption) && <figcaption className="mt-2 text-sm opacity-70">{str(im.caption)}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}

export function PricingSection({ section }: SectionProps) {
  const c = section.content;
  const plans = objs(c.plans, 6);
  if (!plans.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((p, i) => {
          const action = cta(p.cta);
          return (
            <CardBox key={i} className={p.highlighted === true ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : ""}>
              <h3 className="text-lg font-bold">{str(p.name, 80)}</h3>
              <p className="mt-2 font-serif-heading text-3xl font-bold">
                {str(p.price, 60)} {str(p.period, 30) && <span className="text-sm font-normal opacity-60">/ {str(p.period, 30)}</span>}
              </p>
              {str(p.description) && <p className="mt-2 text-sm opacity-75">{str(p.description)}</p>}
              <ul className="my-5 space-y-2 text-sm">
                {strs(p.features, 20).map((f) => (
                  <li key={f} className="flex gap-2"><span aria-hidden className="text-[var(--color-primary)]">✓</span>{f}</li>
                ))}
              </ul>
              {action && <CmsLink href={action.href}><PrimaryButton className="w-full">{action.label}</PrimaryButton></CmsLink>}
            </CardBox>
          );
        })}
      </div>
    </>
  );
}

export function TestimonialsSection({ section }: SectionProps) {
  const c = section.content;
  // Only renders testimonials supplied by the CMS — never fabricated.
  const items = objs(c.items, 12).flatMap((t) => (str(t.quote) && str(t.name, 120) ? [t] : []));
  if (!items.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <CardBox key={i}>
            <blockquote className="leading-relaxed">“{str(t.quote)}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-bold">{str(t.name, 120)}</span>
              {(str(t.role, 120) || str(t.company, 120)) && <span className="opacity-70"> — {[str(t.role, 120), str(t.company, 120)].filter(Boolean).join(", ")}</span>}
            </figcaption>
          </CardBox>
        ))}
      </div>
    </>
  );
}

const SPACER = { sm: "h-6", md: "h-12", lg: "h-20", xl: "h-32" } as const;
export function SpacerSection({ section }: SectionProps) {
  const h = typeof section.content.height === "string" && section.content.height in SPACER ? (section.content.height as keyof typeof SPACER) : "md";
  return <div aria-hidden className={SPACER[h]} />;
}
