// Run against a server started WITH 2FA enforced (ADMIN_REQUIRE_2FA unset). Needs E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD (seeded admin without 2FA).
import { Client, check, summary, totp } from "./lib.mjs";
const email = process.env.E2E_ADMIN_EMAIL, password = process.env.E2E_ADMIN_PASSWORD;

const c = new Client();
let r = await c.api("/auth/login", { json: { email, password: "wrong-password-123" } });
check("wrong password → 401", r.status === 401 && r.err?.code === "INVALID_CREDENTIALS");
r = await c.api("/auth/login", { json: { email: "nobody@example.test", password: "whatever-123456" } });
check("unknown user → 401 (same error)", r.status === 401 && r.err?.code === "INVALID_CREDENTIALS");
r = await c.api("/pages");
check("no session → 401", r.status === 401);
r = await c.req("/admin", { redirect: "manual" });
check("/admin without session redirects to login (proxy)", [302, 307].includes(r.status) && (r.headers.get("location") || "").includes("/admin/login"));

r = await c.api("/auth/login", { json: { email, password } });
check("correct password (no 2FA yet) → session + setup flag", r.status === 200 && r.data?.setupTwoFactor === true && c.jar.has("kash_admin_session"));
r = await c.api("/pages");
check("admin API refuses until 2FA enrolled", r.status === 403 && r.err?.code === "TWO_FACTOR_SETUP_REQUIRED");
r = await c.req("/admin/pages", { redirect: "manual" });
check("admin page without enrolled 2FA redirects to setup-2fa", [302, 307].includes(r.status) && (r.headers.get("location") || "").includes("/admin/setup-2fa"));

r = await c.api("/auth/2fa/setup", { method: "POST", json: {} });
check("2FA setup returns QR + manual key", r.status === 200 && !!r.data?.manualKey && r.data?.qrDataUrl?.startsWith("data:image/png"));
const secret = r.data.manualKey;
r = await c.api("/auth/2fa/confirm", { json: { code: "000000" } });
check("2FA confirm with wrong code → 400", r.status === 400);
r = await c.api("/auth/2fa/confirm", { json: { code: totp(secret) } });
check("2FA confirm with right code → 10 recovery codes", r.status === 200 && r.data?.recoveryCodes?.length === 10);
const recovery = r.data.recoveryCodes;
r = await c.api("/pages");
check("admin API works after enrolment", r.status === 200 && Array.isArray(r.data));
r = await c.api("/auth/session");
check("session reports 2FA enabled + SUPER_ADMIN", r.data?.twoFactorEnabled === true && r.data?.user.roles.includes("SUPER_ADMIN"));

r = await c.api("/auth/logout", { method: "POST", json: {} });
check("logout ok", r.status === 200);
r = await c.api("/pages");
check("session invalid after logout", r.status === 401);

// password + TOTP flow
r = await c.api("/auth/login", { json: { email, password } });
check("login with 2FA → requiresTwoFactor, NO session yet", r.data?.requiresTwoFactor === true && !c.jar.has("kash_admin_session") && c.jar.has("kash_2fa_pending"));
r = await c.api("/pages");
check("pending state grants no access", r.status === 401);
r = await c.api("/auth/verify-2fa", { json: { code: "123456" } });
check("wrong TOTP → 401", r.status === 401);
r = await c.api("/auth/verify-2fa", { json: { code: totp(secret) } });
check("right TOTP → session", r.status === 200 && c.jar.has("kash_admin_session"));
r = await c.api("/pages");
check("session works", r.status === 200);

// forged pending cookie (old design bug): user id + arbitrary suffix must NOT work
const forger = new Client();
const me = await c.api("/auth/session");
forger.jar.set("kash_2fa_pending", `${me.data.user.id}.x`);
r = await forger.api("/auth/verify-2fa", { json: { code: totp(secret) } });
check("forged 2FA-pending cookie rejected even with a valid TOTP", r.status === 401);
r = await forger.api("/auth/recovery", { json: { code: recovery[0] } });
check("recovery code without password step rejected", r.status === 401);

// recovery code (single use)
const rc = new Client();
await rc.api("/auth/login", { json: { email, password } });
r = await rc.api("/auth/recovery", { json: { code: "aaaaaaaaaa" } });
check("bad recovery code → 401", r.status === 401);
r = await rc.api("/auth/recovery", { json: { code: recovery[0] } });
check("recovery code logs in", r.status === 200 && rc.jar.has("kash_admin_session"));
const rc2 = new Client();
await rc2.api("/auth/login", { json: { email, password } });
r = await rc2.api("/auth/recovery", { json: { code: recovery[0] } });
check("recovery code is single-use", r.status === 401);

// CSRF: cross-origin mutating request rejected
r = await c.api("/auth/logout", { method: "POST", json: {}, headers: { origin: "https://evil.example" } });
check("cross-origin POST rejected", r.status === 403 && r.err?.code === "CSRF");

// rate limit (last: burns the limiter)
const rl = new Client();
let limited = false;
for (let i = 0; i < 12; i++) { const x = await rl.api("/auth/login", { json: { email: "rl@example.test", password: "bad-password-12345" } }); if (x.status === 429) { limited = true; break; } }
check("login rate limit → 429", limited);

const failures = summary();
process.exit(failures ? 1 : 0);
