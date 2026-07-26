import { ContactFormValues } from "@/types/contact";

// ─────────────────────────────────────────────────────────────────────────────
// Shared brand constants (inline so templates have zero runtime dependencies)
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = {
  company: "KASH Technologies",
  website: "https://kash-technology.com",
  email: "founder@kash-technology.com",
  phonePrimary: "+91 97609 42003",
  phoneAlternate: "+91 97606 58804",
  projects: [
    { name: "Exora — Cryptocurrency Exchange", url: "https://exorain.com" },
    { name: "SchoolSync — Multi-Tenant School ERP", url: "https://zipinnovate.com" },
    { name: "BSC Crypto Launchpad", url: "https://crypto-launchedpad-mvp.vercel.app" },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: format date/time to IST (India Standard Time)
// ─────────────────────────────────────────────────────────────────────────────
function formatISTTimestamp(): string {
  const date = new Date();
  // IST offset is +5:30. Date.getTimezoneOffset() returns minutes (negative if ahead of UTC)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 3600000 * 5.5);
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = istDate.getDate();
  const month = months[istDate.getMonth()];
  const year = istDate.getFullYear();
  
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  
  return `${day} ${month} ${year}\n${hours}:${minutes} IST`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Internal notification email (to founder)
// ─────────────────────────────────────────────────────────────────────────────

export function buildInternalNotificationText(data: ContactFormValues): string {
  const submittedTime = formatISTTimestamp();
  
  return `━━━━━━━━━━━━━━━━━━━━━━
Lead Intelligence
━━━━━━━━━━━━━━━━━━━━━━
Reference ID
${data.referenceId || "N/A"}

Lead Source
${data.leadSource || "Unknown"}

Landing Page
${data.landingPage || "/"}

Traffic Source
${data.trafficSource || "Direct"}

Device
${data.device || "Desktop"}

Browser
${data.browser || "Other"}

Submitted
${submittedTime}
━━━━━━━━━━━━━━━━━━━━━━

New Project Inquiry — ${BRAND.company}

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || "N/A"}
Company: ${data.company || "N/A"}
Project Type: ${data.projectType}
Estimated Budget: ${data.estimatedBudget}

Project Description:
${data.message}
`.trim();
}

export function buildInternalNotificationHtml(data: ContactFormValues): string {
  const submittedTime = formatISTTimestamp().replace("\n", " ");
  
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:32px 32px 16px;background:linear-gradient(135deg,#FF5F1F 0%,#FF8C00 100%);text-align:center;">
          <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">New Project Inquiry</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          
          <!-- Lead Intelligence Section -->
          <div style="margin-bottom:32px;padding:24px;background:#0a0a0a;border-radius:12px;border:1px solid #FF5F1F/30;box-shadow:0 4px 12px rgba(255,95,31,0.05);">
            <p style="margin:0 0 16px;font-size:13px;color:#FF5F1F;text-transform:uppercase;letter-spacing:1.5px;font-weight:900;">Lead Intelligence</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.5;">
              ${metadataRow("Reference ID", data.referenceId || "N/A")}
              ${metadataRow("Lead Source", data.leadSource || "Unknown")}
              ${metadataRow("Landing Page", data.landingPage || "/")}
              ${metadataRow("Traffic Source", data.trafficSource || "Direct")}
              ${metadataRow("Device", data.device || "Desktop")}
              ${metadataRow("Browser", data.browser || "Other")}
              ${metadataRow("Submitted", submittedTime)}
            </table>
          </div>

          <!-- Inquiry Content Section -->
          <p style="margin:0 0 16px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Inquiry Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${internalRow("Name", data.fullName)}
            ${internalRow("Email", `<a href="mailto:${data.email}" style="color:#FF5F1F;text-decoration:none;">${data.email}</a>`)}
            ${internalRow("Phone", data.phone || "N/A")}
            ${internalRow("Company", data.company || "N/A")}
            ${internalRow("Project Type", data.projectType)}
            ${internalRow("Estimated Budget", data.estimatedBudget)}
          </table>

          <div style="margin-top:24px;padding:20px;background:#0a0a0a;border-radius:12px;border:1px solid #222;">
            <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Project Description</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#e0e0e0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          </div>

          <p style="margin-top:24px;font-size:12px;color:#666;text-align:center;">
            Reply directly to this email to respond to <strong style="color:#ccc;">${escapeHtml(data.fullName)}</strong>.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function internalRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;vertical-align:top;">
      <span style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${label}</span><br>
      <span style="font-size:15px;color:#e0e0e0;font-weight:500;">${value}</span>
    </td>
  </tr>`;
}

function metadataRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:5px 0;color:#888;font-weight:600;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:5px 0;color:#e0e0e0;font-weight:500;">${escapeHtml(value)}</td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Acknowledgement email (to visitor)
// ─────────────────────────────────────────────────────────────────────────────

export function buildAcknowledgementText(data: ContactFormValues): string {
  return `Hi ${data.fullName},

Thank you for contacting ${BRAND.company}!

We have received your inquiry and a member of our team will get back to you within 24 hours.

Reference ID: ${data.referenceId || "N/A"}

Here is a summary of what you submitted:

  Project Type: ${data.projectType}
  Estimated Budget: ${data.estimatedBudget}
  Description: ${data.message}

In the meantime, feel free to explore our work:

  • Exora — Cryptocurrency Exchange: ${BRAND.projects[0].url}
  • SchoolSync — Multi-Tenant School ERP: ${BRAND.projects[1].url}
  • BSC Crypto Launchpad: ${BRAND.projects[2].url}

If you need to reach us sooner, you can contact us at:

  Email: ${BRAND.email}
  Phone: ${BRAND.phonePrimary}
  Alternate: ${BRAND.phoneAlternate}
  Website: ${BRAND.website}

Best regards,
The ${BRAND.company} Team
`.trim();
}

export function buildAcknowledgementHtml(data: ContactFormValues): string {
  const projectLinksHtml = BRAND.projects
    .map(
      (p) =>
        `<tr><td style="padding:8px 0;">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer"
             style="color:#FF5F1F;text-decoration:none;font-weight:600;font-size:14px;">
            ${escapeHtml(p.name)} →
          </a>
        </td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:40px 32px 24px;background:linear-gradient(135deg,#FF5F1F 0%,#FF8C00 100%);text-align:center;">
          <h1 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">${escapeHtml(BRAND.company)}</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);font-weight:500;">Product Engineering Studio</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:32px 32px 0;">
          <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;color:#ffffff;">Thank you, ${escapeHtml(data.fullName)}!</h2>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#c0c0c0;">
            We have received your inquiry and appreciate you reaching out. A member of our team will review your request and respond within <strong style="color:#ffffff;">24 hours</strong>.
          </p>
        </td></tr>

        <!-- Inquiry summary -->
        <tr><td style="padding:24px 32px;">
          <div style="background:#0a0a0a;border:1px solid #222;border-radius:12px;padding:20px;">
            <p style="margin:0 0 16px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Your Inquiry Summary</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${summaryRow("Reference ID", data.referenceId || "N/A")}
              ${summaryRow("Project Type", data.projectType)}
              ${summaryRow("Estimated Budget", data.estimatedBudget)}
            </table>

            <p style="margin:16px 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Description</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#d0d0d0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          </div>
        </td></tr>

        <!-- Explore our work -->
        <tr><td style="padding:0 32px 24px;">
          <p style="margin:0 0 12px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Explore Our Work</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${projectLinksHtml}
          </table>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="height:1px;background:#222;"></div></td></tr>

        <!-- Contact details -->
        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 12px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Reach Us Directly</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;font-size:14px;color:#c0c0c0;">
              ✉ <a href="mailto:${BRAND.email}" style="color:#FF5F1F;text-decoration:none;">${BRAND.email}</a>
            </td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#c0c0c0;">
              ☎ <a href="tel:${BRAND.phonePrimary.replace(/\s+/g, "")}" style="color:#FF5F1F;text-decoration:none;">${BRAND.phonePrimary}</a>
            </td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#c0c0c0;">
              ☎ <a href="tel:${BRAND.phoneAlternate.replace(/\s+/g, "")}" style="color:#FF5F1F;text-decoration:none;">${BRAND.phoneAlternate}</a> <span style="color:#666;font-size:12px;">(Alternate)</span>
            </td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#c0c0c0;">
              🌐 <a href="${BRAND.website}" target="_blank" rel="noopener noreferrer" style="color:#FF5F1F;text-decoration:none;">${BRAND.website}</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;background:#0d0d0d;text-align:center;border-top:1px solid #1a1a1a;">
          <p style="margin:0;font-size:12px;color:#555;">
            © 2026 ${escapeHtml(BRAND.company)}. All Rights Reserved.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function summaryRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-size:12px;color:#888;font-weight:600;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:#e0e0e0;font-weight:500;">${escapeHtml(value)}</td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
