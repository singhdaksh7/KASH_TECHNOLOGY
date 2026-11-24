import { Resend } from "resend";
import { renderEmail } from "@/lib/email/templates";

export interface LeadMailInput { id?: string; name?: string | null; email?: string | null; phone?: string | null; company?: string | null; service?: string | null; message?: string | null; source?: string | null; landingPage?: string | null }

const site = () => (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

/**
 * Internal lead alert + confirmation to the lead, rendered from the admin-editable templates
 * (`lead_internal`, `lead_confirmation`) with built-in defaults as fallback.
 * `internal` / `confirmation` let a form turn either email off; both default to on.
 */
export async function notifyLead(input: LeadMailInput, opts: { internal?: boolean; confirmation?: boolean } = {}) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.CONTACT_RECEIVER_EMAIL) return { sent: false, error: "Email not configured" };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const send = async (to: string, mail: { subject: string; text: string }) => {
    const { error } = await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL as string, to, subject: mail.subject, text: mail.text });
    if (error) throw new Error(error.message);
  };
  try {
    const vars = {
      name: input.name || "there", email: input.email || "—", phone: input.phone || "—", company: input.company || "—", service: input.service || "—",
      message: input.message || "", source: input.source || "—", landingPage: input.landingPage || "—", leadId: input.id || "",
      adminUrl: input.id ? `${site()}/admin/leads` : `${site()}/admin/leads`, siteName: "KASH Technology",
    };
    if (opts.internal !== false) await send(process.env.CONTACT_RECEIVER_EMAIL, await renderEmail("lead_internal", { ...vars, name: input.name || "unnamed lead" }));
    if (opts.confirmation !== false && input.email) await send(input.email, await renderEmail("lead_confirmation", vars));
    return { sent: true as boolean, error: undefined as string | undefined };
  } catch (error) {
    return { sent: false as boolean, error: (error instanceof Error ? error.message : "Resend error") as string | undefined };
  }
}
