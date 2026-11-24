/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioItem, ProjectKind, ProjectStatus } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getPortfolio().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      await adminClient.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      addToast({ title: "Project deleted", message: `"${name}" was removed.`, type: "info" });
    }
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "ALL" || p.projectType === typeFilter;
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Portfolio & Case Studies"
        subtitle="Manage live projects, prototypes, client deliverables, and technical case studies"
        breadcrumbs={[{ label: "Content" }, { label: "Portfolio" }]}
        actions={
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        }
      />

      {/* FILTER CONTROLS */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search projects or industries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Project Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E8E5E2] rounded-lg bg-white text-[#4B5563] focus:outline-none focus:border-[#FF5A00]"
          >
            <option value="ALL">All Project Types</option>
            <option value="REAL PROJECT">REAL PROJECT</option>
            <option value="PROTOTYPE">PROTOTYPE</option>
            <option value="CONCEPT">CONCEPT</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E8E5E2] rounded-lg bg-white text-[#4B5563] focus:outline-none focus:border-[#FF5A00]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* PORTFOLIO GRID TABLE */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category & Industry</th>
                <th className="py-3 px-4">Tech Stack</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5E2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Loading portfolio items...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No portfolio projects match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-stone-100 relative shrink-0 border border-[#E8E5E2]">
                          {item.thumbnail.startsWith("/") ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Briefcase className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/portfolio/${item.id}`}
                            className="font-bold text-[#0B0B0F] hover:text-[#FF5A00] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[11px] text-[#4B5563] truncate max-w-xs">{item.shortDescription}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.projectType === "REAL PROJECT"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : item.projectType === "PROTOTYPE"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {item.projectType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-[#0B0B0F]">{item.category}</p>
                      <p className="text-[11px] text-[#4B5563]">{item.industry}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="text-[10px] text-stone-400">+{item.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Published" ? "bg-emerald-500" : "bg-stone-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-[#4B5563] text-[11px]">
                      {item.updatedAt}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="p-1.5 rounded text-stone-500 hover:text-[#0B0B0F] hover:bg-stone-100"
                          title="Edit Case Study"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        {item.externalUrl && (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-stone-500 hover:text-[#FF5A00] hover:bg-stone-100"
                            title="Visit Live"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
