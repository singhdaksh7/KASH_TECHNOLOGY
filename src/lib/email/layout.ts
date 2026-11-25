/**
 * Email-safe HTML builders (table layout, inline styles only, no remote CSS/images). Brand: orange #FF5A00, ivory #FFF9F4, black #0B0B0F.
 * Every interpolated value is HTML-escaped. Empty fields are omitted rather than faked.
 */
export const BRAND = { orange: "#FF5A00", ivory: "#FFF9F4", black: "#0B0B0F", ink: "#2B2B33", muted: "#6B6B76", line: "#EADFD6" };
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://kash-technology.com").replace(/\/+$/, "");
export const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const FONT = "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

/** Plain-text paragraphs → HTML paragraphs (blank-line separated; single newlines become <br>). */
export const paragraphs = (text: string, style = `margin:0 0 16px;font-size:16px;line-height:1.6;color:${BRAND.ink};`) =>
  text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => `<p style="${style}">${esc(p).replace(/\n/g, "<br>")}</p>`).join("");

export const row = (label: string, value: string, opts: { link?: "mailto" | "tel" | "url" } = {}) => {
  if (!value?.trim()) return "";
  const v = esc(value);
  const href = opts.link === "mailto" ? `mailto:${esc(value)}` : opts.link === "tel" ? `tel:${esc(value.replace(/[^+\d]/g, ""))}` : opts.link === "url" && /^https?:\/\//i.test(value) ? esc(value) : null;
  const shown = href ? `<a href="${href}" style="color:${BRAND.orange};text-decoration:none;">${v}</a>` : v;
  return `<tr><td style="${FONT}padding:8px 12px 8px 0;width:130px;vertical-align:top;font-size:13px;color:${BRAND.muted};">${esc(label)}</td><td style="${FONT}padding:8px 0;vertical-align:top;font-size:15px;color:${BRAND.black};word-break:break-word;">${shown}</td></tr>`;
};
export const card = (title: string, rows: string[]) => {
  const body = rows.join("");
  if (!body) return "";
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background:#FFFFFF;border:1px solid ${BRAND.line};border-radius:12px;"><tr><td style="padding:18px 20px;">`
    + `<p style="${FONT}margin:0 0 6px;font-size:12px;letter-spacing:1.5px;font-weight:700;color:${BRAND.orange};text-transform:uppercase;">${esc(title)}</p>`
    + `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${body}</table></td></tr></table>`;
};
export const button = (label: string, href: string, primary = true) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 12px 12px 0;display:inline-block;"><tr><td align="center" bgcolor="${primary ? BRAND.orange : "#FFFFFF"}" style="border-radius:10px;${primary ? "" : `border:2px solid ${BRAND.black};`}">`
  + `<a href="${esc(href)}" style="${FONT}display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:${primary ? "#FFFFFF" : BRAND.black};text-decoration:none;border-radius:10px;">${esc(label)}</a></td></tr></table>`;

export function shell(opts: { title: string; preheader: string; eyebrow?: string; tagline?: string; body: string; footer: string }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>${esc(opts.title)}</title></head>`
    + `<body style="margin:0;padding:0;background:${BRAND.ivory};"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>`
    + `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${BRAND.ivory}"><tr><td align="center" style="padding:24px 12px;">`
    + `<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">`
    + `<tr><td bgcolor="${BRAND.black}" style="padding:28px 28px 24px;border-radius:14px 14px 0 0;border-bottom:4px solid ${BRAND.orange};">`
    + `<p style="${FONT}margin:0;font-size:22px;font-weight:800;letter-spacing:.5px;color:#FFFFFF;">KASH <span style="color:${BRAND.orange};">Technology</span></p>`
    + (opts.eyebrow ? `<p style="${FONT}margin:10px 0 0;font-size:12px;font-weight:700;letter-spacing:2px;color:${BRAND.orange};">${esc(opts.eyebrow)}</p>` : "")
    + (opts.tagline ? `<p style="${FONT}margin:10px 0 0;font-size:12px;font-weight:700;letter-spacing:2px;color:#CFCFD6;">${esc(opts.tagline)}</p>` : "")
    + `</td></tr><tr><td style="padding:28px;background:${BRAND.ivory};">${opts.body}</td></tr>`
    + `<tr><td style="padding:20px 28px;background:${BRAND.black};border-radius:0 0 14px 14px;${FONT}font-size:12px;line-height:1.6;color:#CFCFD6;">${opts.footer}</td></tr>`
    + `</table></td></tr></table></body></html>`;
}

export interface LeadMailData {
  id?: string | null; name?: string | null; email?: string | null; phone?: string | null; company?: string | null; service?: string | null; budget?: string | null;
  message?: string | null; source?: string | null; utmSource?: string | null; utmMedium?: string | null; utmCampaign?: string | null;
  landingPage?: string | null; referrer?: string | null; submittedAt: Date;
}
const fmt = (d: Date) => d.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";
const t = (v?: string | null) => (v ?? "").trim();

export function internalLeadEmail(d: LeadMailData, intro: string, adminUrl: string) {
  const attribution = [row("Source", t(d.source)), row("UTM Source", t(d.utmSource)), row("UTM Medium", t(d.utmMedium)), row("UTM Campaign", t(d.utmCampaign)), row("Landing Page", t(d.landingPage), { link: "url" }), row("Referrer", t(d.referrer), { link: "url" })];
  const message = t(d.message)
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background:#FFFFFF;border:1px solid ${BRAND.line};border-left:4px solid ${BRAND.orange};border-radius:12px;"><tr><td style="padding:18px 20px;">`
      + `<p style="${FONT}margin:0 0 8px;font-size:12px;letter-spacing:1.5px;font-weight:700;color:${BRAND.orange};text-transform:uppercase;">Project / enquiry message</p>${paragraphs(t(d.message), `margin:0 0 10px;font-size:15px;line-height:1.6;color:${BRAND.black};`)}</td></tr></table>`
    : "";
  const body = paragraphs(intro)
    + card("Enquiry summary", [row("Name", t(d.name)), row("Email", t(d.email), { link: "mailto" }), row("Phone", t(d.phone), { link: "tel" }), row("Company", t(d.company)), row("Service", t(d.service)), row("Budget", t(d.budget)), row("Submitted", fmt(d.submittedAt))])
    + message + card("Attribution", attribution)
    + `<div style="margin-top:8px;">${button("View Lead in Admin", adminUrl)}</div>`;
  const footer = `This enquiry was submitted through kash-technology.com.`;
  const html = shell({ title: "New Project Enquiry", preheader: `${t(d.name) || "Someone"}${t(d.service) ? ` — ${t(d.service)}` : ""}`, eyebrow: "NEW PROJECT ENQUIRY", body, footer: esc(footer) });
  const line = (l: string, v?: string | null) => (t(v) ? `${l}: ${t(v)}\n` : "");
  const text = `KASH Technology — NEW PROJECT ENQUIRY\n\n${intro}\n\n`
    + line("Name", d.name) + line("Email", d.email) + line("Phone", d.phone) + line("Company", d.company) + line("Service", d.service) + line("Budget", d.budget) + `Submitted: ${fmt(d.submittedAt)}\n`
    + (t(d.message) ? `\nMessage:\n${t(d.message)}\n` : "")
    + (attribution.some(Boolean) ? "\n" + line("Source", d.source) + line("UTM Source", d.utmSource) + line("UTM Medium", d.utmMedium) + line("UTM Campaign", d.utmCampaign) + line("Landing Page", d.landingPage) + line("Referrer", d.referrer) : "")
    + `\nView lead in admin: ${adminUrl}\n\n${footer}\n`;
  return { html, text };
}

export function visitorConfirmationEmail(d: { name?: string | null; service?: string | null; company?: string | null }, copy: string, replyTo: string) {
  const site = siteUrl();
  const name = t(d.name);
  const body = `<h1 style="${FONT}margin:0 0 16px;font-size:26px;line-height:1.25;color:${BRAND.black};">Thank you${name ? `, ${esc(name)}` : ""}</h1>`
    + `<p style="${FONT}margin:0 0 16px;font-size:16px;line-height:1.6;color:${BRAND.ink};font-weight:600;">We've received your enquiry.</p>`
    + paragraphs(copy)
    + card("Your enquiry", [row("Service", t(d.service)), row("Company", t(d.company))])
    + `<p style="${FONT}margin:4px 0 22px;font-size:13px;font-weight:700;letter-spacing:1.5px;color:${BRAND.orange};text-transform:uppercase;">Technology + Creative + Growth</p>`
    + `<div>${button("Visit KASH Technology", site)}${button("View Our Work", `${site}/portfolio`, false)}</div>`;
  const footer = `<strong style="color:#FFFFFF;">KASH Technology</strong><br>Technology • Creative • Growth<br><a href="${site}" style="color:${BRAND.orange};text-decoration:none;">kash-technology.com</a> · <a href="mailto:${esc(replyTo)}" style="color:${BRAND.orange};text-decoration:none;">${esc(replyTo)}</a>`;
  const html = shell({ title: "Thank you for contacting KASH Technology", preheader: "We've received your enquiry.", tagline: "WE BUILD. WE CREATE. WE GROW.", body, footer });
  const text = `KASH Technology\nWE BUILD. WE CREATE. WE GROW.\n\nThank you${name ? `, ${name}` : ""}\n\nWe've received your enquiry.\n\n${copy}\n\n`
    + (t(d.service) ? `Service: ${t(d.service)}\n` : "") + (t(d.company) ? `Company: ${t(d.company)}\n` : "")
    + `\nTechnology + Creative + Growth\nVisit KASH Technology: ${site}\nView Our Work: ${site}/portfolio\n\nKASH Technology\nTechnology • Creative • Growth\nkash-technology.com\n${replyTo}\n`;
  return { html, text };
}

export function testEmail(info: { provider: string; environment: string; at: Date; fromEmail: string }) {
  const site = siteUrl();
  const body = `<h1 style="${FONT}margin:0 0 16px;font-size:24px;color:${BRAND.black};">Email is working</h1>`
    + paragraphs("Your KASH Technology email delivery is configured correctly.")
    + card("Configuration check", [row("Website", site, { link: "url" }), row("Sent at", fmt(info.at)), row("Provider", info.provider), row("Environment", info.environment), row("From", info.fromEmail)]);
  const html = shell({ title: "Email Configuration Test", preheader: "Your KASH Technology email delivery is configured correctly.", eyebrow: "CONFIGURATION TEST", body, footer: "This is an automated test message from your KASH CMS." });
  const text = `KASH Technology — Email Configuration Test\n\nYour KASH Technology email delivery is configured correctly.\n\nWebsite: ${site}\nSent at: ${fmt(info.at)}\nProvider: ${info.provider}\nEnvironment: ${info.environment}\nFrom: ${info.fromEmail}\n`;
  return { html, text };
}

/** Generic branded wrapper for the plain-copy system templates (invites, notices, approvals, newsletter). */
export function genericEmail(subject: string, copy: string) {
  const site = siteUrl();
  const html = shell({ title: subject, preheader: copy.slice(0, 90), body: paragraphs(copy), footer: `<strong style="color:#FFFFFF;">KASH Technology</strong><br>Technology • Creative • Growth<br><a href="${site}" style="color:${BRAND.orange};text-decoration:none;">kash-technology.com</a>` });
  return { html, text: `${copy}\n\n— KASH Technology\n${site}\n` };
}
