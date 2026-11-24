import { TOTP } from "otpauth";

export const BASE = process.env.E2E_BASE || "http://localhost:3200";
let pass = 0, failed = 0;
export const results = [];
export function check(name, cond, extra = "") {
  if (!cond) console.log(`  FAIL ${name} ${extra}`);
  if (cond) { pass++; results.push(`  ok   ${name}`); } else { failed++; results.push(`  FAIL ${name} ${extra}`); }
}
export const summary = () => { console.log(results.join("\n")); console.log(`\n${pass} passed, ${failed} failed`); return failed; };

/** Minimal cookie-jar client. */
export class Client {
  jar = new Map();
  async req(path, { method, json, form, headers = {}, redirect = "manual" } = {}) {
    method ??= json !== undefined || form ? "POST" : "GET";
    const h = { ...headers };
    if (json !== undefined) h["content-type"] = "application/json";
    if (this.jar.size) h.cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
    const res = await fetch(BASE + path, { method, headers: h, body: form ?? (json !== undefined ? JSON.stringify(json) : undefined), redirect });
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const [pair] = c.split(";");
      const i = pair.indexOf("=");
      const k = pair.slice(0, i), v = pair.slice(i + 1);
      if (!v || /max-age=0/i.test(c)) this.jar.delete(k); else this.jar.set(k, v);
    }
    const text = await res.text();
    let body; try { body = JSON.parse(text); } catch { body = null; }
    return { status: res.status, headers: res.headers, text, body, data: body?.data, err: body?.error };
  }
  api(path, o) { return this.req(`/api/admin${path}`, o); }
}
export const totp = (secret) => new TOTP({ secret, digits: 6, period: 30, algorithm: "SHA1" }).generate();
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 1x1 PNG
export const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64");
