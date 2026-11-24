/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { LeadItem, LeadStatus, LeadPriority } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  X,
  Building,
  Kanban,
  Table as TableIcon,
  Flag,
  Calendar,
  Tag,
  CheckSquare,
  UserCheck,
} from "lucide-react";

const PIPELINE_COLUMNS: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"];

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CONTACTED: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  QUALIFIED: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  PROPOSAL: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  WON: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  LOST: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200" },
};

const PRIORITY_COLORS: Record<LeadPriority, string> = {
  LOW: "bg-stone-100 text-stone-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700 font-bold",
};

export default function LeadsCrmPhase2() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getLeads().then((data) => {
      // populate phase 2 defaults if missing
      const enhanced: LeadItem[] = data.map((l) => ({
        ...l,
        priority: l.priority || "MEDIUM",
        assignedTo: l.assignedTo || "Daksh Singh",
        tags: l.tags || ["Website", "Direct Inbound"],
        lastActivity: l.lastActivity || l.date,
        attribution: l.attribution || {
          utmSource: "google-organic",
          utmMedium: "search",
          utmCampaign: "delhi-ncr-software",
          landingPage: l.landingPage,
          formName: "Project Inquiry Form",
        },
      }));
      setLeads(enhanced);
      if (enhanced.length > 0) setSelectedLead(enhanced[0]);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    await adminClient.updateLeadStatus(leadId, status);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status });
    }
    addToast({ title: "Status Updated", message: `Lead moved to ${status}.` });
  };

  const handleAssignChange = async (leadId: string, assignedTo: string) => {
    await adminClient.assignLead(leadId, assignedTo);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, assignedTo } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, assignedTo });
    }
    addToast({ title: "Lead Assigned", message: `Assigned to ${assignedTo}.` });
  };

  const handlePriorityChange = async (leadId: string, priority: LeadPriority) => {
    await adminClient.setLeadPriority(leadId, priority);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, priority } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, priority });
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    const note = {
      id: `note-${Date.now()}`,
      author: "Daksh Singh",
      text: newNote.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = {
      ...selectedLead,
      notes: [...selectedLead.notes, note],
    };
    setSelectedLead(updated);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setNewNote("");
    addToast({ title: "Note Logged", message: "Internal note added to lead timeline." });
  };

  const handleAddTask = () => {
    if (!selectedLead || !newTaskTitle.trim()) return;
    const task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: "Tomorrow",
      assignedTo: selectedLead.assignedTo || "Daksh Singh",
      completed: false,
    };
    const updated = {
      ...selectedLead,
      tasks: [...(selectedLead.tasks || []), task],
    };
    setSelectedLead(updated);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setNewTaskTitle("");
    addToast({ title: "Task Created", message: `Assigned task: "${task.title}"` });
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.service.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Lead & Deal Flow CRM"
        subtitle="Manage inbound project inquiries, assign account owners, set follow-up tasks, and track pipeline velocity"
        breadcrumbs={[{ label: "Marketing" }, { label: "Lead CRM" }]}
        actions={
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-[#E8E5E2]">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                viewMode === "board" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563]"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Board</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                viewMode === "table" ? "bg-white text-[#FF5A00] shadow-xs" : "text-[#4B5563]"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        }
      />

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search leads, companies, services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(["ALL", "NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === s
                    ? "bg-[#FF5A00] text-white shadow-xs"
                    : "bg-stone-50 border border-[#E8E5E2] text-stone-600 hover:bg-stone-100"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex gap-6 items-start">
        {viewMode === "board" ? (
          /* KANBAN BOARD VIEW */
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1000px]">
              {PIPELINE_COLUMNS.map((col) => {
                const colLeads = filtered.filter((l) => l.status === col);
                const colStyle = STATUS_COLORS[col];
                return (
                  <div key={col} className="w-72 bg-stone-100/70 rounded-xl p-3 flex flex-col max-h-[75vh]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                      <span className="font-bold text-xs text-[#0B0B0F] uppercase tracking-wider">
                        {col}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-stone-600">
                        {colLeads.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {colLeads.map((lead) => {
                        const isSelected = selectedLead?.id === lead.id;
                        return (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={`p-3.5 rounded-xl border-2 bg-white cursor-pointer transition-all shadow-xs space-y-2 ${
                              isSelected
                                ? "border-[#FF5A00] ring-2 ring-[#FF5A00]/20"
                                : "border-stone-200/80 hover:border-stone-400"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <h5 className="font-bold text-xs text-[#0B0B0F]">{lead.name}</h5>
                                <p className="text-[11px] text-[#4B5563] flex items-center gap-1 mt-0.5">
                                  <Building className="w-3 h-3 text-stone-400" />
                                  <span>{lead.company}</span>
                                </p>
                              </div>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                  PRIORITY_COLORS[lead.priority || "MEDIUM"]
                                }`}
                              >
                                {lead.priority || "MEDIUM"}
                              </span>
                            </div>

                            <div className="text-[11px] font-semibold text-[#FF5A00] bg-[#FFF3E9] px-2 py-1 rounded">
                              {lead.service}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px] text-stone-400">
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                <span>{lead.assignedTo}</span>
                              </span>
                              <span>{lead.date}</span>
                            </div>
                          </div>
                        );
                      })}
                      {colLeads.length === 0 && (
                        <div className="p-4 text-center text-stone-400 text-xs italic">
                          No leads in {col}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
                <tr>
                  <th className="py-3 px-4">Contact & Business</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5E2]">
                {filtered.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  const statusStyle = STATUS_COLORS[lead.status];
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer ${isSelected ? "bg-[#FFF9F4]" : "hover:bg-stone-50/70"}`}
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#0B0B0F]">{lead.name}</p>
                        <p className="text-[11px] text-[#4B5563]">{lead.company}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#0B0B0F]">{lead.service}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${PRIORITY_COLORS[lead.priority || "MEDIUM"]}`}>
                          {lead.priority || "MEDIUM"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{lead.assignedTo}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 text-[11px]">{lead.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* LEAD DETAIL & ATTRIBUTION DRAWER */}
        {selectedLead && (
          <aside className="w-88 bg-white rounded-xl border border-[#E8E5E2] p-5 shrink-0 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E2]">
              <div>
                <h4 className="text-sm font-bold text-[#0B0B0F]">{selectedLead.name}</h4>
                <p className="text-xs text-[#4B5563]">{selectedLead.company}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STATUS & ASSIGNEE CONTROLS */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Pipeline Stage</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-bold text-[#0B0B0F] bg-white"
                >
                  {PIPELINE_COLUMNS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Owner</label>
                <select
                  value={selectedLead.assignedTo}
                  onChange={(e) => handleAssignChange(selectedLead.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg text-xs bg-white"
                >
                  <option value="Daksh Singh">Daksh Singh</option>
                  <option value="Rahul Sharma">Rahul Sharma</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="space-y-1.5 text-xs bg-stone-50 p-3 rounded-lg border border-[#E8E5E2]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF5A00]" />
                <a href={`mailto:${selectedLead.email}`} className="text-[#0B0B0F] hover:underline font-mono">
                  {selectedLead.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                <a href={`tel:${selectedLead.phone}`} className="text-[#0B0B0F] hover:underline font-mono">
                  {selectedLead.phone}
                </a>
              </div>
            </div>

            {/* MARKETING ATTRIBUTION */}
            {selectedLead.attribution && (
              <div className="space-y-1 text-[11px] p-3 rounded-lg bg-[#FFF9F4] border border-[#E8E5E2]">
                <span className="font-bold text-[10px] uppercase text-stone-500 block mb-1">
                  Campaign Attribution
                </span>
                <div className="flex justify-between">
                  <span className="text-stone-400">UTM Source:</span>
                  <span className="font-mono text-stone-800">{selectedLead.attribution.utmSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Landing Page:</span>
                  <span className="font-mono text-stone-800">{selectedLead.attribution.landingPage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Form:</span>
                  <span className="text-stone-800">{selectedLead.attribution.formName}</span>
                </div>
              </div>
            )}

            {/* TASKS LIST */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Action Items / Tasks
              </span>
              {(selectedLead.tasks || []).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs p-2 rounded bg-stone-50 border border-stone-200">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="flex-1 font-medium">{t.title}</span>
                </div>
              ))}
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Schedule next task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1 px-2.5 py-1 border border-[#E8E5E2] rounded text-xs"
                />
                <button
                  onClick={handleAddTask}
                  className="px-2.5 py-1 bg-[#FF5A00] text-white rounded text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* NOTES THREAD */}
            <div className="space-y-2 pt-2 border-t border-[#E8E5E2]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Internal Notes & Call Logs
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedLead.notes.map((note) => (
                  <div key={note.id} className="p-2 bg-stone-50 rounded border border-[#E8E5E2] text-xs">
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mb-0.5">
                      <span className="font-semibold text-stone-700">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-stone-700">{note.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Log progress note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  className="flex-1 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
                <button onClick={handleAddNote} className="p-2 bg-[#FF5A00] text-white rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
