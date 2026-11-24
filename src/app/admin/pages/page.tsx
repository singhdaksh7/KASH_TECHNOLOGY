"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Copy, 
  Trash2, 
  CheckCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminPageItem } from "@/lib/admin-client/types";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { toast } = useToast();

  const loadPages = async () => {
    try {
      setPages(await adminClient.getPages());
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  };

  useEffect(() => {
    let alive = true;
    adminClient.getPages().then((d) => alive && setPages(d)).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const handleCreate = async () => {
    const title = window.prompt("Page title");
    if (!title?.trim()) return;
    const slug = window.prompt("URL slug (lowercase letters, numbers, dashes)", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    if (!slug?.trim()) return;
    try {
      const page = await adminClient.createPage(title.trim(), slug.trim().replace(/^\//, ""));
      window.location.assign(`/admin/pages/${page.id}/edit`);
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  };

  const handleDuplicate = async (id: string) => {
    const dup = await adminClient.duplicatePage(id);
    if (dup) {
      toast(`Duplicated "${dup.title}" as draft`, "success");
      loadPages();
    }
  };

  const handleTogglePublish = async (page: AdminPageItem) => {
    try {
      if (page.status === "Published") {
        await adminClient.unpublishPage(page.id);
        toast(`Unpublished "${page.title}"`, "info");
      } else {
        await adminClient.publishPage(page.id);
        toast(`Published "${page.title}" live!`, "success");
      }
    } catch (err) {
      toast(errorMessage(err), "error");
    }
    loadPages();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminClient.deletePage(id);
        toast(`Deleted "${title}"`, "info");
      } catch (err) {
        toast(errorMessage(err), "error");
      }
      loadPages();
    }
  };

  const filtered = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Page Management"
        subtitle="Manage live routes, drafts, visual canvas editors, and SEO indexation."
        actions={
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Page</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls Header: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E5E2] shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug..."
              className="w-full pl-9 pr-3 py-2 bg-[#FFF9F4] border border-[#E8E5E2] rounded-xl text-xs text-[#0B0B0F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {["All", "Published", "Draft", "Scheduled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === s
                    ? "bg-[#0B0B0F] text-white shadow-2xs"
                    : "bg-[#FFF9F4] text-[#4B5563] hover:text-[#0B0B0F] border border-[#E8E5E2]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-2xl border border-[#E8E5E2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FFF9F4] border-b border-[#E8E5E2] text-[#4B5563] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">SEO Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5E2]">
                {filtered.map((page) => (
                  <tr key={page.id} className="hover:bg-[#FFF9F4]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0B0B0F]">{page.title}</div>
                      <div className="text-[10px] text-[#4B5563]">
                        {page.sections?.length || 0} visual sections
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#4B5563]">
                      <a
                        href={page.slug}
                        target="_blank"
                        className="hover:text-[#FF5A00] flex items-center gap-1"
                      >
                        <span>{page.slug}</span>
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        page.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : page.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#4B5563]">{page.lastUpdated}</td>
                    <td className="py-3 px-4 text-[#4B5563]">{page.updatedBy}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#FF5A00]">
                      {page.seoScore}/100
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="px-2.5 py-1 rounded-md bg-[#FFF3E9] text-[#FF5A00] font-bold text-xs hover:bg-[#FF5A00] hover:text-white transition-colors inline-block"
                      >
                        Visual Builder
                      </Link>
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        title="Duplicate"
                        className="p-1 rounded text-[#4B5563] hover:text-[#0B0B0F] hover:bg-gray-100 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(page)}
                        title={page.status === "Published" ? "Unpublish" : "Publish"}
                        className="p-1 rounded text-[#4B5563] hover:text-[#FF5A00] hover:bg-gray-100 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        title="Delete"
                        className="p-1 rounded text-[#4B5563] hover:text-red-500 hover:bg-gray-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
