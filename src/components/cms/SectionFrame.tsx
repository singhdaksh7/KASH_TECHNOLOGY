import type { CSSProperties, ReactNode } from "react";
import type { SectionStyle } from "@/lib/cms/types";
import { sanitizeCustomClass } from "@/lib/cms/url-safety";
import { cn } from "@/lib/utils";

/* Literal class maps so Tailwind can see every class at build time. */
const BG = {
  default: "bg-[var(--color-background)] text-white",
  ivory: "bg-[var(--color-ivory)] text-[#111827]",
  dark: "bg-[#050708] text-white",
  primary: "bg-[var(--color-primary)] text-white",
  transparent: "",
} as const;
const TEXT = { auto: "", light: "text-white", dark: "text-[#111827]" } as const;
const PT = { none: "pt-0", sm: "pt-8", md: "pt-12 md:pt-16", lg: "pt-16 md:pt-24", xl: "pt-24 md:pt-32" } as const;
const PB = { none: "pb-0", sm: "pb-8", md: "pb-12 md:pb-16", lg: "pb-16 md:pb-24", xl: "pb-24 md:pb-32" } as const;
const ALIGN = { left: "text-left", center: "text-center", right: "text-right" } as const;
const RADIUS = { none: "", sm: "rounded-md overflow-hidden", md: "rounded-xl overflow-hidden", lg: "rounded-2xl overflow-hidden", xl: "rounded-3xl overflow-hidden" } as const;
const SHADOW = { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-xl" } as const;
const CONTAINER_WIDTH: Record<NonNullable<SectionStyle["container"]>, string | undefined> = {
  narrow: "48rem",
  default: "var(--container-width)",
  wide: "90rem",
  full: undefined,
};

function pick<T extends Record<string, string>>(map: T, key: unknown): string {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(map, key) ? map[key as keyof T] : "";
}

interface SectionFrameProps {
  id: string;
  type: string;
  style?: SectionStyle;
  label?: string;
  /** Section brings its own background/padding (e.g. hero, cta). Style overrides still apply when set explicitly. */
  selfFramed?: boolean;
  children: ReactNode;
}

/** Applies the safe, enumerated style settings. Unknown values are ignored (never turned into raw CSS or classes). */
export function SectionFrame({ id, type, style = {}, label, selfFramed, children }: SectionFrameProps) {
  const hasExplicit = (k: keyof SectionStyle) => style[k] !== undefined;
  const bg = selfFramed && !hasExplicit("background") ? "" : pick(BG, style.background ?? "default");
  const pt = selfFramed && !hasExplicit("paddingTop") ? "" : pick(PT, style.paddingTop) || "pt-[var(--section-spacing)]";
  const pb = selfFramed && !hasExplicit("paddingBottom") ? "" : pick(PB, style.paddingBottom) || "pb-[var(--section-spacing)]";
  const maxWidth = style.container ? CONTAINER_WIDTH[style.container as keyof typeof CONTAINER_WIDTH] : CONTAINER_WIDTH.default;
  const innerStyle: CSSProperties | undefined = selfFramed && !style.container ? undefined : maxWidth ? { maxWidth } : undefined;
  const safeId = `section-${id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64)}`;

  return (
    <section
      id={safeId}
      data-section-type={type}
      aria-label={label}
      className={cn(
        "relative",
        bg,
        pick(TEXT, style.textColor),
        pt,
        pb,
        pick(RADIUS, style.borderRadius),
        pick(SHADOW, style.shadow),
        pick(ALIGN, style.alignment),
        sanitizeCustomClass(style.customClass),
      )}
    >
      {selfFramed && !style.container ? (
        children
      ) : (
        <div className="mx-auto w-full px-6 sm:px-8 lg:px-12" style={innerStyle}>
          {children}
        </div>
      )}
    </section>
  );
}
