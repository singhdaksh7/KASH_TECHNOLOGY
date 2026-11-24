import { safeHref } from "./url-safety";

/**
 * Canonical section vocabulary shared by the Page Builder (admin), the API mapping layer and the
 * public renderer. The builder shows human labels; the database + renderer use the ids.
 * Every label the builder can save MUST appear here AND in SECTION_REGISTRY (enforced by tests).
 */
export const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  richText: "Rich Text",
  imageText: "Image + Text",
  textImage: "Text + Image",
  servicesGrid: "Services Grid",
  portfolioGrid: "Portfolio Grid",
  featuredProject: "Featured Project",
  cta: "CTA",
  faq: "FAQ",
  stats: "Stats",
  trustStrip: "Trust Strip",
  logoStrip: "Logo Strip",
  founder: "Founder",
  team: "Team",
  process: "Process",
  video: "Video",
  gallery: "Gallery",
  contactForm: "Contact Form",
  pricing: "Pricing",
  testimonials: "Testimonials",
  insightsFeed: "Insights Feed",
  spacer: "Spacer",
  customEmbed: "Custom Embed",
  serviceShowcase: "Service Showcase",
  agencyPillars: "Agency Pillars",
  builtIn: "Built-in Page",
};
export const LABEL_TO_ID: Record<string, string> = Object.fromEntries(Object.entries(SECTION_LABELS).map(([id, label]) => [label, id]));
export const labelToId = (label: string) => LABEL_TO_ID[label] ?? label;
export const idToLabel = (id: string) => SECTION_LABELS[id] ?? id;

type Obj = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

/** Maps the Page Builder's field names onto the renderer's canonical content keys (canonical keys always win). */
export function normalizeContent(type: string, c: Obj): Obj {
  const out: Obj = { ...c };
  const alias = (to: string, from: string) => {
    if (out[to] === undefined && c[from] !== undefined) out[to] = c[from];
  };
  switch (type) {
    case "hero": {
      alias("titlePrimary", "heading");
      alias("titleAccent", "highlightText");
      if (typeof c.primaryCta === "string") out.primaryCta = { label: c.primaryCta, href: s(c.primaryCtaUrl) ?? "/contact" };
      if (typeof c.secondaryCta === "string") out.secondaryCta = { label: c.secondaryCta, href: s(c.secondaryCtaUrl) ?? "/portfolio" };
      break;
    }
    case "richText":
      alias("heading", "title");
      break;
    case "cta":
      alias("title", "heading");
      alias("subtitle", "subheading");
      alias("buttonHref", "buttonUrl");
      break;
    case "faq":
      alias("items", "faqs");
      alias("subheading", "description");
      break;
    case "imageText":
      out.imagePosition = out.imagePosition ?? "left";
      break;
    case "textImage":
      out.imagePosition = out.imagePosition ?? "right";
      break;
    default:
      alias("badge", "label");
      alias("subheading", "description");
  }
  return out;
}

/* ───────── style ───────── */
export interface ResolvedStyle {
  bgClass: string;
  textClass: string;
  inline: Record<string, string | number>;
  pt: string;
  pb: string;
  maxWidth?: string;
  align: string;
  radius: string;
  shadow: string;
  border: string;
  customClass: string;
}

const BG: Record<string, { cls: string; light?: boolean }> = {
  default: { cls: "bg-[var(--color-ivory)] text-[#0B0B0F]" },
  white: { cls: "bg-white text-[#0B0B0F]" },
  ivory: { cls: "bg-[var(--color-ivory)] text-[#0B0B0F]" },
  peach: { cls: "bg-[#FFF3E9] text-[#0B0B0F]" },
  dark: { cls: "bg-[#0B0B0F] text-white" },
  black: { cls: "bg-[#0B0B0F] text-white" },
  primary: { cls: "bg-[var(--color-primary)] text-white" },
  orange: { cls: "bg-[var(--color-primary)] text-white" },
  gradient: { cls: "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white" },
  transparent: { cls: "" },
};
const TEXT: Record<string, string> = { auto: "", light: "text-white", dark: "text-[#0B0B0F]" };
const PT: Record<string, string> = { none: "pt-0", sm: "pt-8", md: "pt-12 md:pt-16", lg: "pt-16 md:pt-24", xl: "pt-24 md:pt-32" };
const PB: Record<string, string> = { none: "pb-0", sm: "pb-8", md: "pb-12 md:pb-16", lg: "pb-16 md:pb-24", xl: "pb-24 md:pb-32" };
const ALIGN: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right" };
const RADIUS: Record<string, string> = { none: "", sm: "rounded-md overflow-hidden", md: "rounded-xl overflow-hidden", lg: "rounded-2xl overflow-hidden", xl: "rounded-3xl overflow-hidden" };
const SHADOW: Record<string, string> = { none: "", small: "shadow-sm", sm: "shadow-sm", medium: "shadow-md", md: "shadow-md", large: "shadow-xl", lg: "shadow-xl" };
const WIDTH: Record<string, string | undefined> = { narrow: "42rem", default: "var(--container-width)", normal: "56rem", wide: "72rem", full: undefined };
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const key = (v: unknown) => (typeof v === "string" ? v.toLowerCase() : "");
const lookup = (map: Record<string, string>, v: unknown) => (Object.prototype.hasOwnProperty.call(map, key(v)) ? map[key(v)] : "");
const clampRem = (n: number) => `${Math.min(12, Math.max(0, n))}rem`;

export function resolveStyle(raw: unknown): ResolvedStyle {
  const st = (raw && typeof raw === "object" ? raw : {}) as Obj;
  const inline: Record<string, string | number> = {};
  const bgKey = key(st.background) || "default";
  let bgClass = Object.prototype.hasOwnProperty.call(BG, bgKey) ? BG[bgKey].cls : BG.default.cls;
  if (bgKey === "custom") {
    const hex = typeof st.customColor === "string" && HEX.test(st.customColor.trim()) ? st.customColor.trim() : null;
    bgClass = "";
    if (hex) inline.backgroundColor = hex;
  }
  const padTop = typeof st.paddingTop === "number" ? undefined : lookup(PT, st.paddingTop);
  const padBottom = typeof st.paddingBottom === "number" ? undefined : lookup(PB, st.paddingBottom);
  if (typeof st.paddingTop === "number") inline.paddingTop = clampRem(st.paddingTop);
  if (typeof st.paddingBottom === "number") inline.paddingBottom = clampRem(st.paddingBottom);
  if (typeof st.borderRadius === "number") inline.borderRadius = `${Math.min(64, Math.max(0, st.borderRadius))}px`;
  return {
    bgClass,
    textClass: lookup(TEXT, st.textColor),
    inline,
    pt: padTop ?? (typeof st.paddingTop === "number" ? "" : "pt-[var(--section-spacing)]"),
    pb: padBottom ?? (typeof st.paddingBottom === "number" ? "" : "pb-[var(--section-spacing)]"),
    maxWidth: key(st.container) ? WIDTH[key(st.container)] : WIDTH.default,
    align: lookup(ALIGN, st.alignment),
    radius: typeof st.borderRadius === "number" ? "overflow-hidden" : lookup(RADIUS, st.borderRadius),
    shadow: lookup(SHADOW, st.shadow),
    border: st.border === true ? "border border-black/10" : "",
    customClass: String(st.customClass ?? st.customCssClass ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9 _-]/g, "")
      .trim()
      .slice(0, 120),
  };
}

/** Embeds are limited to allow-listed providers (no arbitrary HTML/scripts from the CMS). */
export function embedSrc(raw: unknown): string | null {
  const href = safeHref(raw);
  if (!href) return null;
  try {
    const u = new URL(href);
    if (u.protocol !== "https:") return null;
    const host = u.hostname.replace(/^www\./, "");
    if (["youtube-nocookie.com", "player.vimeo.com"].includes(host)) return href;
    if (host === "google.com" && u.pathname.startsWith("/maps/embed")) return href;
    if (host === "maps.google.com" && u.pathname.startsWith("/maps")) return href;
  } catch {
    /* ignore */
  }
  return null;
}
