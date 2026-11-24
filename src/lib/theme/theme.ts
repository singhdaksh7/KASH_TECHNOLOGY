import type { ThemeConfig } from "@/lib/cms/types";

/** Defaults MUST equal the approved KASH theme. */
export const DEFAULT_THEME: ThemeConfig = {
  colorPrimary: "#FF5A00",
  colorSecondary: "#FF8A3D",
  colorIvory: "#FFF9F4",
  colorBackground: "#FFFFFF",
  colorText: "#0B0B0F",
  colorMuted: "#4B5563",
  colorBorder: "#E8E5E2",
  radiusButton: "10px",
  radiusCard: "16px",
  containerWidth: "80rem",
  sectionSpacing: "5rem",
};

const CSS_VAR_NAMES: Record<keyof ThemeConfig, string> = {
  colorPrimary: "--color-primary",
  colorSecondary: "--color-secondary",
  colorIvory: "--color-ivory",
  colorBackground: "--color-background",
  colorText: "--color-text",
  colorMuted: "--color-muted",
  colorBorder: "--color-border",
  radiusButton: "--radius-button",
  radiusCard: "--radius-card",
  containerWidth: "--container-width",
  sectionSpacing: "--section-spacing",
};

const COLOR_KEYS = new Set<keyof ThemeConfig>([
  "colorPrimary", "colorSecondary", "colorIvory", "colorBackground", "colorText", "colorMuted", "colorBorder",
]);

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNC_COLOR = /^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/deg-]+\)$/i;
const LENGTH = /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|vw|%|ch))$/;

/** Only well-formed colours / lengths pass. Anything else is dropped (default wins), so CSS injection is impossible. */
export function isSafeThemeValue(key: keyof ThemeConfig, value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (v.length > 64) return false;
  return COLOR_KEYS.has(key) ? HEX.test(v) || FUNC_COLOR.test(v) : LENGTH.test(v);
}

export function resolveTheme(override?: Partial<ThemeConfig> | null): ThemeConfig {
  const theme = { ...DEFAULT_THEME };
  if (!override) return theme;
  for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeConfig)[]) {
    const v = override[key];
    if (isSafeThemeValue(key, v)) theme[key] = v.trim();
  }
  return theme;
}

/** `:root{…}` block with the theme variables. Values are validated; safe to inline in <style>. */
export function themeToCss(theme: ThemeConfig): string {
  const body = (Object.keys(CSS_VAR_NAMES) as (keyof ThemeConfig)[])
    .map((k) => `${CSS_VAR_NAMES[k]}:${theme[k]};`)
    .join("");
  return `:root{${body}}`;
}
