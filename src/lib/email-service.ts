import nodemailer from "nodemailer";
import { ContactFormData } from "./contact-schema";
import { SITE_CONFIG } from "./constants";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mode: "smtp" | "dev_logged";
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends both the internal notification email to the KASH Technology team
 * and the professional confirmation email to the visitor.
 */
export async function sendContactEmails(data: ContactFormData): Promise<SendEmailResult> {
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || SITE_CONFIG.contactEmail;
  const fromEmail = process.env.SMTP_FROM || `KASH Technology <website@kash-technology.com>`;
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const transporter = getTransporter();

  // If SMTP is not configured in development, log the payload and return graceful success
  if (!transporter) {
    console.info("────────────────────────────────────────────────────────────");
    console.info("[DEV MODE] SMTP not configured. Simulating email dispatch:");
    console.info(`To: ${receiverEmail}`);
    console.info(`Subject: New KASH Technology Lead — ${data.fullName}`);
    console.info("Lead Data:", {
      ...data,
      timestamp,
    });
    console.info(`Confirmation Sent to Visitor: ${data.email}`);
    console.info("────────────────────────────────────────────────────────────");
    return { success: true, mode: "dev_logged" };
  }

  try {
    // 1. Internal Lead Notification to Founder
    const leadHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f9; color: #111; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #050708; color: #ffffff; padding: 24px 32px; border-bottom: 3px solid #f36b21; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
          .header p { margin: 4px 0 0 0; font-size: 12px; color: #c5a880; letter-spacing: 0.15em; text-transform: uppercase; }
          .content { padding: 32px; }
          .field-row { margin-bottom: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; }
          .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; font-weight: 600; margin-bottom: 4px; }
          .field-value { font-size: 15px; color: #111; font-weight: 500; }
          .message-box { background: #fbf8f2; border: 1px solid #f0e6d6; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #222; white-space: pre-wrap; margin-top: 8px; }
          .footer { background: #fafafa; padding: 16px 32px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lead Received</h1>
            <p>KASH Technology Official Portal</p>
          </div>
          <div class="content">
            <div class="field-row">
              <div class="field-label">Full Name</div>
              <div class="field-value">${data.fullName}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${data.email}" style="color: #f36b21; text-decoration: none;">${data.email}</a></div>
            </div>
            ${data.phone ? `
            <div class="field-row">
              <div class="field-label">Phone Number</div>
              <div class="field-value"><a href="tel:${data.phone}" style="color: #111; text-decoration: none;">${data.phone}</a></div>
            </div>
            ` : ""}
            ${data.company ? `
            <div class="field-row">
              <div class="field-label">Company</div>
              <div class="field-value">${data.company}</div>
            </div>
            ` : ""}
            <div class="field-row">
              <div class="field-label">Service Interested In</div>
              <div class="field-value" style="color: #f36b21; font-weight: 700;">${data.serviceInterested}</div>
            </div>
            ${data.projectBudget ? `
            <div class="field-row">
              <div class="field-label">Project Budget</div>
              <div class="field-value">${data.projectBudget}</div>
            </div>
            ` : ""}
            <div class="field-row" style="border-bottom: none;">
              <div class="field-label">Project Details</div>
              <div class="message-box">${data.message}</div>
            </div>
            <div class="field-row" style="border-bottom: none; margin-bottom: 0;">
              <div class="field-label">Timestamp</div>
              <div class="field-value" style="font-size: 12px; color: #666;">${timestamp}</div>
            </div>
          </div>
          <div class="footer">
            KASH Technology • TAILORED | AFFORDABLE | SCALABLE
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: receiverEmail,
      replyTo: data.email,
      subject: `New KASH Technology Lead — ${data.fullName}`,
      html: leadHtml,
      text: `
New KASH Technology Lead
========================
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}
Service: ${data.serviceInterested}
Budget: ${data.projectBudget || "Not specified"}
Timestamp: ${timestamp}

Project Details:
${data.message}
      `,
    });

    // 2. Visitor Confirmation Email
    const visitorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f9; color: #111; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #050708; color: #ffffff; padding: 32px; text-align: center; border-bottom: 3px solid #f36b21; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #c5a880; }
          .header p { margin: 6px 0 0 0; font-size: 11px; color: #ffffff; letter-spacing: 0.2em; text-transform: uppercase; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #333; }
          .badge { display: inline-block; background: #f36b21; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }
          .footer { background: #050708; color: #888; padding: 24px 32px; text-align: center; font-size: 12px; }
          .footer a { color: #f36b21; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>KASH TECHNOLOGY</h1>
            <p>TAILORED | AFFORDABLE | SCALABLE</p>
          </div>
          <div class="content">
            <p>Dear <strong>${data.fullName}</strong>,</p>
            <p>Thank you for reaching out to <strong>KASH Technology</strong>. We have successfully received your project enquiry regarding <strong>${data.serviceInterested}</strong>.</p>
            <p>Our engineering leads are reviewing your project requirements and will reach out to you within <strong>24 business hours</strong> to discuss the next steps, solution architecture, and timeline.</p>
            <p>If you have any urgent details or additional documents to share, feel free to reply directly to this email or reach us on WhatsApp at <a href="${SITE_CONFIG.whatsappUrl}" style="color: #f36b21; font-weight: 600;">+91 97609 42003</a>.</p>
            <p style="margin-top: 24px;">Warm regards,<br><strong>The KASH Technology Team</strong><br><a href="${SITE_CONFIG.websiteUrl}" style="color: #f36b21;">www.kash-technology.com</a></p>
          </div>
          <div class="footer">
            &copy; 2026 KASH Technology. All rights reserved.<br>
            Direct Engineer Collaboration • Serving Clients Worldwide
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: fromEmail,
        to: data.email,
        replyTo: receiverEmail,
        subject: `We've received your KASH Technology enquiry`,
        html: visitorHtml,
        text: `
Dear ${data.fullName},

Thank you for reaching out to KASH Technology. We have received your enquiry regarding ${data.serviceInterested}.

Our engineering team will review your specifications and get back to you within 24 hours.

Warm regards,
KASH Technology Team
${SITE_CONFIG.websiteUrl}
        `,
      });
    } catch (visitorErr) {
      console.warn("[Contact] Visitor confirmation failed (non-blocking):", visitorErr);
    }

    return { success: true, mode: "smtp" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "SMTP transport error";
    console.error("[Contact] Email delivery failed:", errorMsg);
    return { success: false, error: errorMsg, mode: "smtp" };
  }
}
