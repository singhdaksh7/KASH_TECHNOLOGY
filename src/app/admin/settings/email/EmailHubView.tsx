"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { 
  Mail, 
  Send, 
  History, 
  FileText, 
  CheckCircle2, 
  Settings as SettingsIcon,
  Eye,
} from "lucide-react";
import type { 
  EmailSettingsView, 
  EmailStatusView, 
  EmailTemplateItem, 
  EmailDeliveryItem 
} from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { 
  AdminPage, 
  PageHeader, 
  Tabs, 
  Card, 
  StatusBadge, 
  Button, 
  EmptyState,
  Skeleton
} from "@/components/admin/ui";

interface EmailHubProps {
  initialTab?: string;
}

export default function EmailHubView({ initialTab = "overview" }: EmailHubProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Settings State
  const [settings, setSettings] = useState<EmailSettingsView | null>(null);
  const [status, setStatus] = useState<EmailStatusView | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [replacingKey, setReplacingKey] = useState(false);
  const [testTo, setTestTo] = useState("");

  // Templates State
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateItem | null>(null);
  const [draftTemplate, setDraftTemplate] = useState<EmailTemplateItem | null>(null);
  const [templatePreview, setTemplatePreview] = useState<{ subject: string; text: string; html: string | null } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const templateBodyRef = useRef<HTMLTextAreaElement>(null);

  // Logs State
  const [logs, setLogs] = useState<EmailDeliveryItem[]>([]);
  const [logFilter, setLogFilter] = useState("");
  const [logOpenId, setLogOpenId] = useState<string | null>(null);
  const [retryBusyId, setRetryBusyId] = useState("");

  // Load Settings & Status
  const refreshSettings = useCallback(async () => {
    try {
      const [s, st] = await Promise.all([
        adminClient.getEmailSettings(),
        adminClient.getEmailDeliveryStatus(),
      ]);
      setSettings(s);
      setStatus(st);
      setTestTo((t) => t || s.testRecipient || s.internalRecipient || "");
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      adminClient.getEmailSettings(),
      adminClient.getEmailDeliveryStatus(),
    ])
      .then(([s, st]) => {
        if (!alive) return;
        setSettings(s);
        setStatus(st);
        setTestTo((t) => t || s.testRecipient || s.internalRecipient || "");
      })
      .catch((e) => {
        if (!alive) return;
        setError(errorMessage(e));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // Load Templates & Logs
  const loadTemplates = useCallback(async () => {
    try {
      const t = await adminClient.getEmailTemplates();
      setTemplates(t);
      if (t[0]) {
        setSelectedTemplate(t[0]);
        setDraftTemplate({ ...t[0] });
      }
    } catch {}
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      const rows = await adminClient.getEmailDeliveries(logFilter || undefined);
      setLogs(rows);
    } catch {}
  }, [logFilter]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (newTab === "templates" && templates.length === 0) {
      void loadTemplates();
    }
    if (newTab === "logs") {
      void loadLogs();
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setBusy(true);
    try {
      await adminClient.saveEmailSettings({
        enabled: settings.enabled,
        sendVisitorConfirmation: settings.sendVisitorConfirmation,
        sendInternalNotification: settings.sendInternalNotification,
        fromName: settings.fromName,
        fromEmail: settings.fromEmail,
        replyToEmail: settings.replyToEmail,
        internalRecipient: settings.internalRecipient,
        visitorReplyEmail: settings.visitorReplyEmail,
        testRecipient: settings.testRecipient,
      });
      await refreshSettings();
      addToast({ title: "Email settings saved", message: "Delivery configuration updated.", type: "success" });
    } catch (e) {
      addToast({ title: "Failed to save", message: errorMessage(e), type: "error" });
    } finally {
      setBusy(false);
    }
  };

  // Save API Key
  const handleSaveKey = async () => {
    if (!newKey.trim()) return;
    setBusy(true);
    try {
      await adminClient.setEmailApiKey(newKey.trim());
      setNewKey("");
      setReplacingKey(false);
      await refreshSettings();
      addToast({ title: "API key stored", message: "Encrypted securely in database.", type: "success" });
    } catch (e) {
      addToast({ title: "Key not stored", message: errorMessage(e), type: "error" });
    } finally {
      setBusy(false);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    if (!testTo.trim()) return;
    setBusy(true);
    try {
      const res = await adminClient.sendTestEmail(testTo.trim());
      addToast({
        title: res.status === "SENT" ? "Test email dispatched" : "Test email failed",
        message: res.message || res.status,
        type: res.status === "SENT" ? "success" : "error",
      });
      await refreshSettings();
    } catch (e) {
      addToast({ title: "Test dispatch failed", message: errorMessage(e), type: "error" });
    } finally {
      setBusy(false);
    }
  };

  // Retry delivery
  const handleRetryLog = async (id: string) => {
    setRetryBusyId(id);
    try {
      const r = await adminClient.retryEmailDelivery(id);
      addToast({
        title: r.status === "SENT" ? "Email re-sent" : "Retry failed",
        message: r.errorMessage || r.status,
        type: r.status === "SENT" ? "success" : "error",
      });
      await loadLogs();
    } catch (e) {
      addToast({ title: "Retry failed", message: errorMessage(e), type: "error" });
    } finally {
      setRetryBusyId("");
    }
  };

  // Save Template
  const handleSaveTemplate = async () => {
    if (!draftTemplate) return;
    setBusy(true);
    try {
      const saved = await adminClient.saveEmailTemplate(draftTemplate);
      setTemplates((all) => all.map((x) => (x.slug === saved.slug ? saved : x)));
      setSelectedTemplate(saved);
      setDraftTemplate({ ...saved });
      addToast({ title: "Template saved", message: `${saved.name} updated.`, type: "success" });
    } catch (e) {
      addToast({ title: "Save failed", message: errorMessage(e), type: "error" });
    } finally {
      setBusy(false);
    }
  };

  // Preview Template
  const handlePreviewTemplate = async () => {
    if (!draftTemplate) return;
    try {
      const res = await adminClient.previewEmailTemplate(draftTemplate.slug, {
        subject: draftTemplate.subject,
        body: draftTemplate.body,
      });
      setTemplatePreview(res);
    } catch (e) {
      addToast({ title: "Preview error", message: errorMessage(e), type: "error" });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Mail className="w-4 h-4" /> },
    { id: "config", label: "Configuration", icon: <SettingsIcon className="w-4 h-4" /> },
    { id: "templates", label: "Templates", icon: <FileText className="w-4 h-4" /> },
    { id: "logs", label: "Delivery Logs", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <AdminPage maxWidth="default">
      <PageHeader
        title="Email"
        description="Transactional enquiry alerts and customer auto-replies powered by Resend."
        breadcrumbs={[{ label: "Settings", href: "/admin/settings" }, { label: "Email" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab("config")}
            >
              Test Email
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("config")}
            >
              Configure Settings
            </Button>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 pt-2">
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              {/* Status Banner */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">
                        Resend Outbound Delivery
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Connected to transactional provider via AES-256-GCM encrypted database settings.
                      </p>
                    </div>
                  </div>

                  <div>
                    {status?.state === "connected" && (
                      <StatusBadge variant="success">Operational &amp; Active</StatusBadge>
                    )}
                    {status?.state === "disabled" && (
                      <StatusBadge variant="warning">Configured (Delivery Paused)</StatusBadge>
                    )}
                    {status?.state === "not_configured" && (
                      <StatusBadge variant="neutral">Not Configured</StatusBadge>
                    )}
                    {status?.state === "error" && (
                      <StatusBadge variant="danger">Delivery Error</StatusBadge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-5 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[11px] mb-1">From Address</span>
                    <span className="font-semibold text-stone-800 break-all">
                      {settings?.fromEmail || "Not configured"}
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[11px] mb-1">Internal Recipient</span>
                    <span className="font-semibold text-stone-800 break-all">
                      {settings?.internalRecipient || "Not configured"}
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[11px] mb-1">API Key Source</span>
                    <span className="font-semibold text-stone-800">
                      {status?.apiKeySource === "database" ? "Database (Encrypted)" : status?.apiKeySource || "None"}
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[11px] mb-1">Masked Key</span>
                    <span className="font-mono font-semibold text-stone-800">
                      {settings?.apiKey.lastFour ? `••••${settings.apiKey.lastFour}` : "None"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions & Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Email Templates</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Customize branded email layouts and copy for visitor auto-replies and internal enquiry notifications.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("templates")}
                    >
                      Manage Templates
                    </Button>
                  </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Delivery Log &amp; Auditing</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Inspect sent, failed, or skipped transactional emails. Retry failed deliveries with one click.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("logs")}
                    >
                      View Delivery Logs
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. CONFIGURATION TAB */}
      {activeTab === "config" && settings && (
        <div className="space-y-6 pt-2 max-w-4xl">
          {/* Key Management */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-stone-900 mb-1">
              Resend API Key
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Stored securely using AES-256-GCM encryption. Never exposed in full in the browser or audit logs.
            </p>

            {settings?.apiKey.configured && !replacingKey ? (
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono font-medium text-stone-800">
                    ••••{settings.apiKey.lastFour} ({settings.apiKey.source})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplacingKey(true)}
                >
                  Replace Key
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="re_..."
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={busy}
                    onClick={handleSaveKey}
                  >
                    Save Encrypted Key
                  </Button>
                  {settings?.apiKey.configured && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplacingKey(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Sender & Delivery Rules Form */}
          <Card className="p-6">
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <h3 className="text-base font-semibold text-stone-900">
                Sender &amp; Recipient Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">From Name</label>
                  <input
                    type="text"
                    value={settings.fromName || ""}
                    onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    placeholder="KASH Technology"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">From Email</label>
                  <input
                    type="email"
                    value={settings.fromEmail || ""}
                    onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    placeholder="contact@kash-technology.com"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Internal Recipient</label>
                  <input
                    type="email"
                    value={settings.internalRecipient || ""}
                    onChange={(e) => setSettings({ ...settings, internalRecipient: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    placeholder="founder@kash-technology.com"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Reply-To Email</label>
                  <input
                    type="email"
                    value={settings.replyToEmail || ""}
                    onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    placeholder="contact@kash-technology.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span className="font-medium text-stone-900">Enable outbound email delivery</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendInternalNotification}
                    onChange={(e) => setSettings({ ...settings, sendInternalNotification: e.target.checked })}
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span className="font-medium text-stone-900">Send internal notifications for new enquiries</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendVisitorConfirmation}
                    onChange={(e) => setSettings({ ...settings, sendVisitorConfirmation: e.target.checked })}
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span className="font-medium text-stone-900">Send confirmation thank-you emails to visitors</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <Button variant="primary" size="sm" type="submit" loading={busy}>
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* Test Email */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-stone-900 mb-1">
              Send Test Email
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Dispatches a test message using active credentials to verify delivery.
            </p>

            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="test@example.com"
                className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-xs"
              />
              <Button
                variant="secondary"
                size="sm"
                loading={busy}
                onClick={handleSendTestEmail}
              >
                Send Test
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 3. TEMPLATES TAB */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-start">
          <div className="space-y-2">
            {templates.map((t) => (
              <div
                key={t.slug}
                onClick={() => {
                  setSelectedTemplate(t);
                  setDraftTemplate({ ...t });
                  setTemplatePreview(null);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate?.slug === t.slug
                    ? "border-[#FF5A00] bg-orange-50/20"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{t.name}</span>
                  {!t.enabled && <StatusBadge variant="neutral" size="sm">OFF</StatusBadge>}
                </div>
                <p className="text-[11px] text-stone-400 mt-1 font-mono">{t.slug}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {draftTemplate ? (
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-semibold text-stone-900">{draftTemplate.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={handlePreviewTemplate}>
                      Preview
                    </Button>
                    <Button variant="primary" size="sm" loading={busy} onClick={handleSaveTemplate}>
                      Save Template
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={draftTemplate.subject}
                      onChange={(e) => setDraftTemplate({ ...draftTemplate, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Body Text</label>
                    <textarea
                      ref={templateBodyRef}
                      rows={8}
                      value={draftTemplate.body}
                      onChange={(e) => setDraftTemplate({ ...draftTemplate, body: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                {templatePreview && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700">Preview</span>
                      <div className="flex gap-1 text-xs">
                        <button
                          onClick={() => setPreviewDevice("desktop")}
                          className={`px-2 py-1 rounded ${previewDevice === "desktop" ? "bg-white shadow-2xs font-bold" : "text-stone-500"}`}
                        >
                          Desktop
                        </button>
                        <button
                          onClick={() => setPreviewDevice("mobile")}
                          className={`px-2 py-1 rounded ${previewDevice === "mobile" ? "bg-white shadow-2xs font-bold" : "text-stone-500"}`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>
                    {templatePreview.html ? (
                      <div
                        className={`mx-auto bg-white rounded-lg border border-stone-200 overflow-hidden ${
                          previewDevice === "mobile" ? "max-w-sm" : "w-full"
                        }`}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={templatePreview.html}
                          className="w-full h-80 border-0"
                        />
                      </div>
                    ) : (
                      <pre className="text-xs p-3 bg-white rounded border border-stone-200 overflow-x-auto whitespace-pre-wrap">
                        {templatePreview.text}
                      </pre>
                    )}
                  </div>
                )}
              </Card>
            ) : (
              <EmptyState title="Select a template" description="Choose a template on the left to edit its content." />
            )}
          </div>
        </div>
      )}

      {/* 4. LOGS TAB */}
      {activeTab === "logs" && (
        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            {["", "SENT", "FAILED", "SKIPPED"].map((f) => (
              <button
                key={f || "all"}
                onClick={() => setLogFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  logFilter === f
                    ? "bg-[#FF5A00] text-white border-[#FF5A00]"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                {f ? f[0] + f.slice(1).toLowerCase() : "All Statuses"}
              </button>
            ))}
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 text-stone-500 text-left border-b border-stone-200 font-medium">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Template</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400">
                        No delivery logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((r) => (
                      <React.Fragment key={r.id}>
                        <tr className="hover:bg-stone-50/50">
                          <td className="p-3 whitespace-nowrap text-stone-600">
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          <td className="p-3 font-medium text-stone-900">
                            {r.templateKey}
                          </td>
                          <td className="p-3 text-stone-600 font-mono">
                            {r.recipient}
                          </td>
                          <td className="p-3">
                            <StatusBadge
                              variant={
                                r.status === "SENT"
                                  ? "success"
                                  : r.status === "FAILED"
                                  ? "danger"
                                  : "neutral"
                              }
                              size="sm"
                            >
                              {r.status}
                            </StatusBadge>
                          </td>
                          <td className="p-3 text-stone-500">{r.provider}</td>
                          <td className="p-3 text-right space-x-2">
                            {r.errorMessage && (
                              <button
                                onClick={() => setLogOpenId(logOpenId === r.id ? null : r.id)}
                                className="text-stone-500 underline text-xs hover:text-stone-800"
                              >
                                View Error
                              </button>
                            )}
                            {(r.status === "FAILED" || r.status === "SKIPPED") && (
                              <button
                                disabled={retryBusyId === r.id}
                                onClick={() => handleRetryLog(r.id)}
                                className="px-2 py-1 border border-stone-200 rounded text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                              >
                                {retryBusyId === r.id ? "…" : "Retry"}
                              </button>
                            )}
                          </td>
                        </tr>
                        {logOpenId === r.id && (
                          <tr className="bg-red-50/50">
                            <td colSpan={6} className="p-3 text-xs text-red-800 font-mono">
                              {r.errorMessage} ({r.errorCode})
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </AdminPage>
  );
}
