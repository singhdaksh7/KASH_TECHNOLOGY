"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Eye, Monitor, Save, Smartphone } from "lucide-react";
import type { EmailTemplateItem } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";

export default function EmailTemplatesPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState<EmailTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EmailTemplateItem | null>(null);
  const [draft, setDraft] = useState<EmailTemplateItem | null>(null);
  const [preview, setPreview] = useState<{ subject: string; text: string; html: string | null } | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewError, setPreviewError] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adminClient.getEmailTemplates().then((t) => { setItems(t); if (t[0]) { setSelected(t[0]); setDraft({ ...t[0] }); } }).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
    adminClient.getEmailStatus().then((s) => setConfigured(s.configured)).catch(() => setConfigured(null));
  }, []);

  const pick = (t: EmailTemplateItem) => { setSelected(t); setDraft({ ...t }); setPreview(null); setPreviewError(""); };
  const dirty = !!draft && !!selected && (draft.subject !== selected.subject || draft.body !== selected.body || draft.enabled !== selected.enabled);
  const insert = (v: string) => {
    if (!draft) return;
    const el = bodyRef.current, token = `{{${v}}}`;
    const at = el?.selectionStart ?? draft.body.length;
    setDraft({ ...draft, body: draft.body.slice(0, at) + token + draft.body.slice(el?.selectionEnd ?? at) });
  };
  const runPreview = async () => {
    if (!draft) return;
    try { setPreview(await adminClient.previewEmailTemplate(draft.slug, { subject: draft.subject, body: draft.body })); setPreviewError(""); }
    catch (e) { setPreview(null); setPreviewError(errorMessage(e)); }
  };
  const save = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      const saved = await adminClient.saveEmailTemplate(draft);
      setItems((all) => all.map((x) => (x.slug === saved.slug ? saved : x)));
      setSelected(saved); setDraft({ ...saved });
      addToast({ title: "Template saved", message: `${saved.name} updated.`, type: "success" });
    } catch (e) { addToast({ title: "Not saved", message: errorMessage(e), type: "error" }); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Email Templates" subtitle="Emails sent by the CMS. Enquiry emails are wrapped in the KASH-branded layout automatically. Only the listed {{variables}} can be used; anything else is rejected." breadcrumbs={[{ label: "Settings" }, { label: "Email Templates" }]} />
      {configured === false && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div><span className="font-bold block">Email delivery is not set up on this server</span>Templates can be edited and previewed, but no email is sent yet. Leads and form submissions are still saved and appear in the admin.</div>
        </div>
      )}
      {error && <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
      {loading && <p className="text-xs text-stone-400">Loading templates…</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-2">
          {items.map((t) => (
            <button key={t.slug} onClick={() => pick(t)} className={`w-full text-left p-4 rounded-xl border-2 bg-white ${selected?.slug === t.slug ? "border-[#FF5A00]" : "border-[#E8E5E2] hover:border-stone-400"}`}>
              <div className="flex items-center justify-between gap-2"><span className="font-bold text-xs">{t.name}</span>{!t.enabled && <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 rounded">OFF</span>}</div>
              <p className="mt-0.5 text-[11px] font-mono text-stone-400">{t.slug}{t.isCustomised ? " · customised" : " · default"}</p>
            </button>
          ))}
        </div>
        {draft && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E5E2] p-6 space-y-4 text-xs">
            <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} />Use this template (when off, the built-in default text is sent)</label>
            <label className="block"><span className="block font-semibold mb-1">Subject</span><input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" /></label>
            <label className="block"><span className="block font-semibold mb-1">{draft.slug === "lead_internal" || draft.slug === "lead_confirmation" ? "Message copy" : "Body"}</span>
              {(draft.slug === "lead_internal" || draft.slug === "lead_confirmation") && <span className="block text-stone-500 mb-1">This text appears inside the branded email. The header, enquiry summary, attribution, buttons and footer are added automatically, and empty fields are hidden.</span>}<textarea ref={bodyRef} rows={12} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono leading-relaxed" /></label>
            <div>
              <span className="block font-semibold mb-1">Available variables (click to insert into the body)</span>
              <div className="flex flex-wrap gap-1.5">{draft.variables.map((v) => <button key={v} type="button" onClick={() => insert(v)} className="px-2 py-1 rounded border border-[#E8E5E2] font-mono hover:bg-[#FFF3E9]">{`{{${v}}}`}</button>)}</div>
            </div>
            {previewError && <p role="alert" className="text-red-600">{previewError}</p>}
            {preview && (
              <div className="p-4 rounded-lg bg-stone-50 border border-[#E8E5E2] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-wider text-amber-700 font-bold">Preview data — sample values, nothing is sent</p>
                  {preview.html && (
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setDevice("desktop")} className={`px-2 py-1 rounded border flex items-center gap-1 ${device === "desktop" ? "bg-[#FF5A00] text-white border-[#FF5A00]" : "bg-white border-[#E8E5E2]"}`}><Monitor className="w-3.5 h-3.5" />Desktop</button>
                      <button type="button" onClick={() => setDevice("mobile")} className={`px-2 py-1 rounded border flex items-center gap-1 ${device === "mobile" ? "bg-[#FF5A00] text-white border-[#FF5A00]" : "bg-white border-[#E8E5E2]"}`}><Smartphone className="w-3.5 h-3.5" />Mobile</button>
                    </div>
                  )}
                </div>
                <p className="font-bold">Subject: {preview.subject}</p>
                {preview.html
                  ? <iframe title="Email preview" sandbox="" srcDoc={preview.html} className="mx-auto block bg-white border border-[#E8E5E2] rounded-lg" style={{ width: device === "mobile" ? 375 : "100%", maxWidth: "100%", height: 640 }} />
                  : <pre className="whitespace-pre-wrap font-sans leading-relaxed">{preview.text}</pre>}
              </div>
            )}
            <div className="flex justify-between pt-2">
              <button type="button" onClick={runPreview} className="px-4 py-2 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Preview</button>
              <button disabled={!dirty || busy} onClick={save} className="px-5 py-2 bg-[#FF5A00] text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-1.5"><Save className="w-4 h-4" />{busy ? "Saving…" : "Save template"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
