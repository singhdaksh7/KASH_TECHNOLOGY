import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";
import { decrypt } from "@/lib/auth/crypto";

/**
 * Centralised outbound-email provider. Nothing else in the codebase talks to Resend.
 *
 * Configuration priority:  Admin settings (DB, API key encrypted at rest)  →  environment fallback  →  disabled.
 * The API key is decrypted only inside this module, only when a message is actually sent, and is never logged or returned.
 */
export const DEFAULT_INTERNAL_RECIPIENT = "founder@kash-technology.com";
export const DEFAULT_REPLY_TO = "founder@kash-technology.com";
export const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 320 && EMAIL_RE.test(v);

export interface EmailConfig {
  enabled: boolean;
  apiKey: string | null;
  apiKeySource: "database" | "environment" | "none";
  apiKeyLast4: string | null;
  fromName: string;
  fromEmail: string | null;
  /** RFC 5322 display form, or null when no from address is configured. */
  from: string | null;
  replyTo: string;
  internalRecipient: string;
  visitorReplyTo: string;
  sendVisitorConfirmation: boolean;
  sendInternalNotification: boolean;
  testRecipient: string | null;
  hasDbRow: boolean;
  configured: boolean;
}

/** Splits `Name <a@b.c>` or `a@b.c` (env fallback format). */
export function parseAddress(raw: string | undefined | null): { name: string | null; email: string | null } {
  if (!raw) return { name: null, email: null };
  const m = raw.trim().match(/^(?:"?([^"<]*?)"?\s*)?<([^>]+)>$/);
  const email = (m ? m[2] : raw).trim();
  return { name: m?.[1]?.trim() || null, email: isEmail(email) ? email : null };
}
const cleanName = (n: string) => n.replace(/[\r\n"<>]/g, "").trim().slice(0, 80);
export const formatFrom = (name: string, email: string) => (name ? `${cleanName(name)} <${email}>` : email);

export async function getEmailConfig(): Promise<EmailConfig> {
  const row = await prisma.emailSettings.findUnique({ where: { id: "default" } }).catch(() => null);
  const env = parseAddress(process.env.RESEND_FROM_EMAIL);
  let apiKey: string | null = null, source: EmailConfig["apiKeySource"] = "none", last4: string | null = null;
  if (row?.encryptedApiKey) {
    try { apiKey = decrypt(row.encryptedApiKey); source = "database"; last4 = row.apiKeyLast4; } catch { apiKey = null; }
  }
  if (!apiKey && process.env.RESEND_API_KEY) { apiKey = process.env.RESEND_API_KEY; source = "environment"; last4 = apiKey.slice(-4); }
  const fromEmail = (row?.fromEmail && isEmail(row.fromEmail) ? row.fromEmail : null) ?? env.email;
  const fromName = row?.fromName?.trim() || env.name || "KASH Technology";
  const envRecipient = parseAddress(process.env.CONTACT_RECEIVER_EMAIL).email;
  const configured = !!(apiKey && fromEmail);
  return {
    // With a saved settings row the admin's toggle is authoritative; with none, a complete env config is enough.
    enabled: row ? row.enabled && configured : configured,
    apiKey, apiKeySource: source, apiKeyLast4: last4, fromName, fromEmail,
    from: fromEmail ? formatFrom(fromName, fromEmail) : null,
    replyTo: (row?.replyToEmail && isEmail(row.replyToEmail) ? row.replyToEmail : null) ?? DEFAULT_REPLY_TO,
    internalRecipient: (row?.internalRecipient && isEmail(row.internalRecipient) ? row.internalRecipient : null) ?? envRecipient ?? DEFAULT_INTERNAL_RECIPIENT,
    visitorReplyTo: (row?.visitorReplyEmail && isEmail(row.visitorReplyEmail) ? row.visitorReplyEmail : null) ?? (row?.replyToEmail && isEmail(row.replyToEmail) ? row.replyToEmail : null) ?? DEFAULT_REPLY_TO,
    sendVisitorConfirmation: row?.sendVisitorConfirmation ?? true,
    sendInternalNotification: row?.sendInternalNotification ?? true,
    testRecipient: row?.testRecipient ?? null,
    hasDbRow: !!row,
    configured,
  };
}

export type EmailErrorCode = "NOT_CONFIGURED" | "DISABLED" | "TOGGLE_OFF" | "INVALID_RECIPIENT" | "INVALID_API_KEY" | "UNVERIFIED_SENDER" | "RATE_LIMITED" | "INVALID_REQUEST" | "NETWORK" | "TIMEOUT" | "PROVIDER_ERROR";
/** Fixed, safe, human-readable summaries. Raw provider text is never stored or shown. */
export const SAFE_ERROR: Record<EmailErrorCode, string> = {
  NOT_CONFIGURED: "Email delivery is not configured (API key or From address missing).",
  DISABLED: "Email delivery is switched off in Email settings.",
  TOGGLE_OFF: "This type of email is switched off in Email settings.",
  INVALID_RECIPIENT: "The recipient address is missing or invalid.",
  INVALID_API_KEY: "Resend rejected the API key. Replace it in Email settings.",
  UNVERIFIED_SENDER: "Resend does not accept this From address — verify the sending domain in Resend or use a verified address.",
  RATE_LIMITED: "Resend rate limit reached. Try again shortly.",
  INVALID_REQUEST: "Resend rejected the message as invalid.",
  NETWORK: "Could not reach Resend (network error).",
  TIMEOUT: "Resend did not respond in time.",
  PROVIDER_ERROR: "Resend reported a temporary error. Try again later.",
};

interface ProviderErr { statusCode?: number | null; name?: string; message?: string }
export function normalizeProviderError(err: unknown): EmailErrorCode {
  const e = (err ?? {}) as ProviderErr;
  const status = e.statusCode ?? 0, name = (e.name ?? "").toLowerCase(), msg = (e.message ?? "").toLowerCase();
  if (e.name === "TimeoutError") return "TIMEOUT";
  if (status === 401 || name.includes("api_key") || name === "missing_api_key" || msg.includes("api key")) return "INVALID_API_KEY";
  if (msg.includes("domain is not verified") || msg.includes("not verified") || name.includes("domain") || msg.includes("verify")) return "UNVERIFIED_SENDER";
  if (status === 429 || name.includes("rate_limit")) return "RATE_LIMITED";
  if (msg.includes("to address") || msg.includes("recipient") || msg.includes("invalid `to`")) return "INVALID_RECIPIENT";
  if (status === 400 || status === 403 || status === 422 || name.includes("validation")) return "INVALID_REQUEST";
  if (status >= 500) return "PROVIDER_ERROR";
  if (!status) return "NETWORK";
  return "PROVIDER_ERROR";
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string | null;
  tags?: Array<{ name: string; value: string }>;
}
export type SendEmailResult = { ok: true; messageId: string | null } | { ok: false; code: EmailErrorCode; message: string };

const fail = (code: EmailErrorCode): SendEmailResult => ({ ok: false, code, message: SAFE_ERROR[code] });
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const tagSafe = (v: string) => v.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 256);

type Payload = { from: string; to: string; subject: string; html: string; text: string; replyTo?: string; tags?: Array<{ name: string; value: string }> };
type Transport = (apiKey: string, payload: Payload) => Promise<{ data: { id: string } | null; error: ProviderErr | null }>;
const resendTransport: Transport = async (apiKey, payload) => {
  const r = await new Resend(apiKey).emails.send(payload);
  return { data: r.data, error: r.error as ProviderErr | null };
};
let transport: Transport = resendTransport;
/** Test seam only: swap the network transport (pass null to restore Resend). Never used in production code paths. */
export const setEmailTransportForTests = (t: Transport | null) => { transport = t ?? resendTransport; };

/** Sends one email through Resend. Never throws; every failure is normalised to a safe code. */
export async function sendEmail(input: SendEmailInput, config?: EmailConfig): Promise<SendEmailResult> {
  const cfg = config ?? (await getEmailConfig());
  if (!cfg.apiKey || !cfg.from) return fail("NOT_CONFIGURED");
  if (!cfg.enabled) return fail("DISABLED");
  if (!isEmail(input.to)) return fail("INVALID_RECIPIENT");
  const replyTo = input.replyTo && isEmail(input.replyTo) ? input.replyTo : undefined; // unvalidated input never reaches headers
  try {
    const call = transport(cfg.apiKey, {
      from: input.from ?? cfg.from, to: input.to, subject: oneLine(input.subject).slice(0, 300), html: input.html, text: input.text,
      ...(replyTo ? { replyTo } : {}),
      ...(input.tags?.length ? { tags: input.tags.map((t) => ({ name: tagSafe(t.name), value: tagSafe(t.value) })) } : {}),
    });
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { name: "TimeoutError" })), 15_000));
    const { data, error } = await Promise.race([call, timeout]);
    if (error) return fail(normalizeProviderError(error));
    return { ok: true, messageId: data?.id ?? null };
  } catch (e) {
    return fail(normalizeProviderError(e));
  }
}

/**
 * Best-effort sending-domain status via the Resend domains API. Needs a full-access key; restricted
 * (send-only) keys return "unknown" — we never guess.
 */
export async function getDomainStatus(domain: string, config?: EmailConfig): Promise<{ status: "verified" | "needs_verification" | "unknown"; detail: string }> {
  const cfg = config ?? (await getEmailConfig());
  if (!cfg.apiKey) return { status: "unknown", detail: "Add an API key to check the sending domain." };
  try {
    const resend = new Resend(cfg.apiKey);
    const { data, error } = await Promise.race([
      resend.domains.list(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 10_000)),
    ]);
    if (error || !data) return { status: "unknown", detail: "This API key cannot list domains (send-only keys can't). Verify the domain in the Resend dashboard." };
    const d = data.data.find((x) => x.name === domain || domain.endsWith(`.${x.name}`));
    if (!d) return { status: "needs_verification", detail: `${domain} is not added to this Resend account yet.` };
    return d.status === "verified" ? { status: "verified", detail: "Domain verified in Resend." } : { status: "needs_verification", detail: `Resend reports the domain as "${d.status}".` };
  } catch {
    return { status: "unknown", detail: "Could not reach Resend to check the domain." };
  }
}
