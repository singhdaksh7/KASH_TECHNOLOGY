"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  AdminPageItem,
  PageSection,
  SectionType,
  SectionStyle,
  SchemaType,
  SchedulePublishConfig,
  PageVersion,
  VersionDiff,
  SessionInfo,
} from "@/lib/admin-client/types";
import { newId } from "@/lib/admin-client/ids";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Settings,
  Search,
  Layout,
  X,
  Calendar,
  Clock,
  Send,
  Check,
  AlertCircle,
  GitCompare,
  RotateCcw,
} from "lucide-react";

const AVAILABLE_SECTIONS: Array<{ type: SectionType; label: string; desc: string; icon: string }> = [
  { type: "Hero", label: "Hero", desc: "Main landing header with headline, badges & image", icon: "🚀" },
  { type: "Rich Text", label: "Rich Text", desc: "Longform copy, articles, or text blocks", icon: "📝" },
  { type: "Image + Text", label: "Image + Text", desc: "Split visual showcase with image left", icon: "🖼️" },
  { type: "Text + Image", label: "Text + Image", desc: "Split visual showcase with text left", icon: "📐" },
  { type: "Services Grid", label: "Services Grid", desc: "6-card capability cards with orange badges", icon: "⚙️" },
  { type: "Portfolio Grid", label: "Portfolio Grid", desc: "Project cards with screenshots and tags", icon: "💼" },
  { type: "Featured Project", label: "Featured Project", desc: "Highlight showcase with mockup and stats", icon: "⭐" },
  { type: "CTA", label: "CTA Banner", desc: "High-impact orange banner with action buttons", icon: "🔥" },
  { type: "FAQ", label: "FAQ Accordion", desc: "Expandable questions & answers", icon: "❓" },
  { type: "Stats", label: "Stats Strip", desc: "Key qualitative milestones or metrics", icon: "📊" },
  { type: "Trust Strip", label: "Trust Strip", desc: "Startups, local businesses trust bar", icon: "🤝" },
  { type: "Logo Strip", label: "Logo Strip", desc: "Client & partner logos carousel", icon: "🏷️" },
  { type: "Founder", label: "Founder Story", desc: "Founder note & credentials", icon: "👤" },
  { type: "Team", label: "Team Grid", desc: "Multi-disciplinary team capabilities", icon: "👥" },
  { type: "Process", label: "Process Steps", desc: "Discover, Plan, Build, Launch 4-step workflow", icon: "🧭" },
  { type: "Video", label: "Video Showcase", desc: "Responsive video player with thumbnail", icon: "🎬" },
  { type: "Gallery", label: "Image Gallery", desc: "Multi-image responsive grid", icon: "📸" },
  { type: "Contact Form", label: "Contact Form", desc: "Interactive project inquiry form", icon: "✉️" },
  { type: "Pricing", label: "Pricing / Packages", desc: "Structured package tiers & deliverables", icon: "💳" },
  { type: "Testimonials", label: "Why Choose KASH", desc: "Value propositions and client stories", icon: "💬" },
  { type: "Insights Feed", label: "Insights Feed", desc: "Latest articles and tech insights", icon: "📰" },
  { type: "Spacer", label: "Spacer", desc: "Visual blank breathing room", icon: "↕️" },
  { type: "Custom Embed", label: "Custom Embed", desc: "Custom HTML, iframe, or scripts", icon: "💻" },
];

export default function PageBuilderPage() {
  const params = useParams();
  const { addToast } = useToast();
  const pageId = params.id as string;

  const [page, setPage] = useState<AdminPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"content" | "style" | "seo" | "workflow">("content");
  const [searchSection, setSearchSection] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Workflow / Review Modal & Scheduling
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [scheduleTimezone, setScheduleTimezone] = useState("Asia/Kolkata");
  const [unpublishDate, setUnpublishDate] = useState("");
  const [unpublishTime, setUnpublishTime] = useState("00:00");
  const [scheduleError, setScheduleError] = useState("");
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [changesNote, setChangesNote] = useState("");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loadError, setLoadError] = useState("");
  const [compareError, setCompareError] = useState("");
  const [savedJson, setSavedJson] = useState("");

  // Revision / History Diff Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [diffResults, setDiffResults] = useState<VersionDiff[]>([]);
  const [selectedVOld, setSelectedVOld] = useState<string>("");
  const [selectedVNew, setSelectedVNew] = useState<string>("");

  // Media Picker modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTargetField, setMediaPickerTargetField] = useState<string | null>(null);

  const loadVersions = useCallback(async () => {
    const v = await adminClient.getPageVersions(pageId);
    setVersions(v);
    if (v.length >= 2) { setSelectedVOld(v[1].versionId); setSelectedVNew(v[0].versionId); } else if (v.length === 1) { setSelectedVOld(v[0].versionId); setSelectedVNew(v[0].versionId); }
  }, [pageId]);

  useEffect(() => {
    adminClient.getPage(pageId).then((data) => {
      if (data) {
        setPage(data);
        setSavedJson(JSON.stringify(data));
        if (data.sections.length > 0) setSelectedSectionId(data.sections[0].id);
      } else setLoadError("This page could not be found, or you do not have access to it.");
    }).catch((e) => setLoadError(errorMessage(e))).finally(() => setLoading(false));
    adminClient.getSession().then(setSession).catch(() => undefined);
    adminClient.getPageVersions(pageId).then((v) => {
      setVersions(v);
      if (v.length >= 2) { setSelectedVOld(v[1].versionId); setSelectedVNew(v[0].versionId); } else if (v.length === 1) { setSelectedVOld(v[0].versionId); setSelectedVNew(v[0].versionId); }
    }).catch(() => undefined);
  }, [pageId]);

  // Side-by-side comparison from the server's structured diff.
  useEffect(() => {
    if (!historyModalOpen || !selectedVOld || !selectedVNew) return;
    let live = true;
    adminClient.compareVersions(pageId, selectedVOld, selectedVNew).then((d) => { if (live) { setDiffResults(d); setCompareError(""); } }).catch((e) => { if (live) { setDiffResults([]); setCompareError(errorMessage(e)); } });
    return () => { live = false; };
  }, [historyModalOpen, selectedVOld, selectedVNew, pageId]);

  const perms = useMemo(() => new Set(session?.user.permissions ?? []), [session]);
  const isSuper = !!session?.user.roles.includes("SUPER_ADMIN");
  // Advisory only: the server decides. Buttons simply do not offer what this user cannot do.
  const can = useCallback((...keys: string[]) => !session || isSuper || keys.some((k) => perms.has(k)), [session, isSuper, perms]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#4B5563] font-medium">Loading Page Builder...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-semibold text-red-600">{loadError || "Page not found."}</p>
        <Link href="/admin/pages" className="text-xs text-[#FF5A00] underline mt-2 inline-block">
          Return to Pages List
        </Link>
      </div>
    );
  }

  const selectedSection = page.sections.find((s) => s.id === selectedSectionId);

  // SECTION OPERATIONS
  const handleAddSection = (type: SectionType) => {
    const newSection: PageSection = {
      id: newId("sec"),
      type,
      order: page.sections.length + 1,
      enabled: true,
      content: getDefaultContentForType(type),
      style: {
        background: type === "CTA" ? "Orange" : "White",
        paddingTop: 4,
        paddingBottom: 4,
        container: "Normal",
        alignment: "Left",
        shadow: "None",
      },
    };

    const updatedSections = [...page.sections, newSection];
    setPage({ ...page, sections: updatedSections });
    setSelectedSectionId(newSection.id);
    addToast({ title: "Section added", message: `Added ${type} section to canvas` });
  };

  const handleDeleteSection = (id: string) => {
    const updated = page.sections.filter((s) => s.id !== id);
    setPage({ ...page, sections: updated });
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || null);
    }
    addToast({ title: "Section removed", message: "Section deleted from page", type: "info" });
  };

  const handleDuplicateSection = (id: string) => {
    const target = page.sections.find((s) => s.id === id);
    if (!target) return;
    const duplicated: PageSection = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId("sec"),
      order: target.order + 1,
    };
    const idx = page.sections.findIndex((s) => s.id === id);
    const updated = [...page.sections];
    updated.splice(idx + 1, 0, duplicated);
    setPage({ ...page, sections: updated });
    setSelectedSectionId(duplicated.id);
    addToast({ title: "Section duplicated", message: "Created identical copy" });
  };

  const handleToggleHide = (id: string) => {
    const updated = page.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setPage({ ...page, sections: updated });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= page.sections.length) return;
    const updated = [...page.sections];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    updated.forEach((s, i) => (s.order = i + 1));
    setPage({ ...page, sections: updated });
  };

  const handleUpdateContent = (field: string, value: unknown) => {
    if (!selectedSection) return;
    const updatedSections = page.sections.map((s) => {
      if (s.id === selectedSection.id) {
        return {
          ...s,
          content: {
            ...s.content,
            [field]: value,
          },
        };
      }
      return s;
    });
    setPage({ ...page, sections: updatedSections });
  };

  const handleUpdateStyle = (styleField: keyof SectionStyle, value: unknown) => {
    if (!selectedSection) return;
    const updatedSections = page.sections.map((s) => {
      if (s.id === selectedSection.id) {
        return {
          ...s,
          style: {
            ...s.style,
            [styleField]: value,
          },
        };
      }
      return s;
    });
    setPage({ ...page, sections: updatedSections });
  };

  const dirty = JSON.stringify(page) !== savedJson;
  const adopt = (p: AdminPageItem) => { setPage(p); setSavedJson(JSON.stringify(p)); };
  const fail = (title: string, err: unknown) => addToast({ title, message: errorMessage(err), type: "error" });

  /** Saves the working copy to the server. The live site is unchanged until publish. */
  const handleSaveDraft = async (quiet = false): Promise<AdminPageItem | null> => {
    setSaving(true);
    try {
      const saved = await adminClient.savePage(page);
      adopt(saved);
      if (!quiet) addToast({ title: "Draft saved", message: saved.status === "Draft" && page.status !== "Draft" ? "Saved. The page returned to Draft because its content changed, so it needs review again." : "Saved. The live site is unchanged until you publish.", type: "success" });
      return saved;
    } catch (err) { fail("Save failed", err); return null; } finally { setSaving(false); }
  };
  /** Runs a workflow action against the saved content: unsaved edits are saved first so reviewers see exactly what you see. */
  const workflow = async (title: string, run: () => Promise<AdminPageItem>, message: string) => {
    setSaving(true);
    try {
      if (dirty) { const saved = await adminClient.savePage(page); adopt(saved); }
      const updated = await run();
      adopt(updated);
      await loadVersions().catch(() => undefined);
      addToast({ title, message, type: "success" });
      return true;
    } catch (err) {
      fail(`${title} failed`, err);
      return false;
    } finally { setSaving(false); }
  };

  const handleSubmitReview = async () => { if (await workflow("Submitted for review", () => adminClient.submitForReview(page.id, reviewNote), "Reviewers have been notified.")) { setReviewModalOpen(false); setReviewNote(""); } };
  const handleRequestChanges = async () => { if (!changesNote.trim()) return; if (await workflow("Changes requested", () => adminClient.requestChanges(page.id, changesNote.trim()), "The author has been notified.")) { setChangesModalOpen(false); setChangesNote(""); } };
  const handleApprove = () => workflow("Page approved", () => adminClient.approvePage(page.id), "Ready to schedule or publish.");
  const handlePublishNow = () => workflow("Published", async () => { await adminClient.publishPage(page.id); return (await adminClient.getPage(page.id)) as AdminPageItem; }, "Live on the public site (it can take up to a minute to appear everywhere).");
  const handleUnpublish = () => { if (confirm("Take this page offline? Visitors will no longer see it.")) void workflow("Unpublished", async () => { await adminClient.unpublishPage(page.id); return (await adminClient.getPage(page.id)) as AdminPageItem; }, "The page is now a draft."); };
  const handleArchive = () => { if (confirm("Archive this page? It is removed from the public site.")) void workflow("Archived", () => adminClient.archivePage(page.id), "Moved to the archive."); };
  const handleUnarchive = () => workflow("Restored", () => adminClient.unarchivePage(page.id), "Back to Draft.");
  const handleCancelSchedule = () => workflow("Schedule cancelled", () => adminClient.cancelSchedule(page.id), "The page is approved but not scheduled.");
  const handleScheduleConfirm = async () => {
    setScheduleError("");
    const cfg: SchedulePublishConfig = { publishDate: scheduleDate, publishTime: scheduleTime, timezone: scheduleTimezone, ...(unpublishDate ? { unpublishDate, unpublishTime } : {}) };
    if (await workflow("Publishing scheduled", () => adminClient.schedulePublish(page.id, cfg), `Goes live ${scheduleDate} ${scheduleTime} (${scheduleTimezone}); stored as UTC.`)) setScheduleModalOpen(false);
    else setScheduleError("Could not schedule. Check the date is in the future and the unpublish time is after it.");
  };
  const handlePreview = async () => { const saved = dirty ? await handleSaveDraft(true) : page; if (saved) window.open(`/preview?page=${encodeURIComponent(saved.id)}`, "_blank", "noopener"); };
  const handleRestore = async (versionId: string) => {
    if (!confirm(`Restore version ${versionId}? It becomes the live content and is recorded as a new version.`)) return;
    try { const restored = await adminClient.restorePageVersion(page.id, Number(versionId)); adopt(restored); setSelectedSectionId(restored.sections[0]?.id ?? null); setHistoryModalOpen(false); await loadVersions(); addToast({ title: "Version restored", message: `Version ${versionId} is now live.`, type: "success" }); }
    catch (err) { fail("Restore failed", err); }
  };
  const handleDetach = async (section: PageSection) => {
    if (!section.globalBlockId || !confirm("Detach this section from its global block? It becomes an independent copy you can edit; later changes to the block will not affect it.")) return;
    try {
      if (dirty) { const saved = await adminClient.savePage(page); adopt(saved); }
      await adminClient.detachGlobalBlock(section.globalBlockId, page.id);
      const fresh = await adminClient.getPage(page.id);
      if (fresh) adopt(fresh);
      addToast({ title: "Detached", message: "This section is now independent.", type: "success" });
    } catch (err) { fail("Detach failed", err); }
  };

  const status = page.status;
  const canEditPage = can("pages.edit");
  const iAmSubmitter = !!session && page.submittedBy === (session.user.name || session.user.email);
  const canApprove = can("content.approve") && (!iAmSubmitter || isSuper);
  const canPublish = can("content.publish", "pages.publish");
  const fastTrack = (status === "Draft" || status === "Changes_Requested") && can("content.approve");
  const canPublishNow = canPublish && (status === "Approved" || fastTrack || (status === "Published" && !!(page as AdminPageItem & { hasUnpublishedChanges?: boolean }).hasUnpublishedChanges));
  const canSchedule = can("content.schedule") && (status === "Approved" || fastTrack);

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0F] overflow-hidden select-none">
      {/* 1. TOP BUILDER TOOLBAR */}
      <header className="h-14 bg-white border-b border-[#E8E5E2] px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-1.5 rounded-lg border border-[#E8E5E2] text-[#4B5563] hover:text-[#0B0B0F] hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="font-bold text-[#0B0B0F] text-sm bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#FF5A00] focus:outline-none px-1"
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  page.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : page.status === "Approved"
                    ? "bg-purple-100 text-purple-700"
                    : page.status === "In_Review"
                    ? "bg-blue-100 text-blue-700"
                    : page.status === "Changes_Requested"
                    ? "bg-red-100 text-red-700"
                    : page.status === "Scheduled"
                    ? "bg-indigo-100 text-indigo-700"
                    : page.status === "Archived"
                    ? "bg-stone-200 text-stone-600"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {page.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[11px] text-[#4B5563] px-1 font-mono">{page.slug.startsWith("/") ? page.slug : `/${page.slug}`}{dirty ? " · unsaved changes" : (page as AdminPageItem & { hasUnpublishedChanges?: boolean }).hasUnpublishedChanges ? " · unpublished changes" : ""}</p>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-[#E8E5E2]">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-md transition-colors ${
              viewport === "desktop" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563] hover:text-[#0B0B0F]"
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-md transition-colors ${
              viewport === "tablet" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563] hover:text-[#0B0B0F]"
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-md transition-colors ${
              viewport === "mobile" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563] hover:text-[#0B0B0F]"
            }`}
            title="Mobile view (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons: only what this user may do in the current state (the server enforces the rules) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0B0B0F] border border-[#E8E5E2] rounded-lg hover:bg-stone-50"
            title="Revision history, compare and restore"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0B0B0F] border border-[#E8E5E2] rounded-lg hover:bg-stone-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => setPreviewOpen(true)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] border border-[#E8E5E2] rounded-lg hover:bg-stone-50"
          >
            <span>Canvas view</span>
          </button>

          {canEditPage && status !== "Archived" && (
            <button
              onClick={() => void handleSaveDraft()}
              disabled={saving || !dirty}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-[#0B0B0F] rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving…" : "Save Draft"}</span>
            </button>
          )}

          {(status === "Draft" || status === "Changes_Requested") && can("content.submit_review") && (
            <button onClick={() => setReviewModalOpen(true)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-60">
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          )}

          {status === "In_Review" && can("content.review") && (
            <button onClick={() => setChangesModalOpen(true)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-60">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Request Changes</span>
            </button>
          )}

          {status === "In_Review" && canApprove && (
            <button onClick={handleApprove} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-60">
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}
          {status === "In_Review" && can("content.approve") && !canApprove && (
            <span className="text-[11px] text-stone-500 max-w-[150px] leading-tight" title="Four-eyes rule">You submitted this; another approver must approve it.</span>
          )}

          {canSchedule && (
            <button onClick={() => setScheduleModalOpen(true)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E8E5E2] rounded-lg text-[#4B5563] hover:bg-stone-50 disabled:opacity-60">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Schedule</span>
            </button>
          )}

          {canPublishNow && (
            <button onClick={handlePublishNow} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg shadow-sm hover:opacity-95 disabled:opacity-60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{status === "Published" ? "Publish changes" : fastTrack ? "Approve & Publish" : "Publish"}</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. THREE COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: SECTION LIBRARY & OUTLINE */}
        <aside className="w-72 bg-white border-r border-[#E8E5E2] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#E8E5E2]">
            <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider mb-2">Section Library</h4>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
              />
            </div>
          </div>

          {/* Section palette list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {AVAILABLE_SECTIONS.filter((s) => s.label.toLowerCase().includes(searchSection.toLowerCase())).map((item) => (
              <div
                key={item.type}
                onClick={() => handleAddSection(item.type)}
                className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#FFF9F4] border border-transparent hover:border-[#FF5A00]/20 cursor-pointer transition-all"
              >
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0B0B0F] group-hover:text-[#FF5A00]">
                      {item.label}
                    </span>
                    <Plus className="w-3 h-3 text-stone-400 group-hover:text-[#FF5A00]" />
                  </div>
                  <p className="text-[11px] text-[#4B5563] truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Canvas Layers Outline */}
          <div className="border-t border-[#E8E5E2] p-3 max-h-48 overflow-y-auto bg-stone-50">
            <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Page Tree ({page.sections.length})
            </h5>
            <div className="space-y-1">
              {page.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer ${
                    selectedSectionId === sec.id
                      ? "bg-[#FF5A00] text-white font-semibold"
                      : "text-stone-700 hover:bg-stone-200/60"
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span className="opacity-60 text-[10px] font-mono">{idx + 1}.</span>
                    {sec.type}
                    {sec.isGlobalBlock && <span className="text-[9px] bg-white/20 px-1 rounded">MASTER</span>}
                  </span>
                  {!sec.enabled && <EyeOff className="w-3 h-3 opacity-60" />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: VISUAL CANVAS */}
        <main className="flex-1 bg-stone-100/90 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div
            className={`transition-all duration-300 bg-white shadow-xl rounded-xl overflow-hidden min-h-screen w-full mb-12 ${
              viewport === "desktop"
                ? "max-w-5xl"
                : viewport === "tablet"
                ? "max-w-[768px]"
                : "max-w-[375px]"
            }`}
          >
            {page.sections.length === 0 ? (
              <div className="p-16 text-center text-stone-400">
                <Layout className="w-12 h-12 mx-auto mb-3 stroke-[1.5]" />
                <h3 className="font-semibold text-stone-700 text-sm">Canvas is empty</h3>
                <p className="text-xs text-stone-400 mt-1">Select any block from the left library to start building.</p>
              </div>
            ) : (
              page.sections.map((section, idx) => {
                const isSelected = selectedSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`relative group transition-all ${
                      isSelected
                        ? "ring-2 ring-[#FF5A00] ring-inset"
                        : "hover:outline hover:outline-1 hover:outline-[#FF5A00]/50"
                    } ${!section.enabled ? "opacity-40" : ""}`}
                    style={{
                      backgroundColor: getBgColor(section.style.background, section.style.customColor),
                      paddingTop: `${section.style.paddingTop}rem`,
                      paddingBottom: `${section.style.paddingBottom}rem`,
                    }}
                  >
                    {/* Floating Controls */}
                    <div
                      className={`absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#0B0B0F]/90 text-white rounded-md p-1 shadow-lg transition-opacity ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-amber-400 px-1 border-r border-stone-700">
                        {section.type}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1 hover:text-[#FF5A00] disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(idx, "down");
                        }}
                        disabled={idx === page.sections.length - 1}
                        className="p-1 hover:text-[#FF5A00] disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleHide(section.id);
                        }}
                        className="p-1 hover:text-[#FF5A00]"
                        title={section.enabled ? "Hide" : "Show"}
                      >
                        {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSection(section.id);
                        }}
                        className="p-1 hover:text-[#FF5A00]"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-1 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div
                      className={`mx-auto px-4 ${
                        section.style.container === "Full"
                          ? "w-full"
                          : section.style.container === "Wide"
                          ? "max-w-6xl"
                          : section.style.container === "Narrow"
                          ? "max-w-2xl"
                          : "max-w-4xl"
                      }`}
                    >
                      <SectionVisualPreview section={section} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: CONTROLS & INSPECTOR */}
        <aside className="w-80 bg-white border-l border-[#E8E5E2] flex flex-col shrink-0">
          <div className="flex border-b border-[#E8E5E2] bg-[#FFF9F4]">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                activeTab === "content"
                  ? "border-[#FF5A00] text-[#FF5A00] bg-white"
                  : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                activeTab === "style"
                  ? "border-[#FF5A00] text-[#FF5A00] bg-white"
                  : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                activeTab === "seo"
                  ? "border-[#FF5A00] text-[#FF5A00] bg-white"
                  : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              SEO & Schema
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                activeTab === "workflow"
                  ? "border-[#FF5A00] text-[#FF5A00] bg-white"
                  : "border-transparent text-[#4B5563] hover:text-[#0B0B0F]"
              }`}
            >
              Audit Trail
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "content" && selectedSection && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2] mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">
                      {selectedSection.type} Content
                    </h4>
                    <p className="text-[11px] text-[#4B5563]">Edit section copy and assets</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#FFF3E9] text-[#FF5A00] font-semibold">
                    {selectedSection.type}
                  </span>
                </div>

                {selectedSection.isGlobalBlock && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p><strong>Linked to global block{selectedSection.blockName ? ` “${selectedSection.blockName}”` : ""}.</strong> Its content and style come from the block and update everywhere it is used. Edit it under <Link href="/admin/design/global-blocks" className="underline font-semibold">Global Blocks</Link>, or detach it to edit this copy independently.</p>
                    <button onClick={() => void handleDetach(selectedSection)} className="px-3 py-1.5 border border-amber-300 rounded-lg font-semibold bg-white hover:bg-amber-100">Detach from block</button>
                  </div>
                )}
                <fieldset disabled={!!selectedSection.isGlobalBlock} className={selectedSection.isGlobalBlock ? "opacity-60" : ""}>
                <SectionContentFields
                  section={selectedSection}
                  onChange={handleUpdateContent}
                  onOpenMediaPicker={(field) => {
                    setMediaPickerTargetField(field);
                    setMediaPickerOpen(true);
                  }}
                />
                </fieldset>
              </div>
            )}

            {activeTab === "content" && !selectedSection && (
              <div className="text-center py-12 text-stone-400">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Select any section on the canvas to inspect its content.</p>
              </div>
            )}

            {activeTab === "style" && selectedSection && (
              <div className="space-y-4 text-xs">
                <div className="pb-3 border-b border-[#E8E5E2]">
                  <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Appearance & Spacing</h4>
                  <p className="text-[11px] text-[#4B5563]">Fine-tune layout, color, and padding</p>
                </div>

                {/* Background */}
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1.5">Background Theme</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["White", "Ivory", "Peach", "Black", "Orange", "Gradient", "Custom"] as const).map((bg) => (
                      <button
                        key={bg}
                        onClick={() => handleUpdateStyle("background", bg)}
                        className={`py-1.5 px-2 rounded border text-center font-medium transition-all ${
                          selectedSection.style.background === bg
                            ? "border-[#FF5A00] bg-[#FFF3E9] text-[#FF5A00] font-bold"
                            : "border-[#E8E5E2] text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Padding */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Top Padding (rem)</label>
                    <input
                      type="number"
                      min="0"
                      max="16"
                      step="0.5"
                      value={selectedSection.style.paddingTop}
                      onChange={(e) => handleUpdateStyle("paddingTop", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Bottom Padding (rem)</label>
                    <input
                      type="number"
                      min="0"
                      max="16"
                      step="0.5"
                      value={selectedSection.style.paddingBottom}
                      onChange={(e) => handleUpdateStyle("paddingBottom", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Container Width */}
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1.5">Container Width</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["Narrow", "Normal", "Wide", "Full"] as const).map((width) => (
                      <button
                        key={width}
                        onClick={() => handleUpdateStyle("container", width)}
                        className={`py-1.5 rounded border text-center font-medium transition-all ${
                          selectedSection.style.container === width
                            ? "border-[#FF5A00] bg-[#FFF3E9] text-[#FF5A00] font-bold"
                            : "border-[#E8E5E2] text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {width}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1.5">Text Alignment</label>
                  <div className="flex rounded-lg border border-[#E8E5E2] overflow-hidden">
                    {(["Left", "Center", "Right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => handleUpdateStyle("alignment", align)}
                        className={`flex-1 py-1.5 text-center font-medium transition-all ${
                          selectedSection.style.alignment === align
                            ? "bg-[#FF5A00] text-white font-bold"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-4 text-xs">
                <div className="pb-3 border-b border-[#E8E5E2]">
                  <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">SEO, Intent & Schema</h4>
                  <p className="text-[11px] text-[#4B5563]">Search optimization, schema markup and SERP preview</p>
                </div>

                {/* Google Snippet Live Preview */}
                <div className="p-3 bg-[#FFF9F4] rounded-xl border border-[#E8E5E2]">
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1.5 flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    <span>Google Search Preview</span>
                  </p>
                  <p className="text-xs text-[#1a0dab] font-medium truncate hover:underline cursor-pointer">
                    {page.seo.title || page.title} | KASH Technology
                  </p>
                  <p className="text-[11px] text-[#006621] truncate font-mono">
                    https://kash-technology.com/{page.slug}
                  </p>
                  <p className="text-[11px] text-[#545454] line-clamp-2 mt-0.5">
                    {page.seo.metaDescription || "Full-service digital and technology agency helping businesses Build, Create and Grow."}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Page Title Tag</label>
                  <input
                    type="text"
                    value={page.seo.title}
                    onChange={(e) => setPage({ ...page, seo: { ...page.seo, title: e.target.value } })}
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">{page.seo.title.length}/60 recommended chars</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={page.seo.metaDescription}
                    onChange={(e) => setPage({ ...page, seo: { ...page.seo, metaDescription: e.target.value } })}
                    className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">{page.seo.metaDescription.length}/160 recommended chars</p>
                </div>

                {/* Phase 2 SEO Content Editor Enhancements */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Primary Keyword</label>
                    <input
                      type="text"
                      value={page.seo.focusKeyword}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, focusKeyword: e.target.value } })}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Search Intent</label>
                    <select
                      value={page.seo.searchIntent || "Commercial"}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, searchIntent: e.target.value as NonNullable<AdminPageItem["seo"]["searchIntent"]> } })}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs bg-white"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Transactional">Transactional</option>
                      <option value="Informational">Informational</option>
                      <option value="Navigational">Navigational</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Target Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Noida, Delhi NCR"
                      value={page.seo.targetLocation || ""}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, targetLocation: e.target.value } })}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0B0B0F] mb-1">Schema.org Type</label>
                    <select
                      value={page.seo.schemaType || "WebPage"}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, schemaType: e.target.value as SchemaType } })}
                      className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs bg-white"
                    >
                      <option value="WebPage">WebPage</option>
                      <option value="Service">Service</option>
                      <option value="Article">Article</option>
                      <option value="FAQ">FAQ</option>
                      <option value="LocalBusiness">LocalBusiness (Verified)</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={page.seo.index}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, index: e.target.checked } })}
                      className="rounded border-[#E8E5E2] text-[#FF5A00] focus:ring-[#FF5A00]"
                    />
                    <span className="font-semibold text-[#0B0B0F]">Index Page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={page.seo.follow}
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, follow: e.target.checked } })}
                      className="rounded border-[#E8E5E2] text-[#FF5A00] focus:ring-[#FF5A00]"
                    />
                    <span className="font-semibold text-[#0B0B0F]">Follow Links</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "workflow" && (
              <div className="space-y-4 text-xs">
                <div className="pb-3 border-b border-[#E8E5E2]">
                  <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Review & Approval</h4>
                  <p className="text-[11px] text-[#4B5563]">Who did what, and when. Editing approved or scheduled content returns it to Draft.</p>
                </div>

                <div className="p-3 rounded-xl border border-[#E8E5E2] bg-stone-50 space-y-1">
                  <p><span className="text-stone-400">Status:</span> <strong>{status.replace("_", " ")}</strong></p>
                  {page.submittedBy && <p><span className="text-stone-400">Submitted by:</span> {page.submittedBy}{page.submittedAt ? ` · ${new Date(page.submittedAt).toLocaleString()}` : ""}</p>}
                  {page.assignedReviewer && <p><span className="text-stone-400">Last reviewed by:</span> {page.assignedReviewer}</p>}
                  {page.reviewNotes && <p className="pt-1"><span className="text-stone-400 block">Latest note</span>{page.reviewNotes}</p>}
                  {typeof page.versionNumber === "number" && <p><span className="text-stone-400">Version:</span> v{page.versionNumber}</p>}
                </div>

                {page.schedule && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-950">
                    <div className="flex items-center gap-1.5 font-bold"><Clock className="w-3.5 h-3.5 text-blue-600" /><span>{status === "Scheduled" ? "Scheduled publication" : "Scheduled takedown"}</span></div>
                    {page.schedule.publishDate && <p className="text-[11px]">Goes live <strong>{page.schedule.publishDate}</strong> at <strong>{page.schedule.publishTime}</strong> ({page.schedule.timezone}).</p>}
                    {page.schedule.unpublishDate && <p className="text-[11px]">Goes offline <strong>{page.schedule.unpublishDate}</strong> at <strong>{page.schedule.unpublishTime}</strong> ({page.schedule.timezone}).</p>}
                    {page.schedule.publishAtUtc && <p className="text-[10px] font-mono text-blue-800/70">UTC: {page.schedule.publishAtUtc}</p>}
                    {can("content.schedule") && <button onClick={handleCancelSchedule} disabled={saving} className="text-[11px] font-semibold text-red-600 hover:underline pt-1 block">Cancel schedule</button>}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {status === "Published" && canPublish && <button onClick={handleUnpublish} disabled={saving} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50">Unpublish</button>}
                  {status !== "Archived" && status !== "Draft" && can("content.approve", "content.publish", "pages.publish") && <button onClick={handleArchive} disabled={saving} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50">Archive</button>}
                  {status === "Draft" && can("content.approve", "content.publish", "pages.publish") && <button onClick={handleArchive} disabled={saving} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50">Archive</button>}
                  {status === "Archived" && can("content.approve", "content.publish", "pages.publish") && <button onClick={handleUnarchive} disabled={saving} className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-semibold hover:bg-stone-50">Restore to Draft</button>}
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Activity</span>
                  {!(page.reviewHistory?.length) && <p className="text-stone-400">No review activity yet.</p>}
                  {page.reviewHistory?.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-[#E8E5E2] bg-stone-50 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0B0B0F]">{item.action.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</span>
                        <span className="text-stone-400 font-mono text-[10px]">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-stone-500">{item.actor}{item.role ? ` · ${item.role}` : ""}</p>
                      {item.note && <p className="text-[11px] text-stone-700">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* SCHEDULE MODAL */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">Schedule Page Publication</h3>
            <p className="text-xs text-[#4B5563]">
              The page goes live automatically at this time (checked every minute) and can optionally be taken offline later.
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Publish Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Take offline on (optional)</label>
                  <input type="date" value={unpublishDate} onChange={(e) => setUnpublishDate(e.target.value)} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Offline time</label>
                  <input type="time" value={unpublishTime} onChange={(e) => setUnpublishTime(e.target.value)} disabled={!unpublishDate} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg disabled:opacity-50" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Timezone of the times above</label>
                <select
                  value={scheduleTimezone}
                  onChange={(e) => setScheduleTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
                <p className="mt-1 text-[11px] text-stone-500">The server stores the exact moment in UTC, so the schedule does not depend on this browser or the server clock zone.</p>
              </div>
              {scheduleError && <p role="alert" className="text-red-600">{scheduleError}</p>}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-[#4B5563] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScheduleConfirm}
                  className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-semibold hover:bg-[#e04f00]"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {changesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">Request changes</h3>
            <p className="text-xs text-[#4B5563]">Explain what needs to change. The author is notified and the page returns to them.</p>
            <textarea rows={4} autoFocus value={changesNote} onChange={(e) => setChangesNote(e.target.value)} placeholder="What should be changed?" className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs" />
            <div className="flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setChangesModalOpen(false)} className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-[#4B5563] font-semibold">Cancel</button>
              <button type="button" disabled={!changesNote.trim() || saving} onClick={handleRequestChanges} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">Send back</button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW SUBMIT MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">Submit for Editorial Review</h3>
            <p className="text-xs text-[#4B5563]">
              Send this draft to the content and SEO managers. Provide context or highlight changes made.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Review Notes & Summary</label>
                <textarea
                  rows={4}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Updated services list and added qualitative trust points per brand standards."
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-[#4B5563] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVISION HISTORY, COMPARE & RESTORE */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8E5E2]">
            <div className="p-4 border-b border-[#E8E5E2] bg-[#FFF9F4] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0B0B0F] flex items-center gap-2"><GitCompare className="w-4 h-4 text-[#FF5A00]" /><span>Revision history & compare</span></h3>
                <p className="text-xs text-[#4B5563]">Pick two versions to see what was added, removed or changed in metadata, SEO, sections, content, style and order.</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} aria-label="Close" className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>
            {versions.length === 0 ? <p className="p-8 text-xs text-stone-500 text-center">No versions yet. A version is recorded each time the page is published, restored or created.</p> : (<>
              <div className="p-4 border-b border-[#E8E5E2] flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2"><span className="font-semibold text-stone-600">From</span>
                  <select value={selectedVOld} onChange={(e) => setSelectedVOld(e.target.value)} className="px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white font-mono">{versions.map((v) => <option key={v.versionId} value={v.versionId}>v{v.versionNumber} · {new Date(v.createdAt).toLocaleString()} · {v.changeSummary}</option>)}</select></label>
                <label className="flex items-center gap-2"><span className="font-semibold text-stone-600">To</span>
                  <select value={selectedVNew} onChange={(e) => setSelectedVNew(e.target.value)} className="px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white font-mono">{versions.map((v) => <option key={v.versionId} value={v.versionId}>v{v.versionNumber} · {new Date(v.createdAt).toLocaleString()} · {v.changeSummary}</option>)}</select></label>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {compareError && <p role="alert" className="text-red-600">{compareError}</p>}
                {!compareError && diffResults.length === 0 && <p className="text-stone-500">{selectedVOld === selectedVNew ? "Choose two different versions to compare." : "These versions are identical."}</p>}
                {(["metadata", "seo", "section", "content", "style", "order"] as const).map((area) => {
                  const rows = diffResults.filter((d) => d.area === area);
                  if (!rows.length) return null;
                  const title = { metadata: "Page details", seo: "SEO", section: "Sections added / removed / toggled", content: "Section content", style: "Section style", order: "Section order" }[area];
                  return (
                    <div key={area} className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[11px]">{title} ({rows.length})</h4>
                      {rows.map((d, i) => (
                        <div key={i} className="p-3 rounded-xl border border-[#E8E5E2] bg-stone-50 space-y-2">
                          <div className="flex items-center justify-between gap-2"><span className="font-bold text-[#0B0B0F]">{d.entity}{d.field ? <span className="font-mono font-normal text-stone-500"> · {d.field}</span> : null}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${d.category === "Changed" ? "bg-amber-100 text-amber-800" : d.category === "Added" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{d.category}</span></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 rounded bg-red-50/60 border border-red-200"><span className="text-[10px] uppercase font-bold text-red-700 block mb-1">Before</span><p className="text-stone-700 font-mono text-[11px] break-words whitespace-pre-wrap">{fmtVal(d.oldValue)}</p></div>
                            <div className="p-2.5 rounded bg-green-50/60 border border-green-200"><span className="text-[10px] uppercase font-bold text-green-700 block mb-1">After</span><p className="text-stone-700 font-mono text-[11px] break-words whitespace-pre-wrap">{fmtVal(d.newValue)}</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-[#E8E5E2] flex items-center justify-between bg-stone-50 text-xs">
                <span className="text-stone-400">Comparing is read-only. Restoring replaces the live page with the “From” version and records a new version.</span>
                {canPublish && selectedVOld && (
                  <button onClick={() => void handleRestore(selectedVOld)} disabled={saving} className="px-4 py-2 border border-[#E8E5E2] font-semibold rounded-lg bg-white hover:bg-stone-100 flex items-center gap-1.5 disabled:opacity-60"><RotateCcw className="w-3.5 h-3.5" /><span>Restore v{selectedVOld}</span></button>
                )}
              </div>
            </>)}
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          if (mediaPickerTargetField) {
            handleUpdateContent(mediaPickerTargetField, media.url);
          }
        }}
      />

      {/* Full Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
          <div className="h-12 bg-[#0B0B0F] px-4 flex items-center justify-between border-b border-stone-800 text-white">
            <span className="text-xs font-semibold">Live Preview: {page.title}</span>
            <button
              onClick={() => setPreviewOpen(false)}
              className="p-1 rounded text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            {page.sections.filter((s) => s.enabled).map((sec) => (
              <div
                key={sec.id}
                style={{
                  backgroundColor: getBgColor(sec.style.background, sec.style.customColor),
                  paddingTop: `${sec.style.paddingTop}rem`,
                  paddingBottom: `${sec.style.paddingBottom}rem`,
                }}
              >
                <div className="max-w-6xl mx-auto px-4">
                  <SectionVisualPreview section={sec} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENTS & HELPERS
// -------------------------------------------------------------

function fmtVal(v: unknown): string {
  if (v === undefined || v === null || v === "") return "(empty)";
  return typeof v === "string" ? v : JSON.stringify(v, null, 2);
}

function getBgColor(bg: SectionStyle["background"], custom?: string): string {
  switch (bg) {
    case "White":
      return "#FFFFFF";
    case "Ivory":
      return "#FFF9F4";
    case "Peach":
      return "#FFF3E9";
    case "Black":
      return "#0B0B0F";
    case "Orange":
      return "#FF5A00";
    case "Gradient":
      return "linear-gradient(135deg, #FF5A00 0%, #FF8A3D 100%)";
    case "Custom":
      return custom || "#FFFFFF";
    default:
      return "#FFFFFF";
  }
}

function getDefaultContentForType(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "Hero":
      return {
        badge: "One Digital Partner for Your Business",
        heading: "Build. Create. Grow.",
        highlightText: "with KASH Technology",
        description: "Websites, software, content, social media and digital marketing under one roof.",
        primaryCta: "Get a Free Digital Audit",
        secondaryCta: "See Our Work",
        heroImage: "/images/hero/hero-laptop-composition.png",
      };
    case "Rich Text":
      return {
        title: "Section Heading",
        body: "<p>KASH Technology brings together full-service digital design, engineering and scalable growth services.</p>",
      };
    case "CTA":
      return {
        heading: "Ready to Build, Create and Grow Your Business?",
        subheading: "Let's discuss your goals and create a digital plan that actually works for your business.",
        buttonText: "Start Your Project",
        buttonUrl: "/contact",
      };
    case "Services Grid":
      return {
        label: "Our Services",
        heading: "End-to-End Digital Solutions",
        description: "From building your online presence to scaling systems.",
      };
    case "FAQ":
      return {
        heading: "Frequently Asked Questions",
        faqs: [
          { question: "How long does a website project take?", answer: "Typical projects range between 2 to 4 weeks depending on scope." },
          { question: "Do you offer post-launch support?", answer: "Yes, we provide ongoing maintenance and technical enhancements." },
        ],
      };
    default:
      return {
        heading: `${type} Section`,
        description: "Configure this section in the right controls inspector.",
      };
  }
}

function SectionVisualPreview({ section }: { section: PageSection }) {
  const content = section.content;

  switch (section.type) {
    case "Hero":
      return (
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF3E9] text-[#FF5A00]">
              {(content.badge as string) || "One Digital Partner"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0F] tracking-tight leading-tight">
              {content.heading as string}{" "}
              <span className="text-[#FF5A00]">{content.highlightText as string}</span>
            </h1>
            <p className="text-sm text-[#4B5563] max-w-lg leading-relaxed">
              {content.description as string}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-4 py-2 bg-[#FF5A00] text-white text-xs font-semibold rounded-lg shadow-sm">
                {(content.primaryCta as string) || "Get Started"}
              </span>
              <span className="px-4 py-2 border border-[#E8E5E2] text-[#0B0B0F] text-xs font-semibold rounded-lg bg-white">
                {(content.secondaryCta as string) || "Our Work"}
              </span>
            </div>
          </div>
          <div className="w-full md:w-5/12 aspect-[4/3] relative rounded-xl overflow-hidden bg-stone-100 border border-[#E8E5E2]">
            {content.heroImage ? (
              <Image
                src={content.heroImage as string}
                alt="Hero visual"
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                Hero Image Mockup
              </div>
            )}
          </div>
        </div>
      );

    case "CTA":
      return (
        <div className="py-8 text-center text-white space-y-3">
          <h2 className="text-2xl font-bold">{content.heading as string}</h2>
          <p className="text-xs text-white/90 max-w-xl mx-auto">{content.subheading as string}</p>
          <div className="pt-2">
            <span className="inline-block px-6 py-2.5 bg-white text-[#FF5A00] font-bold text-xs rounded-lg shadow-md">
              {(content.buttonText as string) || "Contact Us"}
            </span>
          </div>
        </div>
      );

    case "Services Grid":
      return (
        <div className="py-6 space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#FF5A00] uppercase tracking-wider">{content.label as string}</span>
            <h2 className="text-2xl font-bold text-[#0B0B0F] mt-1">{content.heading as string}</h2>
            <p className="text-xs text-[#4B5563] mt-1">{content.description as string}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {["Website Development", "Software & CRM", "Mobile App Development", "Creative & Branding", "Digital Marketing", "Business Automation"].map((s) => (
              <div key={s} className="p-4 rounded-xl border border-[#E8E5E2] bg-white shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E9] text-[#FF5A00] flex items-center justify-center font-bold text-xs mb-2">
                  ✦
                </div>
                <h4 className="font-bold text-xs text-[#0B0B0F]">{s}</h4>
                <p className="text-[11px] text-[#4B5563] mt-1">High-performance scalable architecture built for growth.</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "Rich Text":
      return (
        <div className="py-6 max-w-3xl mx-auto">
          {Boolean(content.title) && <h2 className="text-2xl font-bold text-[#0B0B0F] mb-3">{content.title as string}</h2>}
          <div
            className="prose prose-sm text-[#4B5563]"
            dangerouslySetInnerHTML={{ __html: (content.body as string) || "<p>Rich text preview...</p>" }}
          />
        </div>
      );

    default:
      return (
        <div className="py-8 text-center border border-dashed border-stone-300 rounded-xl bg-stone-50/50">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {section.type} Block
          </span>
          <h3 className="text-sm font-bold text-[#0B0B0F] mt-1">{(content.heading as string) || section.type}</h3>
          <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
            {(content.description as string) || "Visual preview placeholder for this section block."}
          </p>
        </div>
      );
  }
}

function SectionContentFields({
  section,
  onChange,
  onOpenMediaPicker,
}: {
  section: PageSection;
  onChange: (field: string, val: unknown) => void;
  onOpenMediaPicker: (field: string) => void;
}) {
  const c = section.content;

  if (section.type === "Hero") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Badge Text</label>
          <input
            type="text"
            value={(c.badge as string) || ""}
            onChange={(e) => onChange("badge", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Headline</label>
          <input
            type="text"
            value={(c.heading as string) || ""}
            onChange={(e) => onChange("heading", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-bold"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#FF5A00] mb-1">Highlighted Orange Text</label>
          <input
            type="text"
            value={(c.highlightText as string) || ""}
            onChange={(e) => onChange("highlightText", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#FF5A00]/50 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Supporting Paragraph</label>
          <textarea
            rows={3}
            value={(c.description as string) || ""}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Primary CTA</label>
            <input
              type="text"
              value={(c.primaryCta as string) || ""}
              onChange={(e) => onChange("primaryCta", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Secondary CTA</label>
            <input
              type="text"
              value={(c.secondaryCta as string) || ""}
              onChange={(e) => onChange("secondaryCta", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Hero Mockup Asset</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={(c.heroImage as string) || ""}
              onChange={(e) => onChange("heroImage", e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#E8E5E2] rounded-lg font-mono text-[11px]"
            />
            <button
              onClick={() => onOpenMediaPicker("heroImage")}
              className="px-3 py-1.5 bg-[#FFF3E9] text-[#FF5A00] font-semibold rounded-lg hover:bg-[#FF5A00] hover:text-white transition-colors"
            >
              Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "CTA") {
    return (
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Banner Heading</label>
          <input
            type="text"
            value={(c.heading as string) || ""}
            onChange={(e) => onChange("heading", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-bold"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#0B0B0F] mb-1">Subheading</label>
          <textarea
            rows={2}
            value={(c.subheading as string) || ""}
            onChange={(e) => onChange("subheading", e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Button Text</label>
            <input
              type="text"
              value={(c.buttonText as string) || ""}
              onChange={(e) => onChange("buttonText", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#0B0B0F] mb-1">Button Link</label>
            <input
              type="text"
              value={(c.buttonUrl as string) || ""}
              onChange={(e) => onChange("buttonUrl", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-mono"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "Built-in Page") {
    return (
      <p className="text-xs text-stone-600 leading-relaxed bg-[#FFF9F4] border border-[#E8E5E2] rounded-lg p-3">
        This block is the approved, hand-built page for this route. It can be moved, hidden or surrounded by new sections, and the page&apos;s SEO below applies to it. Its own text is edited in code.
      </p>
    );
  }

  const itemCfg = ITEM_CONFIG[section.type];
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block font-semibold text-[#0B0B0F] mb-1">Section Heading</label>
        <input
          type="text"
          value={(c.heading as string) || (c.title as string) || ""}
          onChange={(e) => onChange("heading", e.target.value)}
          className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="block font-semibold text-[#0B0B0F] mb-1">Body / Description</label>
        <textarea
          rows={5}
          value={(c.body as string) || (c.description as string) || ""}
          onChange={(e) => onChange(section.type === "Rich Text" ? "body" : "description", e.target.value)}
          className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
        />
      </div>
      {itemCfg && <ItemsEditor cfg={itemCfg} items={(Array.isArray(c[itemCfg.key]) ? c[itemCfg.key] : []) as Record<string, string>[]} onChange={(v) => onChange(itemCfg.key, v)} />}
    </div>
  );
}

const ITEM_CONFIG: Partial<Record<SectionType, { key: string; label: string; fields: { name: string; label: string }[] }>> = {
  FAQ: { key: "faqs", label: "Questions", fields: [{ name: "question", label: "Question" }, { name: "answer", label: "Answer" }] },
  "Services Grid": { key: "items", label: "Service cards", fields: [{ name: "title", label: "Title" }, { name: "description", label: "Description" }, { name: "href", label: "Link (optional)" }] },
  Process: { key: "steps", label: "Steps", fields: [{ name: "title", label: "Title" }, { name: "description", label: "Description" }] },
  Stats: { key: "items", label: "Stats", fields: [{ name: "value", label: "Value" }, { name: "label", label: "Label" }] },
  Testimonials: { key: "items", label: "Quotes", fields: [{ name: "quote", label: "Quote" }, { name: "name", label: "Name" }, { name: "role", label: "Role / company" }] },
  "Contact Form": { key: "__none", label: "", fields: [] },
};

function ItemsEditor({ cfg, items, onChange }: { cfg: { key: string; label: string; fields: { name: string; label: string }[] }; items: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void }) {
  if (!cfg.fields.length) return null;
  const set = (i: number, name: string, value: string) => onChange(items.map((it, idx) => (idx === i ? { ...it, [name]: value } : it)));
  return (
    <div className="space-y-2 pt-2 border-t border-[#E8E5E2]">
      <div className="flex items-center justify-between"><span className="font-semibold text-[#0B0B0F]">{cfg.label}</span>
        <button type="button" onClick={() => onChange([...items, {}])} className="text-[#FF5A00] font-semibold">+ Add</button></div>
      {items.map((it, i) => (
        <div key={i} className="p-2 border border-[#E8E5E2] rounded-lg space-y-1.5 bg-stone-50">
          {cfg.fields.map((f) => (
            <input key={f.name} type="text" placeholder={f.label} value={it[f.name] ?? ""} onChange={(e) => set(i, f.name, e.target.value)} className="w-full px-2 py-1 border border-[#E8E5E2] rounded text-xs bg-white" />
          ))}
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-[11px] text-red-600">Remove</button>
        </div>
      ))}
    </div>
  );
}
