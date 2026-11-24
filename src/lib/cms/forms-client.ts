/**
 * Client-side submission boundary for CMS forms.
 *   POST /api/forms/<formSlug>/submit   body: flat JSON of field values (+ honeypot, landingPage, utm*)
 *   201 → { success: true, data: { accepted: true } }
 *   4xx/5xx → { success: false, error: { message } }
 */
export interface FormSubmitResult {
  ok: boolean;
  message: string;
}

function attribution(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem("kash_lead_attribution");
    const a = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    const keep = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "referrer"] as const;
    return Object.fromEntries(keep.filter((k) => typeof a[k] === "string" && a[k]).map((k) => [k, a[k]]));
  } catch {
    return {};
  }
}

export async function submitCmsForm(formSlug: string, fields: Record<string, string>, successMessage?: string): Promise<FormSubmitResult> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formSlug)) return { ok: false, message: "This form is not available." };
  const { website, ...rest } = fields; // `website` is the honeypot input name used by FormEmbed
  try {
    const res = await fetch(`/api/forms/${formSlug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, honeypot: website ?? "", landingPage: window.location.pathname, ...attribution() }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    if (res.ok) return { ok: true, message: successMessage ?? "Thank you — we'll be in touch shortly." };
    return { ok: false, message: json.error?.message ?? "We couldn't submit the form right now. Please email or call us instead." };
  } catch {
    return { ok: false, message: "Network error. Please try again, or email or call us." };
  }
}
