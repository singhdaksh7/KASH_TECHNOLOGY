import { NextResponse } from "next/server";
import { ContactFormValues, ContactResponse } from "@/types/contact";
import { validateContactForm, sanitizeContactForm } from "@/lib/contact-validation";
import {
  buildInternalNotificationText,
  buildInternalNotificationHtml,
  buildAcknowledgementText,
  buildAcknowledgementHtml,
} from "@/lib/email-templates";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: send a single email via the Resend API
// ─────────────────────────────────────────────────────────────────────────────
async function sendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string;
    reply_to?: string;
    subject: string;
    html: string;
    text: string;
  }
): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeContactForm(body) as ContactFormValues;
    const errors = validateContactForm(sanitizedData);

    if (Object.keys(errors).length > 0) {
      if (errors.honeypot) {
        // Silently accept honeypot hits to deter bots
        return NextResponse.json<ContactResponse>({ success: true, message: "Thank you for your inquiry." });
      }
      return NextResponse.json<ContactResponse>({ success: false, message: "Validation failed", errors }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "founder@kash-technology.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "KASH Technologies <website@kash-technology.com>";

    if (!resendApiKey) {
      return NextResponse.json<ContactResponse>({
        success: false,
        message: "Online inquiry delivery is not configured yet. Please contact us by email at " + contactEmail,
      }, { status: 503 });
    }

    // ── 1. Internal notification email (to founder) ───────────────────────
    const internalResult = await sendEmail(resendApiKey, {
      from: fromEmail,
      to: contactEmail,
      reply_to: sanitizedData.email,
      subject: `New Project Inquiry: ${sanitizedData.projectType}`,
      html: buildInternalNotificationHtml(sanitizedData),
      text: buildInternalNotificationText(sanitizedData),
    });

    if (!internalResult.ok) {
      console.error(
        "[Contact] Internal notification failed:",
        internalResult.status,
        internalResult.body
      );
      throw new Error("Internal email delivery failed");
    }

    // ── 2. Acknowledgement email (to visitor) ─────────────────────────────
    // This is best-effort: a failure here must NOT prevent a success response
    // since the inquiry itself has already been delivered.
    try {
      const ackResult = await sendEmail(resendApiKey, {
        from: fromEmail,
        to: sanitizedData.email,
        reply_to: contactEmail,
        subject: `We received your inquiry — KASH Technologies`,
        html: buildAcknowledgementHtml(sanitizedData),
        text: buildAcknowledgementText(sanitizedData),
      });

      if (!ackResult.ok) {
        console.error(
          "[Contact] Acknowledgement email failed (non-blocking):",
          ackResult.status,
          ackResult.body
        );
      }
    } catch (ackError) {
      console.error("[Contact] Acknowledgement email threw (non-blocking):", ackError);
    }

    return NextResponse.json<ContactResponse>({
      success: true,
      message: "Thank you for your inquiry. We will get back to you shortly."
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json<ContactResponse>({
      success: false,
      message: "An unexpected server error occurred. Please try again later."
    }, { status: 500 });
  }
}
