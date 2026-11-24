import type { CSSProperties, ReactNode } from "react";
import { resolveStyle } from "@/lib/cms/section-compat";
import { cn } from "@/lib/utils";

interface SectionFrameProps {
  id: string;
  type: string;
  /** Raw style JSON from the CMS / page builder. Only enumerated values / validated numbers & hex colours are honoured. */
  style?: unknown;
  label?: string;
  /** Section brings its own background/padding (e.g. hero, cta); only explicit style overrides apply. */
  selfFramed?: boolean;
  children: ReactNode;
}

export function SectionFrame({ id, type, style, label, selfFramed, children }: SectionFrameProps) {
  const raw = (style && typeof style === "object" ? style : {}) as Record<string, unknown>;
  const explicit = (k: string) => raw[k] !== undefined;
  const r = resolveStyle(raw);
  const safeId = `section-${id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64)}`;
  const bg = selfFramed && !explicit("background") ? "" : r.bgClass;
  const pt = selfFramed && !explicit("paddingTop") ? "" : r.pt;
  const pb = selfFramed && !explicit("paddingBottom") ? "" : r.pb;
  const inline: CSSProperties = { ...(selfFramed && !explicit("background") ? {} : r.inline) } as CSSProperties;
  const wrapContainer = !(selfFramed && !explicit("container"));
  const innerStyle: CSSProperties | undefined = r.maxWidth ? { maxWidth: r.maxWidth } : undefined;

  return (
    <section
      id={safeId}
      data-section-type={type}
      aria-label={label}
      style={inline}
      className={cn("relative", bg, r.textClass, pt, pb, r.radius, r.shadow, r.border, r.align, r.customClass)}
    >
      {wrapContainer ? (
        <div className="mx-auto w-full px-6 sm:px-8 lg:px-12" style={innerStyle}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
