/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
} from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
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
  Sparkles,
  Search,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Palette,
  Layout,
  ExternalLink,
  HelpCircle,
  FileText,
  X,
  Code,
  Calendar,
  Clock,
  Send,
  Check,
  AlertCircle,
  History,
  GitCompare,
  RotateCcw,
  Shield,
  Layers,
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
  const router = useRouter();
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
  const [scheduleDate, setScheduleDate] = useState("2026-11-25");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [scheduleTimezone, setScheduleTimezone] = useState("Asia/Kolkata");

  // Revision / History Diff Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [diffResults, setDiffResults] = useState<VersionDiff[]>([]);
  const [selectedVOld, setSelectedVOld] = useState<string>("v12");
  const [selectedVNew, setSelectedVNew] = useState<string>("v13");

  // Media Picker modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTargetField, setMediaPickerTargetField] = useState<string | null>(null);

  useEffect(() => {
    adminClient.getPage(pageId).then((data) => {
      if (data) {
        setPage(data);
        if (data.sections.length > 0) {
          setSelectedSectionId(data.sections[0].id);
        }
      }
      setLoading(false);
    });
    adminClient.getPageVersions(pageId).then((v) => {
      setVersions(v);
      if (v.length >= 2) {
        adminClient.compareVersions(pageId, v[1].versionId, v[0].versionId).then(setDiffResults);
      }
    });
  }, [pageId]);

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
        <p className="text-base font-semibold text-red-600">Page not found.</p>
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
      id: `sec-${Date.now()}`,
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
      id: `sec-${Date.now()}`,
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

  const handleSaveDraft = async () => {
    setSaving(true);
    await adminClient.savePage(page);
    setSaving(false);
    addToast({ title: "Draft Saved", message: "All page changes saved to memory.", type: "success" });
  };

  const handleSubmitReview = async () => {
    setSaving(true);
    const updated = await adminClient.submitForReview(page.id, reviewNote);
    if (updated) setPage(updated);
    setSaving(false);
    setReviewModalOpen(false);
    addToast({ title: "Submitted for Review", message: "Editorial team notified for review.", type: "success" });
  };

  const handleApprove = async () => {
    setSaving(true);
    const updated = await adminClient.approvePage(page.id, "Approved by Tech Lead.");
    if (updated) setPage(updated);
    setSaving(false);
    addToast({ title: "Page Approved", message: "Ready for scheduling or instant publish.", type: "success" });
  };

  const handleScheduleConfirm = async () => {
    setSaving(true);
    const cfg: SchedulePublishConfig = {
      publishDate: scheduleDate,
      publishTime: scheduleTime,
      timezone: scheduleTimezone,
    };
    const updated = await adminClient.schedulePublish(page.id, cfg);
    if (updated) setPage(updated);
    setSaving(false);
    setScheduleModalOpen(false);
    addToast({
      title: "Publishing Scheduled",
      message: `Scheduled for ${scheduleDate} at ${scheduleTime} (${scheduleTimezone}).`,
      type: "success",
    });
  };

  const handlePublishNow = async () => {
    setSaving(true);
    const updated = { ...page, status: "Published" as const };
    await adminClient.savePage(updated);
    setPage(updated);
    setSaving(false);
    addToast({ title: "Page Published", message: "Page is live in the CMS repository.", type: "success" });
  };

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
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {page.status}
              </span>
            </div>
            <p className="text-[11px] text-[#4B5563] px-1 font-mono">/{page.slug}</p>
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

        {/* Action buttons with Approval & Scheduling & Diff */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0B0B0F] border border-[#E8E5E2] rounded-lg hover:bg-stone-50"
            title="Revision History & Diff"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diff</span>
          </button>

          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0B0B0F] border border-[#E8E5E2] rounded-lg hover:bg-stone-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-[#0B0B0F] rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* WORKFLOW DROPDOWN / ACTIONS */}
          {page.status === "Draft" || page.status === "Changes_Requested" ? (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          ) : page.status === "In_Review" ? (
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Version</span>
            </button>
          ) : null}

          <button
            onClick={() => setScheduleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E8E5E2] rounded-lg text-[#4B5563] hover:bg-stone-50"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Schedule</span>
          </button>

          <button
            onClick={handlePublishNow}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg shadow-sm hover:opacity-95 transition-opacity"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
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
        <main className="flex-1 bg-[#1A1A22] overflow-y-auto p-6 flex flex-col items-center justify-start">
          <div
            className={`transition-all duration-300 bg-white shadow-2xl rounded-lg overflow-hidden min-h-[90vh] my-auto ${
              viewport === "desktop"
                ? "w-full max-w-5xl"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
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

                <SectionContentFields
                  section={selectedSection}
                  onChange={handleUpdateContent}
                  onOpenMediaPicker={(field) => {
                    setMediaPickerTargetField(field);
                    setMediaPickerOpen(true);
                  }}
                />
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
                      onChange={(e) => setPage({ ...page, seo: { ...page.seo, searchIntent: e.target.value as any } })}
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
                  <h4 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Editorial Review & Audit Trail</h4>
                  <p className="text-[11px] text-[#4B5563]">Approval workflow history and reviewer signatures</p>
                </div>

                {page.schedule && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-950">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Scheduled Publication</span>
                    </div>
                    <p className="text-[11px]">
                      Going live on <strong>{page.schedule.publishDate}</strong> at <strong>{page.schedule.publishTime}</strong> ({page.schedule.timezone}).
                    </p>
                    <button
                      onClick={async () => {
                        const updated = await adminClient.cancelSchedule(page.id);
                        if (updated) setPage(updated);
                        addToast({ title: "Schedule Cancelled", message: "Page reverted to draft status." });
                      }}
                      className="text-[11px] font-semibold text-red-600 hover:underline pt-1 block"
                    >
                      Cancel Publication Schedule
                    </button>
                  </div>
                )}

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Activity Log</span>
                  {(page.reviewHistory || [
                    { id: "1", actor: "Daksh Singh", role: "Super Admin", action: "SUBMITTED", note: "Initial content structure populated", timestamp: "Today" },
                  ]).map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-[#E8E5E2] bg-stone-50 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0B0B0F]">{item.actor}</span>
                        <span className="text-stone-400 font-mono text-[10px]">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-stone-600">{item.note}</p>
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
              Set the future date and time for automatic deployment to production.
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

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Display Timezone</label>
                <select
                  value={scheduleTimezone}
                  onChange={(e) => setScheduleTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>

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

      {/* REVISION COMPARISON / DIFF MODAL */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8E5E2]">
            <div className="p-4 border-b border-[#E8E5E2] bg-[#FFF9F4] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0B0B0F] flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-[#FF5A00]" />
                  <span>Revision History & Side-by-Side Diff</span>
                </h3>
                <p className="text-xs text-[#4B5563]">Compare historical snapshots before restoring or approving</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-[#E8E5E2] flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">Comparing Base:</span>
                <select
                  value={selectedVOld}
                  onChange={(e) => setSelectedVOld(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white font-mono"
                >
                  {versions.map((v) => (
                    <option key={v.versionId} value={v.versionId}>
                      v{v.versionNumber} ({v.createdAt})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">Compare With:</span>
                <select
                  value={selectedVNew}
                  onChange={(e) => setSelectedVNew(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white font-mono"
                >
                  {versions.map((v) => (
                    <option key={v.versionId} value={v.versionId}>
                      v{v.versionNumber} ({v.createdAt})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[11px]">
                  Detected Differences ({diffResults.length})
                </h4>
                {diffResults.map((diff, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#E8E5E2] bg-stone-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0B0B0F]">{diff.entity}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          diff.category === "Changed"
                            ? "bg-amber-100 text-amber-800"
                            : diff.category === "Added"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {diff.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded bg-red-50/60 border border-red-200">
                        <span className="text-[10px] uppercase font-bold text-red-700 block mb-1">Previous</span>
                        <p className="text-stone-700 font-mono text-[11px]">{String(diff.oldValue || "(None)")}</p>
                      </div>
                      <div className="p-2.5 rounded bg-green-50/60 border border-green-200">
                        <span className="text-[10px] uppercase font-bold text-green-700 block mb-1">Current</span>
                        <p className="text-stone-700 font-mono text-[11px]">{String(diff.newValue || "(None)")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E5E2] flex items-center justify-between bg-stone-50">
              <span className="text-xs text-stone-400">Non-destructive comparison client preview</span>
              <button
                onClick={() => {
                  setHistoryModalOpen(false);
                  addToast({ title: "Version Restored", message: "Mock restore applied to canvas." });
                }}
                className="px-4 py-2 border border-[#E8E5E2] text-xs font-semibold rounded-lg bg-white hover:bg-stone-100 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Selected Snapshot</span>
              </button>
            </div>
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
    </div>
  );
}
