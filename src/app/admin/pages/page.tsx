"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Copy, 
  Trash2, 
  FileText,
} from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminPageItem } from "@/lib/admin-client/types";
import { useToast } from "@/components/admin/ToastContext";
import { 
  AdminPage, 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  EmptyState,
  Modal,
  Skeleton 
} from "@/components/admin/ui";

const TEMPLATE_PRESETS = [
  { id: "blank", title: "Blank Page", desc: "Start fresh with a clean canvas", slug: "new-page" },
  { id: "service", title: "Service Page", desc: "Hero, service overview, features, case study & CTA", slug: "service" },
  { id: "landing", title: "Landing Page", desc: "High-conversion lead capture and product showcase", slug: "landing" },
  { id: "location", title: "Location Page", desc: "Regional service page with localized authority content", slug: "location" },
  { id: "contact", title: "Contact Page", desc: "Hero, enquiry form, contact details & map", slug: "contact" },
  { id: "about", title: "About Page", desc: "Company mission, leadership, timeline & credentials", slug: "about" },
];

export default function AdminPagesListPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("blank");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    adminClient
      .getPages()
      .then((data) => {
        if (!alive) return;
        setPages(data);
      })
      .catch((err) => {
        if (!alive) return;
        addToast({ title: "Failed to load pages", message: errorMessage(err), type: "error" });
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [addToast]);

  const loadPages = async () => {
    try {
      setPages(await adminClient.getPages());
    } catch (err) {
      addToast({ title: "Failed to load pages", message: errorMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setNewPageTitle("");
    setNewPageSlug("");
    setSelectedPreset("blank");
    setCreateModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setNewPageTitle(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setNewPageSlug(autoSlug);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) return;

    setCreateBusy(true);
    try {
      const page = await adminClient.createPage(
        newPageTitle.trim(),
        newPageSlug.trim().replace(/^\//, "")
      );
      setCreateModalOpen(false);
      router.push(`/admin/pages/${page.id}/edit`);
    } catch (err) {
      addToast({ title: "Could not create page", message: errorMessage(err), type: "error" });
    } finally {
      setCreateBusy(false);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dup = await adminClient.duplicatePage(id);
      if (dup) {
        addToast({ title: "Page duplicated", message: `Created "${dup.title}" as draft.`, type: "success" });
        loadPages();
      }
    } catch (err) {
      addToast({ title: "Duplicate failed", message: errorMessage(err), type: "error" });
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminClient.deletePage(id);
        addToast({ title: "Page deleted", message: `"${title}" has been removed.`, type: "info" });
        loadPages();
      } catch (err) {
        addToast({ title: "Delete failed", message: errorMessage(err), type: "error" });
      }
    }
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminPage maxWidth="default">
      <PageHeader
        title="Pages"
        description="Design, edit, and publish your website pages with the visual block builder."
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleOpenCreateModal}
          >
            Create Page
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Published", "Draft", "In_Review", "Scheduled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === s
                  ? "bg-white text-stone-900 border border-stone-200 shadow-2xs font-semibold"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00] shadow-2xs"
          />
        </div>
      </div>

      {/* Pages Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : filteredPages.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No pages found"
            description={
              search
                ? `No pages matching "${search}". Try clearing your search.`
                : "Get started by creating your first website page."
            }
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleOpenCreateModal}
              >
                Create Page
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
                <tr>
                  <th className="p-3.5 pl-5">Page</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Updated</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    onClick={() => router.push(`/admin/pages/${page.id}/edit`)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 pl-5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-stone-900 group-hover:text-[#FF5A00] transition-colors text-sm">
                          {page.title}
                        </span>
                        <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
                          <span>/{page.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <StatusBadge
                        variant={
                          page.status === "Published"
                            ? "success"
                            : page.status === "In_Review"
                            ? "warning"
                            : page.status === "Scheduled"
                            ? "info"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {page.status.replace("_", " ")}
                      </StatusBadge>
                    </td>

                    <td className="p-3.5 text-stone-500">
                      {page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : "—"}
                    </td>

                    <td className="p-3.5 pr-5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View Live Page"
                        className="inline-flex p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={(e) => handleDuplicate(page.id, e)}
                        title="Duplicate as Draft"
                        className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(page.id, page.title, e)}
                        title="Delete Page"
                        className="p-1.5 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Page Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Page"
        description="Choose a template starting point or begin with a blank canvas."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          {/* Preset Cards */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Select Starting Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TEMPLATE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedPreset === preset.id
                      ? "border-[#FF5A00] bg-[#FF5A00]/5 ring-1 ring-[#FF5A00]"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <span className="text-xs font-semibold text-stone-900 block">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                    {preset.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Title & Slug Inputs */}
          <div className="space-y-4 pt-2 border-t border-stone-100 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                required
                value={newPageTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Enterprise Software Development"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                URL Slug
              </label>
              <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                <span className="px-3 py-2 text-stone-400 font-mono text-xs border-r border-stone-200">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="enterprise-software-development"
                  className="w-full px-3 py-2 bg-transparent font-mono text-xs text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={createBusy}
            >
              Create &amp; Open Builder
            </Button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
