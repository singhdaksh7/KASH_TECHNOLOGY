/** Small helpers for reading list/date/boolean query parameters. */
export const list = (sp: URLSearchParams, key: string): string[] | undefined => {
  const v = sp.getAll(key).flatMap((x) => x.split(",")).map((x) => x.trim()).filter(Boolean);
  return v.length ? v : undefined;
};
export const date = (sp: URLSearchParams, key: string): Date | undefined => {
  const v = sp.get(key);
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};
export const flag = (sp: URLSearchParams, key: string) => ["1", "true", "yes"].includes((sp.get(key) ?? "").toLowerCase());
export const int = (sp: URLSearchParams, key: string, fallback: number) => { const n = Number(sp.get(key)); return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback; };
