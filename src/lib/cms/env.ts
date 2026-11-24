/** Server-only CMS configuration. Missing CMS_API_URL means "static fallback only" (no network calls). */
export const cmsEnv = {
  get apiUrl(): string | null {
    const raw = process.env.CMS_API_URL?.trim();
    return raw ? raw.replace(/\/+$/, "") : null;
  },
  get apiToken(): string | null {
    return process.env.CMS_API_TOKEN?.trim() || null;
  },
  get revalidateSeconds(): number {
    const n = Number(process.env.CMS_REVALIDATE_SECONDS);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 60;
  },
  get timeoutMs(): number {
    const n = Number(process.env.CMS_TIMEOUT_MS);
    return Number.isFinite(n) && n >= 200 ? Math.floor(n) : 4000;
  },
  get revalidateSecret(): string | null {
    return process.env.CMS_REVALIDATE_SECRET?.trim() || null;
  },
  get previewSecret(): string | null {
    return process.env.CMS_PREVIEW_SECRET?.trim() || null;
  },
};

export const CMS_TAG = "cms";
