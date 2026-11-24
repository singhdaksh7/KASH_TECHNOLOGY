import type { ReactNode } from "react";
import type { Section } from "@/lib/cms/types";
import { safeHref } from "@/lib/cms/url-safety";

export interface SectionProps {
  section: Section;
  /** True for the first enabled hero on the page (owns the page <h1>). */
  isPrimaryHero?: boolean;
}

type Obj = Record<string, unknown>;

export const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export const str = (v: unknown, max = 2000): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
export const objs = (v: unknown, max = 60): Obj[] => (Array.isArray(v) ? v.filter(isObj).slice(0, max) : []);
export const strs = (v: unknown, max = 60): string[] =>
  Array.isArray(v) ? v.map((x) => str(x)).filter((x): x is string => !!x).slice(0, max) : [];
export const num = (v: unknown, fallback: number, min = 1, max = 24): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.floor(v))) : fallback;

export function cta(v: unknown): { label: string; href: string } | undefined {
  if (!isObj(v)) return undefined;
  const label = str(v.label, 80);
  const href = safeHref(v.href);
  return label && href ? { label, href } : undefined;
}

export function SectionHeader({ badge, heading, subheading, level = 2 }: { badge?: string; heading?: string; subheading?: string; level?: 1 | 2 }) {
  if (!badge && !heading && !subheading) return null;
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center">
      {badge && <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">{badge}</span>}
      {heading && <H className="font-serif-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</H>}
      {subheading && <p className="text-base opacity-75 sm:text-lg">{subheading}</p>}
    </div>
  );
}

export function PrimaryButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 rounded-[var(--radius-button)] ${className}`}
    >
      {children}
    </span>
  );
}

export function CardBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-current/10 bg-white/5 p-6 ${className}`}>{children}</div>
  );
}
