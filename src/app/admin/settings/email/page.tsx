"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, Mail, Send, ShieldAlert, XCircle } from "lucide-react";
import type { EmailSettingsView, EmailStatusView } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

const input = "w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs bg-white";
const card = "bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3 text-xs";
const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : "—");
const STATE: Record<EmailStatusView["state"], { label: string; cls: string }> = {
  connected: { label: "Connected", cls: "bg-green-50 text-green-700 border-green-200" },
  not_configured: { label: "Not Configured", cls: "bg-stone-100 text-stone-600 border-stone-200" },
  disabled: { label: "Configured — delivery switched off", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  error: { label: "Error", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function EmailSettingsPage() {
  const { addToast } = useToast();
  const [s, setS] = useState<EmailSettingsView | null>(null);
  const [status, setStatus] = useState<EmailStatusView | null>(null);
  const [domain, setDomain] = useState<{ domain: string; status: string; detail: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [replacing, setReplacing] = useState(false);
  const [testTo, setTestTo] = useState("");

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([adminClient.getEmailSettings(), adminClient.getEmailDeliveryStatus()]);
      setS(a); setStatus(b); setTestTo((t) => t || a.testRecipient || a.internalRecipient);
      adminClient.getEmailDomain().then(setDomain).catch(() => setDomain(null));
    } catch (e) { setError(errorMessage(e)); }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(() => { void load(); }, [load]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try { await fn(); await load(); addToast({ title: ok, message: "Saved.", type: "success" }); }
    catch (e) { addToast({ title: "Not saved", message: errorMessage(e), type: "error" }); }
    finally { setBusy(false); }
  };
  const save = (e: React.FormEvent) => { e.preventDefault(); if (!s) return; void run(() => adminClient.saveEmailSettings({
    enabled: s.enabled, sendVisitorConfirmation: s.sendVisitorConfirmation, sendInternalNotification: s.sendInternalNotification, fromName: s.fromName, fromEmail: s.fromEmail,
    replyToEmail: s.replyToEmail, internalRecipient: s.internalRecipient, visitorReplyEmail: s.visitorReplyEmail, testRecipient: s.testRecipient,
  }), "Email settings saved"); };
  const saveKey = () => run(async () => { await adminClient.setEmailApiKey(newKey); setNewKey(""); setReplacing(false); }, "API key saved");
  const test = async () => {
    setBusy(true);
    try {
      const r = await adminClient.sendTestEmail(testTo.trim());
      addToast({ title: r.status === "SENT" ? "Test email sent" : "Test email not sent", message: r.message ?? r.status, type: r.status === "SENT" ? "success" : "error" });
      await load();
    } catch (e) { addToast({ title: "Test failed", message: errorMessage(e), type: "error" }); } finally { setBusy(false); }
  };
  const set = <K extends keyof EmailSettingsView>(k: K, v: EmailSettingsView[K]) => setS((p) => (p ? { ...p, [k]: v } : p));
  const toggle = (label: string, hint: string, k: "enabled" | "sendVisitorConfirmation" | "sendInternalNotification") => s && (
    <label className="flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={s[k]} onChange={(e) => set(k, e.target.checked)} /><span><b>{label}</b><span className="block text-stone-500">{hint}</span></span></label>
  );

  return (
    <div className="space-y-6">
      <AdminHeader title="Email & Resend" subtitle="Enquiry notifications to your team and thank-you emails to visitors. Leads are always saved first — email can never lose one." breadcrumbs={[{ label: "Settings" }, { label: "Email & Resend" }]} />
      <div className="px-4 sm:px-6 space-y-5 max-w-5xl">
        {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
        {!s && !error && <p className="text-xs text-stone-400">Loading…</p>}
        {s && status && (
          <>
            <section className={card}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><Mail className="w-4 h-4 text-[#FF5A00]" />Email delivery</h4>
                <span className={`px-2.5 py-1 rounded-full border font-bold ${STATE[status.state].cls}`}>{STATE[status.state].label}</span>
              </div>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                <div><dt className="inline text-stone-400">Provider: </dt><dd className="inline font-semibold">Resend</dd></div>
                <div><dt className="inline text-stone-400">From: </dt><dd className="inline font-semibold">{status.from ?? "—"}</dd></div>
                <div><dt className="inline text-stone-400">Internal recipient: </dt><dd className="inline font-semibold">{status.internalRecipient}</dd></div>
                <div><dt className="inline text-stone-400">API key: </dt><dd className="inline font-semibold">{status.apiKeySource === "none" ? "not set" : status.apiKeySource === "environment" ? "server environment" : "saved in admin (encrypted)"}</dd></div>
                <div><dt className="inline text-stone-400">Last successful send: </dt><dd className="inline font-semibold">{when(status.lastSuccess)}</dd></div>
                <div><dt className="inline text-stone-400">Last failure: </dt><dd className="inline font-semibold">{status.lastFailure ? `${when(status.lastFailure.at)} — ${status.lastFailure.message ?? status.lastFailure.code}` : "—"}</dd></div>
              </dl>
              <div className="flex gap-4 pt-1"><Link href="/admin/settings/email/logs" className="text-[#FF5A00] font-semibold hover:underline">Delivery log →</Link><Link href="/admin/settings/email-templates" className="text-[#FF5A00] font-semibold hover:underline">Edit email templates →</Link></div>
            </section>

            <section className={card}>
              <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><KeyRound className="w-4 h-4 text-[#FF5A00]" />Resend API key</h4>
              {s.apiKey.configured && !replacing ? (
                <div className="space-y-2">
                  <p className="font-mono text-sm tracking-widest">API key: ••••••••••••••••{s.apiKey.lastFour ? ` ${s.apiKey.lastFour}` : ""}</p>
                  <p className="text-stone-500">{s.apiKey.source === "environment" ? "Provided by the server environment. Saving a key here overrides it." : "Stored encrypted. It is never shown again."}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setReplacing(true)} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50">Replace Key</button>
                    {s.apiKey.source === "database" && <button type="button" disabled={busy} onClick={() => { if (confirm("Remove the saved Resend API key? Email sending will stop unless the server has an environment key.")) void run(() => adminClient.removeEmailApiKey(), "API key removed"); }} className="px-3 py-1.5 border border-red-200 text-red-700 rounded-lg font-semibold hover:bg-red-50">Remove Key</button>}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block font-semibold">{replacing ? "New API key" : "API key"}
                    <input type="password" autoComplete="off" spellCheck={false} value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="re_…" className={`${input} mt-1 font-mono`} />
                  </label>
                  <p className="text-stone-500">Create a key in the Resend dashboard (Sending access is enough). It is encrypted on the server and cannot be read back.</p>
                  <div className="flex gap-2">
                    <button type="button" disabled={busy || !newKey.trim()} onClick={() => void saveKey()} className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-50">Save Key</button>
                    {replacing && <button type="button" onClick={() => { setReplacing(false); setNewKey(""); }} className="px-3 py-2 border border-[#E8E5E2] rounded-lg font-semibold">Cancel</button>}
                  </div>
                </div>
              )}
            </section>

            <form onSubmit={save} className={card}>
              <h4 className="font-bold uppercase tracking-wider">Sender &amp; recipients</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block font-semibold">Provider<input value="Resend" disabled className={`${input} mt-1 bg-stone-50`} /></label>
                <label className="block font-semibold">From name<input value={s.fromName} onChange={(e) => set("fromName", e.target.value)} placeholder="KASH Technology" className={`${input} mt-1`} /></label>
                <label className="block font-semibold">From email<input type="email" value={s.fromEmail} onChange={(e) => set("fromEmail", e.target.value)} placeholder="noreply@kash-technology.com" className={`${input} mt-1`} /><span className="block font-normal text-stone-500 mt-1">Must be an address on a domain verified in Resend.</span></label>
                <label className="block font-semibold">Reply-to email<input type="email" value={s.replyToEmail} onChange={(e) => set("replyToEmail", e.target.value)} placeholder="founder@kash-technology.com" className={`${input} mt-1`} /></label>
                <label className="block font-semibold">Founder / internal notification email<input type="email" value={s.internalRecipient} onChange={(e) => set("internalRecipient", e.target.value)} className={`${input} mt-1`} /></label>
                <label className="block font-semibold">Default visitor reply email<input type="email" value={s.visitorReplyEmail} onChange={(e) => set("visitorReplyEmail", e.target.value)} placeholder="founder@kash-technology.com" className={`${input} mt-1`} /></label>
                <label className="block font-semibold sm:col-span-2">Test email recipient<input type="email" value={s.testRecipient} onChange={(e) => set("testRecipient", e.target.value)} className={`${input} mt-1`} /></label>
              </div>
              <div className="space-y-2 pt-1">
                {toggle("Enable email delivery", "Master switch. Off = nothing is sent (enquiries are still saved).", "enabled")}
                {toggle("Send internal notification", "Email the founder a full enquiry summary for each new lead.", "sendInternalNotification")}
                {toggle("Send visitor confirmation", "Send the visitor a thank-you email.", "sendVisitorConfirmation")}
              </div>
              <button type="submit" disabled={busy} className="px-5 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-50">{busy ? "Saving…" : "Save settings"}</button>
            </form>

            <section className={card}>
              <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><Send className="w-4 h-4 text-[#FF5A00]" />Send test email</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="recipient@example.com" className={input} />
                <button type="button" disabled={busy || !testTo} onClick={() => void test()} className="px-4 py-2 bg-[#0B0B0F] text-white rounded-lg font-bold disabled:opacity-50 whitespace-nowrap">Send Test Email</button>
              </div>
              <p className="text-stone-500">Save your key, From address and settings first. Works even while delivery is switched off.</p>
            </section>

            <section className={card}>
              <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-[#FF5A00]" />Sending domain</h4>
              <p><b>{domain?.domain ?? (s.fromEmail.split("@")[1] || "kash-technology.com")}</b>{" "}
                {domain?.status === "verified" && <span className="inline-flex items-center gap-1 text-green-700 font-bold"><CheckCircle2 className="w-3.5 h-3.5" />Configured</span>}
                {domain?.status === "needs_verification" && <span className="inline-flex items-center gap-1 text-amber-700 font-bold"><XCircle className="w-3.5 h-3.5" />Needs verification</span>}
                {(!domain || domain.status === "unknown") && <span className="text-stone-500 font-bold">Unknown</span>}</p>
              <p className="text-stone-500">{domain?.detail ?? "Checking…"} DNS is never changed automatically — add the records Resend shows you at your DNS provider, then enter the verified From address above.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
