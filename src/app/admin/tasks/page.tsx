/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminTask, AdminTaskStatus, LeadPriority } from "@/lib/admin-client/types";
import { adminClient } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEntity, setNewEntity] = useState<AdminTask["relatedEntity"]>("Lead");
  const [newPriority, setNewPriority] = useState<LeadPriority>("MEDIUM");
  const [newDueDate, setNewDueDate] = useState("2026-11-26");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleToggleStatus = async (task: AdminTask) => {
    const nextStatus: AdminTaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    await adminClient.updateTaskStatus(task.id, nextStatus);
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    addToast({
      title: nextStatus === "DONE" ? "Task Completed" : "Task Reopened",
      message: task.title,
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const task: AdminTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      relatedEntity: newEntity,
      entityTitle: `${newEntity} Item`,
      assignee: "Daksh Singh",
      dueDate: newDueDate,
      priority: newPriority,
      status: "TODO",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const created = await adminClient.saveTask(task);
    setTasks([created, ...tasks]);
    setCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    addToast({ title: "Task Created", message: `Scheduled for ${newDueDate}.`, type: "success" });
  };

  const filtered = tasks.filter((t) => statusFilter === "ALL" || t.status === statusFilter);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Admin Tasks & Operations"
        subtitle="Operational action items across lead follow-ups, content approvals, SEO audits, and system checks"
        breadcrumbs={[{ label: "System" }, { label: "Tasks" }]}
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        }
      />

      {/* FILTER BUTTONS */}
      <div className="flex gap-2">
        {(["ALL", "TODO", "IN_PROGRESS", "DONE"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === s
                ? "bg-[#FF5A00] text-white shadow-xs"
                : "bg-white border border-[#E8E5E2] text-stone-700 hover:bg-stone-50"
            }`}
          >
            {s === "ALL" ? "All Tasks" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* TASKS LIST */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs divide-y divide-[#E8E5E2]">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={`p-4 flex items-start gap-3 transition-colors ${
              task.status === "DONE" ? "bg-stone-50/60 opacity-60" : "hover:bg-stone-50/50"
            }`}
          >
            <button
              onClick={() => handleToggleStatus(task)}
              className="mt-0.5 text-stone-400 hover:text-[#FF5A00]"
            >
              {task.status === "DONE" ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-bold text-xs ${
                    task.status === "DONE" ? "line-through text-stone-400" : "text-[#0B0B0F]"
                  }`}
                >
                  {task.title}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    task.priority === "URGENT"
                      ? "bg-red-100 text-red-700 font-bold"
                      : task.priority === "HIGH"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] mt-1">{task.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{task.assignee}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>Due {task.dueDate}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono text-[10px]">
                  {task.relatedEntity}
                </span>
              </div>
            </div>

            {task.entityUrl && (
              <Link
                href={task.entityUrl}
                className="p-1.5 rounded-lg border border-[#E8E5E2] text-stone-400 hover:text-[#FF5A00] hover:bg-white text-xs flex items-center gap-1"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs">No tasks match this filter.</div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">Create Admin Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on SchoolSync custom deployment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Description / Action Items</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Related Area</label>
                  <select
                    value={newEntity}
                    onChange={(e) => setNewEntity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Page">Page</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="System">System</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0B0B0F] mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#E8E5E2] rounded-lg bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8E5E2] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-[#4B5563] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-semibold hover:bg-[#e04f00]"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
