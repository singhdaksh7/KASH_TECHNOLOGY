/**
 * Client-side submission boundary for CMS forms.
 *
 * Contract (implemented by the lead/forms backend, not here):
 *   POST /api/forms/<formSlug>/submit
 *   body: JSON { fields: Record<string,string>, page: string }
 *   200 → { ok: true, message?: string }
 *   4xx/5xx → { ok: false, message?: string }
 */
export interface FormSubmitResult {
  ok: boolean;
  message: string;
}

export async function submitCmsForm(formSlug: string, fields: Record<string, string>): Promise<FormSubmitResult> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formSlug)) return { ok: false, message: "This form is not available." };
  try {
    const res = await fetch(`/api/forms/${formSlug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, page: window.location.pathname }),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    if (res.ok) return { ok: true, message: json.message ?? "Thank you — we'll be in touch shortly." };
    return { ok: false, message: json.message ?? "We couldn't submit the form right now. Please email or call us instead." };
  } catch {
    return { ok: false, message: "Network error. Please try again, or email or call us." };
  }
}
