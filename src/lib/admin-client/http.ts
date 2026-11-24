/** The ONLY place the admin UI talks HTTP. Components call `adminClient` methods (see client.ts), never fetch directly. */
export class AdminApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

const AUTH_ROUTES = ["/admin/login", "/admin/verify-2fa", "/admin/setup-2fa"];

function redirectFor(status: number, code: string) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (AUTH_ROUTES.some((r) => path.startsWith(r))) return;
  if (status === 401) window.location.assign("/admin/login");
  else if (code === "TWO_FACTOR_SETUP_REQUIRED") window.location.assign("/admin/setup-2fa");
}

export async function api<T>(path: string, init: { method?: string; json?: unknown; form?: FormData } = {}): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    method: init.method ?? (init.json !== undefined || init.form ? "POST" : "GET"),
    headers: init.json !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init.form ?? (init.json !== undefined ? JSON.stringify(init.json) : undefined),
    credentials: "same-origin",
    cache: "no-store",
  });
  const payload = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !payload?.success) {
    const err = payload?.error;
    redirectFor(res.status, err?.code ?? "");
    throw new AdminApiError(res.status, err?.code ?? "REQUEST_FAILED", err?.message ?? `Request failed (${res.status})`, err?.details);
  }
  return payload.data as T;
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
