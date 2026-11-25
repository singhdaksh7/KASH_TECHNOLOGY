// Server started with ADMIN_REQUIRE_2FA=false. Real HTTP: email settings API, secrecy of the key, contact form with email unconfigured/failing, pages load.
import { Client, check, summary, sleep } from "./lib.mjs";
const KEY = "re_" + "Q1w2E3r4T5y6U7i8O9p0".repeat(2);
const sa = new Client();
let r = await sa.api("/auth/login", { json: { email: process.env.E2E_ADMIN_EMAIL, password: process.env.E2E_ADMIN_PASSWORD } });
check("login", r.status === 200);

const anon = new Client();
for (const p of ["/email/settings", "/email/status", "/email/deliveries", "/email/domain"]) { r = await anon.api(p); check(`anon ${p} → 401`, r.status === 401); }
r = await anon.api("/email/test", { json: { recipient: "a@b.co" } }); check("anon test email → 401", r.status === 401);

r = await sa.api("/email/settings");
check("settings: unconfigured, no key", r.status === 200 && r.data.apiKey.configured === false && r.data.provider === "resend" && r.data.internalRecipient === "founder@kash-technology.com");
r = await sa.api("/email/status");
check("status: Not Configured", r.data?.state === "not_configured" && r.data?.provider === "Resend");

r = await sa.api("/email/settings/api-key", { method: "PUT", json: { apiKey: "not-a-key" } }); check("bad key format rejected", r.status === 400);
r = await sa.api("/email/settings/api-key", { method: "PUT", json: { apiKey: KEY } });
check("key saved; response has only configured/lastFour", r.status === 200 && r.data.apiKey.configured && r.data.apiKey.lastFour === KEY.slice(-4) && !r.text.includes(KEY));
for (const p of ["/email/settings", "/email/status", "/settings", "/audit", "/email/deliveries"]) { r = await sa.api(p); check(`key absent from GET ${p}`, !r.text.includes(KEY) && !r.text.includes(KEY.slice(0, 12))); }
r = await sa.api("/email/settings", { method: "PUT", json: { encryptedApiKey: "x" } }); check("cannot write key via settings endpoint", r.status === 400);
r = await sa.api("/email/settings", { method: "PUT", json: { fromEmail: "noreply@kash-technology.com", enabled: true, fromName: "KASH Technology" } });
check("settings saved", r.status === 200 && r.data.fromEmail === "noreply@kash-technology.com" && !r.text.includes(KEY));
r = await sa.api("/email/status"); check("status: connected (configured + enabled)", r.data?.state === "connected");

// Resend is unreachable/unauthorised in this environment (fake key): the test endpoint must fail SAFELY.
r = await sa.api("/email/test", { json: { recipient: "me@example.com" } });
check("test email with fake key → handled failure (no 500, no leak)", r.status === 200 && ["FAILED"].includes(r.data.status) && !r.text.includes(KEY));
r = await sa.api("/email/test", { json: { recipient: "bad" } }); check("test email bad recipient → 400", r.status === 400);

// Contact form: lead saved even though email fails.
const c = new Client();
const unique = `E2E ${Date.now()}`;
r = await c.req("/api/contact", { json: { fullName: unique, email: "visitor@example.com", phone: "+91 90000 00000", company: "Acme", serviceInterested: "Website Development", projectBudget: "₹1L", message: "Please contact me about a new website for our company." }, headers: { referer: "https://kash-technology.com/contact" } });
check("contact form → success even though email delivery fails", r.status === 200 && r.body?.success === true && !/email|resend|fail/i.test(r.body?.message));
r = await sa.api("/leads");
const lead = r.data?.find?.((l) => l.name === unique);
check("lead persisted", !!lead);
await sleep(300);
r = await sa.api("/email/deliveries");
const rows = r.data?.filter?.((d) => d.entityId === lead?.id) ?? [];
check("2 deliveries logged for the lead (FAILED, key never shown)", rows.length === 2 && rows.every((d) => d.status === "FAILED") && !r.text.includes(KEY));
r = await sa.api(`/leads/${lead.id}/email`); check("lead email status endpoint", r.status === 200 && r.data.length === 2);
r = await sa.api(`/email-deliveries/${rows[0].id}/retry`, { method: "POST", json: {} }); check("retry handled (still failing, no 500)", r.status === 200 && r.data.status === "FAILED");
r = await anon.api(`/email-deliveries/${rows[0].id}/retry`, { method: "POST", json: {} }); check("anon retry → 401", r.status === 401);
r = await sa.api("/email/deliveries?status=SENT"); check("status filter", r.status === 200 && r.data.length === 0);

r = await sa.api("/email/settings/api-key", { method: "DELETE" }); check("key removed", r.status === 200 && r.data.apiKey.configured === false);
r = await c.req("/api/contact", { json: { fullName: unique + " 2", email: "visitor2@example.com", serviceInterested: "SEO Services", message: "Second enquiry with email not configured at all." } });
check("contact form still succeeds with no key", r.status === 200 && r.body?.success === true);

// Pages
for (const p of ["/admin/settings/email", "/admin/settings/email/logs", "/admin/settings/email-templates", `/admin/leads/${lead.id}`]) {
  r = await sa.req(p, { redirect: "manual" });
  check(`page ${p.replace(lead.id, "<id>")} ${p.includes("/leads/") ? "redirects to lead" : "loads"}`, p.includes("/leads/") ? [302, 307].includes(r.status) && (r.headers.get("location") || "").includes(`/admin/leads?lead=${lead.id}`) : r.status === 200);
  check(`  no key in HTML of ${p.replace(lead.id, "<id>")}`, !r.text.includes(KEY));
}
r = await sa.api("/email-templates/lead_internal/preview", { json: {} });
check("template preview returns branded HTML + labelled preview data", r.status === 200 && r.data.html?.includes("NEW PROJECT ENQUIRY") && r.data.previewData === true && r.data.html.includes("Example Client"));
process.exit(summary() ? 1 : 0);
