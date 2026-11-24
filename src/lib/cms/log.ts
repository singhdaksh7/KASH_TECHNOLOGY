const seen = new Set<string>();

/** Logs a given message once per process so a broken CMS can't flood logs. Never throws, never logs content bodies. */
export function logOnce(key: string, message: string): void {
  if (seen.has(key)) return;
  seen.add(key);
  try {
    console.warn(`[cms] ${message}`);
  } catch {
    /* ignore */
  }
}
