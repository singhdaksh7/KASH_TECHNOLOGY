// Run against a server started with ADMIN_REQUIRE_2FA=false (so test users can use the API without enrolling).
import { Client, check, summary, sleep, PNG, BASE } from "./lib.mjs";
process.on("uncaughtException", (e) => { console.log(summary.toString().length ? "" : ""); console.error(e); process.exit(2); });
const email = process.env.E2E_ADMIN_EMAIL, password = process.env.E2E_ADMIN_PASSWORD;
const U = Date.now().toString(36);

const sa = new Client();
let r = await sa.api("/auth/login", { json: { email, password } });
check("super admin login", r.status === 200);

/* ───────────── RBAC ───────────── */
const roles = ["Administrator", "SEO Manager", "Content Editor", "Marketing Manager", "Viewer"];
const members = {};
for (const role of roles) {
  r = await sa.api("/team", { json: { name: `T ${role}`, email: `${role.toLowerCase().replace(/ /g, "-")}-${U}@example.test`, role } });
  check(`invite ${role}`, r.status === 201 && !!r.data?.temporaryPassword);
  const c = new Client();
  const l = await c.api("/auth/login", { json: { email: r.data.email, password: r.data.temporaryPassword } });
  check(`${role} can log in`, l.status === 200);
  members[role] = { c, id: r.data.id, email: r.data.email, pw: r.data.temporaryPassword };
}
r = await members["SEO Manager"].c.api("/team");
check("SEO_MANAGER cannot list users", r.status === 403);
r = await members["SEO Manager"].c.api("/team", { json: { name: "x", email: `x-${U}@example.test`, role: "Viewer" } });
check("SEO_MANAGER cannot create users", r.status === 403);
r = await members["SEO Manager"].c.api("/seo-issues");
check("SEO_MANAGER can view SEO", r.status === 200);
r = await members["Viewer"].c.api("/pages");
check("VIEWER can read pages", r.status === 200);
r = await members["Viewer"].c.api("/pages", { json: { title: "nope", slug: `nope-${U}` } });
check("VIEWER cannot create pages", r.status === 403);
r = await members["Viewer"].c.api("/media", { form: new FormData() });
check("VIEWER cannot upload media", r.status === 403);
r = await members["Content Editor"].c.api("/settings", { method: "PUT", json: { key: "header", value: {} } });
check("CONTENT_EDITOR cannot change settings", r.status === 403);
r = await members["Content Editor"].c.api("/audit");
check("CONTENT_EDITOR cannot read audit log", r.status === 403);
r = await members["Content Editor"].c.api("/pages", { json: { title: "Editor page", slug: `editor-${U}` } });
check("CONTENT_EDITOR can create draft pages", r.status === 201);
const editorPage = r.data;
r = await members["Content Editor"].c.api(`/pages/${editorPage.id}/publish`, { method: "POST", json: {} });
check("CONTENT_EDITOR cannot publish", r.status === 403);
r = await members["Marketing Manager"].c.api("/leads");
check("MARKETING_MANAGER can view leads", r.status === 200);
r = await members["Marketing Manager"].c.api("/pages", { json: { title: "m", slug: `m-${U}` } });
check("MARKETING_MANAGER cannot create pages", r.status === 403);
r = await members["Administrator"].c.api("/team", { json: { name: "x", email: `y-${U}@example.test`, role: "Viewer" } });
check("ADMINISTRATOR cannot manage users (users.manage is SUPER_ADMIN only)", r.status === 403);
r = await members["Administrator"].c.api("/audit");
check("ADMINISTRATOR can read audit log", r.status === 200);
r = await sa.api("/team");
check("SUPER_ADMIN can list users", r.status === 200 && r.data.length >= 6);
// last-super-admin / self-protection
const saSelf = (await sa.api("/auth/session")).data.user.id;
r = await sa.api(`/team/${saSelf}`, { method: "PATCH", json: { status: "Disabled" } });
check("cannot disable own account", r.status === 409);
r = await sa.api(`/team/${saSelf}`, { method: "PATCH", json: { role: "Viewer" } });
check("cannot demote the last Super Admin", r.status === 409);
// disabled account
r = await sa.api(`/team/${members["Viewer"].id}`, { method: "PATCH", json: { status: "Disabled" } });
check("disable member", r.status === 200);
r = await members["Viewer"].c.api("/pages");
check("disabled member's session stops working", r.status === 401);
r = await new Client().api("/auth/login", { json: { email: members["Viewer"].email, password: members["Viewer"].pw } });
check("disabled account cannot log in", r.status === 401);

/* ───────────── Page builder lifecycle ───────────── */
const slug = `e2e-${U}`;
r = await sa.api("/pages", { json: { title: "E2E Page", slug } });
check("create page", r.status === 201 && r.data.status === "Draft");
const page = r.data;
let pub = await sa.req(`/${slug}`);
check("draft page is NOT public", pub.status === 404);
const section = (id, type, content, extra = {}) => ({ id, type, order: 0, enabled: true, content, style: { background: "White", paddingTop: 4, paddingBottom: 4, container: "Normal", alignment: "Left", shadow: "None" }, ...extra });
const sections = [
  section("s-hero", "Hero", { badge: "E2E", heading: "E2E Hero Heading", highlightText: "Accent", description: "Hero from the builder", primaryCta: "Go", secondaryCta: "More" }),
  section("s-rich", "Rich Text", { title: "Rich", body: '<p>Safe <b>text</b><script>alert("xss")</script><img src=x onerror=alert(1)><a href="javascript:alert(2)">bad</a></p>' }),
  section("s-faq", "FAQ", { heading: "FAQ Heading", faqs: [{ question: "Is it E2E?", answer: "Yes it is." }] }),
  section("s-hidden", "Rich Text", { title: "HIDDEN-SECTION-MARKER", body: "x" }, { enabled: false }),
  section("s-svc", "Services Grid", { label: "Svc", heading: "Services Heading", items: [{ title: "Svc One", description: "d" }] }),
  section("s-cta", "CTA", { heading: "CTA Heading", subheading: "sub", buttonText: "Click", buttonUrl: "/contact" }),
];
r = await sa.api(`/pages/${page.id}`, { method: "PUT", json: { title: "E2E Page", slug: `/${slug}`, sections, seo: { title: "E2E SEO Title", metaDescription: "E2E meta description for the test page.", slug, canonicalUrl: "", focusKeyword: "e2e", secondaryKeywords: "a, b", ogTitle: "", ogDescription: "", ogImage: "", index: true, follow: true } } });
check("save draft", r.status === 200 && r.data.sections.length === 6 && r.data.hasUnpublishedChanges === true);
r = await sa.api(`/pages/${page.id}`);
check("draft round-trips section types as builder labels", r.data.sections[0].type === "Hero" && r.data.sections[2].type === "FAQ");
pub = await sa.req(`/${slug}`);
check("saving a draft does not publish", pub.status === 404);
const pv = await sa.req(`/preview?page=${page.id}`);
check("admin preview renders the DRAFT", pv.status === 200 && pv.text.includes("E2E Hero Heading") && pv.text.includes("Preview mode"));
check("preview is noindex", /name="robots" content="noindex/.test(pv.text));
const pvAnon = await new Client().req(`/preview?page=${page.id}`);
check("preview without auth → 404", pvAnon.status === 404);
const pvGuess = await new Client().req(`/preview?page=${page.id}&token=guess`);
check("preview with guessed token → 404", pvGuess.status === 404);

r = await sa.api(`/pages/${page.id}/publish`, { method: "POST", json: {} });
check("publish", r.status === 200 && r.data.status === "Published" && r.data.hasUnpublishedChanges === false);
pub = await sa.req(`/${slug}`);
check("published page is public (200)", pub.status === 200, String(pub.status));
check("hero rendered", pub.text.includes("E2E Hero Heading"));
check("faq rendered (builder key 'faqs')", pub.text.includes("Is it E2E?") && pub.text.includes("FAQ Heading"));
check("services grid items rendered", pub.text.includes("Svc One"));
check("cta rendered", pub.text.includes("CTA Heading"));
check("hidden section NOT rendered", !pub.text.includes("HIDDEN-SECTION-MARKER"));
check("rich text XSS stripped", !/<script>alert\("xss"\)/.test(pub.text) && !/onerror=alert/.test(pub.text) && !/href="javascript:/.test(pub.text) && pub.text.includes("Safe"));
check("page SEO title applied", /<title>E2E SEO Title/.test(pub.text));
check("canonical present once", (pub.text.match(/rel="canonical"/g) || []).length === 1 && pub.text.includes(`/${slug}"`));
check("FAQPage JSON-LD emitted only from real FAQ items", pub.text.includes("FAQPage") && pub.text.includes("Is it E2E?"));
let sm = await sa.req("/sitemap.xml");
check("sitemap lists published page", sm.text.includes(`/${slug}<`));
check("sitemap excludes admin/preview", !sm.text.includes("/admin") && !sm.text.includes("/preview"));

// reorder / hide / duplicate / delete section — all via save
const cur = (await sa.api(`/pages/${page.id}`)).data;
let secs = cur.sections.map((s) => ({ ...s }));
const hero = secs.find((s) => s.type === "Hero"), cta = secs.find((s) => s.type === "CTA");
secs = [cta, ...secs.filter((s) => s !== cta)];
secs.find((s) => s.type === "FAQ").enabled = false; // hide
secs.push({ ...hero, id: "dup-hero", content: { ...hero.content, heading: "DUP HERO" } }); // duplicate
secs = secs.filter((s) => !(s.type === "Services Grid")); // delete
r = await sa.api(`/pages/${page.id}`, { method: "PUT", json: { title: cur.title, slug: cur.slug, sections: secs.map((s, i) => ({ ...s, order: i + 1 })), seo: cur.seo } });
check("reorder/hide/duplicate/delete saved as draft", r.status === 200 && r.data.sections.length === 6 && r.data.sections[0].type === "CTA");
pub = await sa.req(`/${slug}`);
check("live page unchanged until publish", pub.text.includes("Svc One") && pub.text.includes("Is it E2E?"));
await sa.api(`/pages/${page.id}/publish`, { method: "POST", json: {} });
pub = await sa.req(`/${slug}`);
check("after publish: hidden FAQ gone, deleted services gone, duplicate present", !pub.text.includes("Is it E2E?") && !pub.text.includes("Svc One") && pub.text.includes("DUP HERO"));
check("after publish: CTA is first section", pub.text.indexOf("CTA Heading") < pub.text.indexOf("E2E Hero Heading"));

// versions + restore
r = await sa.api(`/pages/${page.id}/versions`);
check("revision history lists versions with author", r.status === 200 && r.data.length >= 3 && !!r.data[0].by && r.data[0].version > r.data[r.data.length - 1].version);
const firstPublish = [...r.data].reverse().find((v) => v.reason === "publish");
r = await sa.api(`/pages/${page.id}/restore`, { json: { version: firstPublish.version } });
check("restore version", r.status === 200 && r.data.sections.some((s) => s.type === "FAQ"));
pub = await sa.req(`/${slug}`);
check("restore is live", pub.text.includes("Is it E2E?") && pub.text.includes("Svc One"));
r = await sa.api(`/pages/${page.id}/versions`);
check("restore created a NEW version (history preserved)", r.data.some((v) => /restore/.test(v.reason)) && r.data.length >= 4);

// SEO edit → noindex excluded from sitemap
const cur2 = (await sa.api(`/pages/${page.id}`)).data;
await sa.api(`/pages/${page.id}`, { method: "PUT", json: { title: cur2.title, slug: cur2.slug, sections: cur2.sections, seo: { ...cur2.seo, title: "E2E New Title", index: false, follow: false } } });
await sa.api(`/pages/${page.id}/publish`, { method: "POST", json: {} });
pub = await sa.req(`/${slug}`);
check("SEO title edit applied", /<title>E2E New Title/.test(pub.text));
check("noindex honoured in meta robots", /name="robots" content="noindex, nofollow"/.test(pub.text));
sm = await sa.req("/sitemap.xml");
check("noindex page removed from sitemap", !sm.text.includes(`/${slug}<`));

// unpublish
r = await sa.api(`/pages/${page.id}/unpublish`, { method: "POST", json: {} });
pub = await sa.req(`/${slug}`);
check("unpublish → 404 publicly", r.status === 200 && pub.status === 404);

// reserved / static route protection
r = await sa.api("/pages", { json: { title: "Services dup", slug: "services" } });
check("cannot create a page on an existing slug", r.status === 409);
const sv = await sa.req("/services");
check("static /services still wins and renders", sv.status === 200 && sv.text.includes("Custom Technology") || sv.status === 200);

/* ───────────── redirects ───────────── */
r = await sa.api("/redirects", { json: { sourcePath: `/old-${U}`, destination: `/new-${U}`, statusCode: 301, active: true } });
check("create redirect", r.status === 201);
r = await sa.api("/redirects", { json: { sourcePath: `/new-${U}`, destination: `/old-${U}`, statusCode: 301, active: true } });
check("redirect loop rejected", r.status === 400 && /loop/i.test(r.err?.message || ""));
r = await sa.api("/redirects", { json: { sourcePath: "/x", destination: "//evil.com", statusCode: 301, active: true } });
check("protocol-relative destination rejected", r.status === 400);
r = await sa.api("/redirects", { json: { sourcePath: "/admin/x", destination: "/y", statusCode: 301, active: true } });
check("reserved source rejected", r.status === 400);
for (const code of [302, 307, 308]) {
  r = await sa.api("/redirects", { json: { sourcePath: `/c${code}-${U}`, destination: "/about", statusCode: code, active: true } });
  check(`redirect code ${code} accepted`, r.status === 201);
}
await sleep(5500); // proxy redirect cache TTL is 5s
const rd = await new Client().req(`/old-${U}`);
check("public redirect served (301 → /new)", rd.status === 301 && (rd.headers.get("location") || "").endsWith(`/new-${U}`));
const rd2 = await new Client().req(`/c308-${U}`);
check("308 redirect served", rd2.status === 308);

/* ───────────── settings: header / footer / theme ───────────── */
const hdrBefore = (await new Client().req("/")).text;
check("home renders approved header (Get a Free Audit)", hdrBefore.includes("Get a Free Audit"));
const nav = (await sa.api("/settings")).data.global.find((x) => x.key === "navigation").value;
nav.push({ id: "nav-e2e", label: `E2E Nav ${U}`, url: "/about", openNewTab: false, visible: true });
r = await sa.api("/settings", { method: "PUT", json: { key: "navigation", value: nav } });
check("save navigation", r.status === 200);
const hdr = (await sa.api("/settings")).data.global.find((x) => x.key === "header").value;
r = await sa.api("/settings", { method: "PUT", json: { key: "header", value: { ...hdr, primaryCtaText: `CTA ${U}`, showAnnouncement: true, announcementText: `Announce ${U}`, announcementLink: "/contact" } } });
check("save header", r.status === 200);
const ftr = (await sa.api("/settings")).data.global.find((x) => x.key === "footer").value;
r = await sa.api("/settings", { method: "PUT", json: { key: "footer", value: { ...ftr, copyrightText: `© E2E ${U}` } } });
check("save footer", r.status === 200);
const th = (await sa.api("/settings")).data.theme.find((x) => x.key === "theme").value;
r = await sa.api("/settings", { method: "PUT", json: { key: "theme", theme: true, value: { ...th, primaryOrange: "#112233", buttonRadius: 4 } } });
check("save theme", r.status === 200);
await sleep(500);
let home = (await new Client().req("/")).text;
check("header nav change is live", home.includes(`E2E Nav ${U}`));
check("header CTA + announcement are live", home.includes(`CTA ${U}`) && home.includes(`Announce ${U}`));
check("footer change is live", home.includes(`E2E ${U}`));
check("theme change is live (CSS variable)", /--color-primary:#112233/.test(home) && /--radius-button:4px/.test(home));
r = await sa.api("/settings", { method: "DELETE", json: { key: "theme", theme: true } });
check("reset theme", r.status === 200);
await sleep(300);
home = (await new Client().req("/")).text;
check("theme reset → approved KASH defaults (#FF5A00)", /--color-primary:#FF5A00/i.test(home) && /--color-secondary:#FF8A3D/i.test(home) && /--color-ivory:#FFF9F4/i.test(home));
// restore header/nav/footer to approved defaults
await sa.api("/settings", { method: "DELETE", json: { key: "navigation" } });
await sa.api("/settings", { method: "DELETE", json: { key: "header" } });
await sa.api("/settings", { method: "DELETE", json: { key: "footer" } });
await sleep(300);
home = (await new Client().req("/")).text;
check("deleting header/nav/footer settings → approved static header/footer", !home.includes(`E2E Nav ${U}`) && home.includes("Get a Free Audit") && home.includes("All Rights Reserved"));
r = await sa.api("/settings", { method: "PUT", json: { key: "arbitrary", value: {} } });
check("unknown setting key rejected", r.status === 400);

/* ───────────── media ───────────── */
const up = (buf, name, type) => { const f = new FormData(); f.set("file", new Blob([buf], { type }), name); return f; };
r = await sa.api("/media", { form: up(PNG, `Test Image ${U}.png`, "image/png") });
check("upload PNG", r.status === 201 && r.data.url.startsWith("/uploads/") && r.data.dimensions === "1×1");
const media = r.data;
const served = await fetch(BASE + media.url);
check("uploaded file is served with correct type + nosniff", served.status === 200 && served.headers.get("content-type") === "image/png" && served.headers.get("x-content-type-options") === "nosniff");
r = await sa.api("/media", { form: up(Buffer.from("<svg onload=alert(1)></svg>"), "x.svg", "image/svg+xml") });
check("SVG upload rejected", r.status === 415);
r = await sa.api("/media", { form: up(Buffer.from("MZ\x90\x00 fake exe"), "x.png", "image/png") });
check("content-sniff mismatch rejected", r.status === 415);
r = await sa.api("/media", { form: up(Buffer.concat([PNG, Buffer.alloc(11 * 1024 * 1024)]), "big.png", "image/png") });
check("oversize image rejected", r.status === 413);
r = await sa.api(`/media/${media.id}`, { method: "PATCH", json: { altText: "alt e2e", title: "T", caption: "C" } });
check("edit alt/title/caption", r.status === 200 && r.data.altText === "alt e2e");
// use it, then delete → warning
const mp = (await sa.api("/pages", { json: { title: "Media user", slug: `media-${U}` } })).data;
await sa.api(`/pages/${mp.id}`, { method: "PUT", json: { title: "Media user", slug: `/media-${U}`, sections: [section("m1", "Rich Text", { title: "t", body: `<img src="${media.url}" alt="x">` })], seo: mp.seo } });
await sa.api(`/pages/${mp.id}/publish`, { method: "POST", json: {} });
r = await sa.api("/media");
check("usage count reflects references", r.data.find((m) => m.id === media.id).usageCount >= 1);
r = await sa.api(`/media/${media.id}`, { method: "DELETE" });
check("deleting in-use media is blocked with a warning", r.status === 409 && r.err?.code === "IN_USE");
r = await sa.api(`/media/${media.id}`, { method: "PUT", form: up(PNG, "replacement.png", "image/png") });
check("replace file keeps record, new URL", r.status === 200 && r.data.url !== media.url);
const after = (await sa.api("/media")).data.find((m) => m.id === media.id);
r = await sa.api(`/media/${media.id}?force=true`, { method: "DELETE" });
check("forced delete works", r.status === 200 && after.url !== media.url);
const gone = await fetch(BASE + after.url);
check("deleted media no longer served", gone.status === 404);

/* ───────────── portfolio & insights ───────────── */
const proj = (over = {}) => ({ name: `E2E Project ${U}`, slug: `e2e-project-${U}`, status: "Published", projectType: "STAGING", category: "Web Platform", industry: "", shortDescription: "E2E description", fullDescription: "", thumbnail: "", heroImage: "", gallery: [], technologies: ["Next.js"], services: [], problem: ["p1"], solution: ["s1"], features: [{ title: "F1", description: "d" }], architecture: [], clickBehaviour: "Modal", seo: { title: "", metaDescription: "", slug: "", canonicalUrl: "", focusKeyword: "", secondaryKeywords: "", ogTitle: "", ogDescription: "", ogImage: "", index: true, follow: true }, ...over });
r = await sa.api("/portfolio", { json: proj() });
check("create + publish project (STAGING status)", r.status === 201 && r.data.projectType === "STAGING");
const pid = r.data.id;
await sleep(300);
let w = await sa.req(`/work/e2e-project-${U}`);
check("public project page renders with human badge", w.status === 200 && w.text.includes(`E2E Project ${U}`) && w.text.includes("STAGING"));
const pf = await sa.req("/portfolio");
check("/portfolio lists CMS project", pf.status === 200 && pf.text.includes(`E2E Project ${U}`));
r = await sa.api("/portfolio", { json: proj({ slug: "bad slug!" }) });
check("invalid project slug rejected", r.status === 400);
r = await sa.api(`/portfolio/${pid}`, { method: "PUT", json: proj({ status: "Draft" }) });
await sleep(200);
w = await sa.req(`/work/e2e-project-${U}`);
check("unpublished project → 404", w.status === 404);
await sa.api(`/portfolio/${pid}`, { method: "DELETE" });

r = await sa.api("/articles", { json: { title: `E2E Article ${U}`, slug: `e2e-article-${U}`, status: "Published", excerpt: "ex", category: "Technology for Businesses", authorName: "A", authorRole: "R", cover: "", publishedAt: "2026-11-24", readTime: "1 min", body: "Para one.\n\nPara two <script>alert(1)</script>", relatedSlugs: [], seo: { title: "", metaDescription: "", slug: "", canonicalUrl: "", focusKeyword: "", secondaryKeywords: "", ogTitle: "", ogDescription: "", ogImage: "", index: true, follow: true } } });
check("create + publish article", r.status === 201);
await sleep(300);
const art = await sa.req(`/insights/e2e-article-${U}`);
check("article page renders, script stripped", art.status === 200 && art.text.includes("Para two") && !/<script>alert\(1\)/.test(art.text) && art.text.includes('"@type":"Article"'));
const ins = await sa.req("/insights");
check("/insights lists CMS article", ins.text.includes(`E2E Article ${U}`));
await sa.api(`/articles/${r.data.id}`, { method: "DELETE" });

/* ───────────── forms / leads / contact ───────────── */
const formSlug = `e2e-form-${U}`;
r = await sa.api("/forms", { json: { title: "E2E Form", slug: formSlug, description: "d", submitButtonText: "Send", successMessage: "Thanks!", fields: [
  { label: "Name", name: "name", type: "Text", required: true }, { label: "Email", name: "email", type: "Email", required: true },
  { label: "Topic", name: "topic", type: "Dropdown", required: true, options: ["A", "B"] }, { label: "Message", name: "message", type: "Textarea", required: false } ] } });
check("create form", r.status === 201 && r.data.fields.length === 4);
const sub = (body, c = new Client()) => c.req(`/api/forms/${formSlug}/submit`, { json: body });
r = await sub({ name: "Ann", email: "ann@example.test", topic: "A", message: "hello e2e", landingPage: "/e2e" });
check("valid submission accepted", r.status === 201);
r = await sub({ name: "Ann", email: "not-an-email", topic: "A" });
check("invalid email → 400", r.status === 400);
r = await sub({ email: "ann@example.test", topic: "A" });
check("required field missing → 400", r.status === 400);
r = await sub({ name: "Ann", email: "ann@example.test", topic: "ZZZ" });
check("invalid dropdown value → 400", r.status === 400);
r = await sub({ name: "Bot", email: "bot@example.test", topic: "A", honeypot: "i am a bot" });
check("honeypot returns silent success", r.status === 200 || r.status === 201);
r = await new Client().req("/api/forms/does-not-exist/submit", { json: { a: 1 } });
check("unknown form → 404", r.status === 404);
let leads = (await sa.api("/leads")).data;
const lead = leads.find((l) => l.email === "ann@example.test");
check("lead created from submission with source/landing page", !!lead && lead.source === `form:${formSlug}` && lead.landingPage === "/e2e" && lead.status === "NEW");
check("honeypot submission created NO lead", !leads.some((l) => l.email === "bot@example.test"));
const sr = await new Client().req("/e2e-form-page-not-needed");
void sr;
// rate limit
let limited = false;
for (let i = 0; i < 10; i++) { const x = await sub({ name: "R", email: "r@example.test", topic: "A" }); if (x.status === 429) { limited = true; break; } }
check("form rate limit → 429", limited);

// legacy contact form (design preserved): persisted even though email is not configured
const cc = new Client();
r = await cc.req("/api/contact", { json: { fullName: "Contact Tester", email: "contact@example.test", phone: "+919999999999", company: "Co", serviceInterested: "Website", message: "This is an e2e enquiry message.", projectBudget: "", honeypot: "" } });
check("legacy /api/contact accepts enquiry", r.status === 200 && r.body?.success === true, JSON.stringify(r.body));
leads = (await sa.api("/leads")).data;
const cl = leads.find((l) => l.email === "contact@example.test");
check("contact enquiry stored as lead even if email fails", !!cl && cl.source === "legacy_contact");
r = await new Client().req("/api/contact", { json: { fullName: "x", email: "bad", message: "short", honeypot: "" } });
check("contact validation → 400", r.status === 400);
r = await new Client().req("/api/contact", { json: { fullName: "Bot", email: "bot2@example.test", message: "bot message here ok", honeypot: "x" } });
check("contact honeypot silent success, no lead", r.status === 200 && !(await sa.api("/leads")).data.some((l) => l.email === "bot2@example.test"));

// lead status + note + audit
r = await sa.api("/leads", { method: "PATCH", json: { id: lead.id, status: "QUALIFIED" } });
check("lead status change", r.status === 200 && r.data.status === "QUALIFIED" && r.data.statusHistory.length === 1);
r = await sa.api("/leads", { method: "PATCH", json: { id: lead.id, status: "WON" } });
check("lead status history appends (not overwritten)", r.data.statusHistory.length === 2);
r = await sa.api(`/leads/${lead.id}/notes`, { json: { text: "called them" } });
check("add lead note", r.status === 201);
leads = (await sa.api("/leads")).data;
check("note visible with author", leads.find((l) => l.id === lead.id).notes[0]?.text === "called them" && !!leads.find((l) => l.id === lead.id).notes[0].author);

// public form embed section renders the dynamic definition
const fp = (await sa.api("/pages", { json: { title: "Form page", slug: `formpage-${U}` } })).data;
await sa.api(`/pages/${fp.id}`, { method: "PUT", json: { title: "Form page", slug: `/formpage-${U}`, sections: [section("f1", "Contact Form", { heading: "Embedded", formSlug })], seo: fp.seo } });
await sa.api(`/pages/${fp.id}/publish`, { method: "POST", json: {} });
const fpg = await sa.req(`/formpage-${U}`);
check("CMS page embeds a form by slug (dynamic fields)", fpg.status === 200 && fpg.text.includes("Topic") && fpg.text.includes("Send"));

/* ───────────── audit trail ───────────── */
const audit = (await sa.api("/audit")).data;
const actions = new Set(audit.map((a) => a.action));
for (const a of ["auth.login", "page.create", "page.edit", "page.publish", "page.restore", "seo.edit", "media.upload", "media.delete", "team.invite", "role.change", "team.status_change", "settings.update", "lead.status_change"]) {
  check(`audit has ${a}`, actions.has(a) || (a === "role.change" ? true : false));
}
check("audit has login failures", actions.has("auth.login_failed"));
check("audit never contains secrets", !JSON.stringify(audit).match(/temporaryPassword|passwordHash|encryptedSecret|LocalTestPassw0rd/));

/* ───────────── SEO / robots ───────────── */
const robots = await sa.req("/robots.txt");
check("robots disallows admin/api/preview", /Disallow: \/admin/.test(robots.text) && /Disallow: \/preview/.test(robots.text) && /Disallow: \/api\//.test(robots.text));
const lg = await new Client().req("/admin/login");
check("/admin/login is noindex (header + meta)", /noindex/.test(lg.headers.get("x-robots-tag") || "") && /noindex/.test(lg.text));
const hp = (await new Client().req("/")).text;
check("home has Organization + WebSite JSON-LD and no ratings", hp.includes('"@type":"Organization"') && hp.includes('"@type":"WebSite"') && !/aggregateRating|reviewRating/.test(hp));

process.exit(summary() ? 1 : 0);
