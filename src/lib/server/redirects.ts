import { prisma } from "@/lib/db/prisma";

const BLOCKED = ["/admin", "/api", "/_next", "/preview", "/uploads"];

export function normalizeRedirectPath(p: string): string {
  const q = p.trim().split("#")[0];
  const [path, query] = q.split("?");
  const clean = path.replace(/\/{2,}/g, "/").replace(/(.)\/+$/, "$1");
  return query ? `${clean}?${query}` : clean;
}

/** Local, absolute-path redirects only. Returns the normalised pair (throws a user-facing Error when invalid). */
export function validateRedirect(sourcePath: string, destination: string) {
  const sourceRaw = sourcePath.trim();
  const destRaw = destination.trim();
  if (!sourceRaw.startsWith("/") || sourceRaw.startsWith("//")) throw new Error("Source must be a local path starting with a single '/'");
  if (!destRaw.startsWith("/") || destRaw.startsWith("//")) throw new Error("Destination must be a local path starting with a single '/'");
  if (/[\s<>"'\\]/.test(sourceRaw) || /[\s<>"'\\]/.test(destRaw)) throw new Error("Paths may not contain spaces or special characters");
  const source = normalizeRedirectPath(sourceRaw);
  const dest = normalizeRedirectPath(destRaw);
  if (BLOCKED.some((b) => source === b || source.startsWith(`${b}/`))) throw new Error("That source path is reserved and cannot be redirected");
  if (source === dest) throw new Error("Redirect cannot point to itself");
  return { sourcePath: source, destination: dest };
}

/* In-process cache consumed by proxy.ts (single container). Refreshed on any redirect change and every 60s. */
let cache: { at: number; map: Map<string, { destination: string; statusCode: number }> } | null = null;
export function refreshRedirectCache() {
  cache = null;
}
export async function lookupRedirect(path: string) {
  if (!process.env.DATABASE_URL) return null;
  if (!cache || Date.now() - cache.at > 5_000) {
    try {
      const rows = await prisma.redirect.findMany({ where: { active: true } });
      cache = { at: Date.now(), map: new Map(rows.map((r) => [r.sourcePath, { destination: r.destination, statusCode: r.statusCode }])) };
    } catch {
      cache = { at: Date.now() - 50_000, map: cache?.map ?? new Map() };
    }
  }
  return cache.map.get(normalizeRedirectPath(path)) ?? null;
}
export const findRedirect = lookupRedirect;
