const SENSITIVE = /pass(word)?|secret|token|authorization|auth|cookie|card|cvv|api[-_]?key|hash|totp|recovery/i;

/** Recursively strip sensitive keys and truncate long strings before logging or auditing. */
export function scrub(value: unknown, depth = 0): unknown {
  if (value == null || depth > 4) return value ?? null;
  if (typeof value === "string") return value.length > 300 ? `${value.slice(0, 300)}…` : value;
  if (Array.isArray(value)) return value.slice(0, 25).map((v) => scrub(v, depth + 1));
  if (typeof value === "object") {
    if (value instanceof Date) return value.toISOString();
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE.test(k) ? "[redacted]" : scrub(v, depth + 1);
    }
    return out;
  }
  return value;
}
