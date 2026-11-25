"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNotification } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import {
  AlertTriangle,
  FileText,
  Mail,
  ExternalLink,
  Check,
} from "lucide-react";

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getNotifications().then(setNotifications).catch((e) => addToast({ title: "Could not load notifications", message: errorMessage(e), type: "error" })).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount; addToast identity is not stable
  }, []);
  const changed = () => window.dispatchEvent(new Event("kash:notifications-changed"));

  const handleMarkRead = async (id: string) => {
    try {
      await adminClient.markNotificationRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
      changed();
    } catch (e) {
      addToast({ title: "Could not update", message: errorMessage(e), type: "error" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminClient.markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      changed();
      addToast({ title: "All caught up", message: "All notifications marked as read." });
    } catch (e) {
      addToast({ title: "Could not update", message: errorMessage(e), type: "error" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter(
    (n) => filterType === "ALL" || n.type === filterType
  );

  return (
    <div className="space-y-6">
      {loading && <p className="text-xs text-stone-400">Loading notifications…</p>}
      <AdminHeader
        title="Notification Center"
        subtitle="Real-time administrative alerts across inbound project leads, editorial reviews, and SEO health triggers"
        breadcrumbs={[{ label: "System" }, { label: "Notifications" }]}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-50 bg-white"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          ) : null
        }
      />

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "ALL", label: "All Alerts" },
            { id: "NEW_LEAD", label: "Inbound Leads" },
            { id: "PAGE_REVIEW", label: "Content Reviews" },
            { id: "SEO_WARNING", label: "SEO Warnings" },
            { id: "FORM_SUBMISSION", label: "Audits" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterType === t.id
                ? "bg-[#FF5A00] text-white border-[#FF5A00] shadow-xs"
                : "bg-white text-stone-700 border-[#E8E5E2] hover:bg-stone-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS CONTAINER */}
      <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs divide-y divide-[#E8E5E2]">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 flex items-start justify-between gap-4 transition-colors ${
              !item.read ? "bg-[#FFF9F4]" : "hover:bg-stone-50/60"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === "NEW_LEAD"
                    ? "bg-blue-100 text-blue-700"
                    : item.type === "SEO_WARNING"
                    ? "bg-amber-100 text-amber-700"
                    : item.type === "PAGE_REVIEW"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-[#FFF3E9] text-[#FF5A00]"
                }`}
              >
                {item.type === "NEW_LEAD" ? (
                  <Mail className="w-4 h-4" />
                ) : item.type === "SEO_WARNING" ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#0B0B0F]">{item.title}</h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                  )}
                </div>
                <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">{item.message}</p>
                <span className="text-[10px] text-stone-400 mt-1 block font-mono">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.link && (
                <Link
                  href={item.link}
                  className="px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-[#0B0B0F] hover:bg-stone-100 flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
              {!item.read && (
                <button
                  onClick={() => handleMarkRead(item.id)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
