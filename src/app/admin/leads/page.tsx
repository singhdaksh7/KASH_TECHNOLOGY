"use client";

import React, { useState, useEffect } from "react";
import { LeadItem, LeadStatus } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Search,
  Mail,
  Phone,
  Send,
  X,
  Building } from "lucide-react";

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CONTACTED: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  QUALIFIED: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  PROPOSAL: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  WON: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  LOST: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200" },
};

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getLeads().then((data) => {
      setLeads(data);
      if (data.length > 0) setSelectedLead(data[0]);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      await adminClient.updateLeadStatus(leadId, status);
    } catch (err) {
      addToast({ title: "Update failed", message: errorMessage(err), type: "error" });
      return;
    }
    const fresh = await adminClient.getLeads();
    setLeads(fresh);
    setSelectedLead(fresh.find((l) => l.id === leadId) ?? null);
    addToast({ title: "Status Updated", message: `Lead moved to ${status}.` });
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    try {
      await adminClient.addLeadNote(selectedLead.id, newNote.trim());
    } catch (err) {
      addToast({ title: "Note failed", message: errorMessage(err), type: "error" });
      return;
    }
    const fresh = await adminClient.getLeads();
    setLeads(fresh);
    setSelectedLead(fresh.find((l) => l.id === selectedLead.id) ?? null);
    setNewNote("");
    addToast({ title: "Note Logged", message: "Internal note added to lead history." });
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
        title="Leads & Inquiries CRM"
        subtitle="Track incoming project briefs, contact form queries, and audit requests"
        breadcrumbs={[{ label: "Marketing" }, { label: "Leads" }]}
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

      {/* LEADS TABLE & DETAILS DRAWER */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
              <tr>
                <th className="py-3 px-4">Contact & Business</th>
                <th className="py-3 px-4">Requested Service</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5E2]">
              {filtered.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS.NEW;
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-[#FFF9F4]" : "hover:bg-stone-50/70"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0B0B0F]">{lead.name}</p>
                      <p className="text-[11px] text-[#4B5563] flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        <span>{lead.company}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#0B0B0F]">{lead.service}</td>

                    <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                      {lead.source}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-[11px]">
                      {lead.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* LEAD DETAILS DRAWER */}
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

            {/* STATUS SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                Pipeline Status
              </label>
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs font-bold text-[#0B0B0F] bg-white"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="PROPOSAL">PROPOSAL</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            {/* CONTACT METRICS */}
            <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-lg border border-[#E8E5E2]">
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
              <div className="flex items-center gap-2 text-stone-500 pt-1 border-t border-stone-200/60">
                <span>Landing Page:</span>
                <span className="font-mono text-[11px] text-stone-700">{selectedLead.landingPage}</span>
              </div>
            </div>

            {/* NOTES THREAD */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Internal Discussion & Notes
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-2.5 bg-stone-50 rounded-lg border border-[#E8E5E2] text-xs">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                        <span className="font-semibold text-stone-700">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-stone-700">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* ADD NOTE INPUT */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a progress note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  className="flex-1 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs"
                />
                <button
                  onClick={handleAddNote}
                  className="p-2 bg-[#FF5A00] text-white rounded-lg hover:bg-[#e04f00]"
                >
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
