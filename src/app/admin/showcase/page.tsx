"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Building2, 
  MessageSquare, 
  Sliders, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Star, 
  X
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { type MediaItem } from "@/lib/admin-client/types";

interface Client {
  id: string;
  name: string;
  contactName?: string | null;
  logoUrl?: string | null;
  photoUrl?: string | null;
  country: string;
  countryCode: string;
  websiteUrl?: string | null;
  showInMarquee: boolean;
  showInTicker: boolean;
  isApproved: boolean;
  isArchived: boolean;
  displayOrder: number;
  _count?: { reviews: number };
}

interface ClientReview {
  id: string;
  clientId?: string | null;
  clientName: string;
  companyName?: string | null;
  location?: string | null;
  country: string;
  countryCode: string;
  photoUrl?: string | null;
  fullReview: string;
  shortReview?: string | null;
  rating?: number | null;
  source: string;
  isApproved: boolean;
  isPublished: boolean;
  showInTicker: boolean;
  displayOrder: number;
}

interface ShowcaseSettings {
  id: string;
  tickerEnabled: boolean;
  tickerSpeed: number;
  tickerDirection: string;
  tickerPauseHover: boolean;
  showCountryFlags: boolean;
  showStarRatings: boolean;
  showPhotographs: boolean;
  marqueeEnabled: boolean;
  marqueeSpeed: number;
  marqueeHeading: string;
  marqueeGrayscale: boolean;
}

const COUNTRIES = [
  { name: "India", code: "IN" },
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "UK" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Canada", code: "CA" },
  { name: "Singapore", code: "SG" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
];

export default function ClientShowcasePage() {
  const [activeTab, setActiveTab] = useState<"clients" | "reviews" | "settings">("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [settings, setSettings] = useState<ShowcaseSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals & Pickers
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingReview, setEditingReview] = useState<ClientReview | null>(null);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"clientLogo" | "clientPhoto" | "reviewPhoto" | null>(null);

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: "",
    contactName: "",
    logoUrl: "",
    photoUrl: "",
    country: "India",
    countryCode: "IN",
    websiteUrl: "",
    showInMarquee: true,
    showInTicker: true,
    isApproved: true,
    isArchived: false,
    displayOrder: 0,
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    clientId: "",
    clientName: "",
    companyName: "",
    location: "",
    country: "India",
    countryCode: "IN",
    photoUrl: "",
    fullReview: "",
    shortReview: "",
    rating: 5,
    source: "Verified Delivery",
    isApproved: true,
    isPublished: true,
    showInTicker: true,
    displayOrder: 0,
  });

  const fetchData = async () => {
    try {
      const [resClients, resReviews, resSettings] = await Promise.all([
        fetch("/api/admin/showcase/clients").then((r) => r.json()),
        fetch("/api/admin/showcase/reviews").then((r) => r.json()),
        fetch("/api/admin/showcase/settings").then((r) => r.json()),
      ]);
      if (resClients.data) setClients(resClients.data);
      if (resReviews.data) setReviews(resReviews.data);
      if (resSettings.data) setSettings(resSettings.data);
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: "Failed to load showcase data." });
    }
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetch("/api/admin/showcase/clients").then((r) => r.json()),
      fetch("/api/admin/showcase/reviews").then((r) => r.json()),
      fetch("/api/admin/showcase/settings").then((r) => r.json()),
    ]).then(([resClients, resReviews, resSettings]) => {
      if (!ignore) {
        if (resClients.data) setClients(resClients.data);
        if (resReviews.data) setReviews(resReviews.data);
        if (resSettings.data) setSettings(resSettings.data);
      }
    }).catch((e) => {
      if (!ignore) {
        console.error(e);
        setMsg({ type: "error", text: "Failed to load showcase data." });
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  // Client actions
  const handleOpenClientModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        contactName: client.contactName || "",
        logoUrl: client.logoUrl || "",
        photoUrl: client.photoUrl || "",
        country: client.country,
        countryCode: client.countryCode,
        websiteUrl: client.websiteUrl || "",
        showInMarquee: client.showInMarquee,
        showInTicker: client.showInTicker,
        isApproved: client.isApproved,
        isArchived: client.isArchived,
        displayOrder: client.displayOrder,
      });
    } else {
      setEditingClient(null);
      setClientForm({
        name: "",
        contactName: "",
        logoUrl: "",
        photoUrl: "",
        country: "India",
        countryCode: "IN",
        websiteUrl: "",
        showInMarquee: true,
        showInTicker: true,
        isApproved: true,
        isArchived: false,
        displayOrder: clients.length + 1,
      });
    }
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingClient
        ? `/api/admin/showcase/clients/${editingClient.id}`
        : `/api/admin/showcase/clients`;
      const method = editingClient ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      });
      if (!res.ok) throw new Error("Failed to save client");
      showToast("success", `Client ${editingClient ? "updated" : "created"} successfully.`);
      setClientModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to save client.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete client "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/showcase/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Client deleted.");
      fetchData();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete client.");
    }
  };

  // Review actions
  const handleOpenReviewModal = (review?: ClientReview) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({
        clientId: review.clientId || "",
        clientName: review.clientName,
        companyName: review.companyName || "",
        location: review.location || "",
        country: review.country,
        countryCode: review.countryCode,
        photoUrl: review.photoUrl || "",
        fullReview: review.fullReview,
        shortReview: review.shortReview || "",
        rating: review.rating || 5,
        source: review.source,
        isApproved: review.isApproved,
        isPublished: review.isPublished,
        showInTicker: review.showInTicker,
        displayOrder: review.displayOrder,
      });
    } else {
      setEditingReview(null);
      setReviewForm({
        clientId: "",
        clientName: "",
        companyName: "",
        location: "",
        country: "India",
        countryCode: "IN",
        photoUrl: "",
        fullReview: "",
        shortReview: "",
        rating: 5,
        source: "Verified Delivery",
        isApproved: true,
        isPublished: true,
        showInTicker: true,
        displayOrder: reviews.length + 1,
      });
    }
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingReview
        ? `/api/admin/showcase/reviews/${editingReview.id}`
        : `/api/admin/showcase/reviews`;
      const method = editingReview ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error("Failed to save review");
      showToast("success", `Review ${editingReview ? "updated" : "created"} successfully.`);
      setReviewModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/showcase/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Review deleted.");
      fetchData();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete review.");
    }
  };

  // Settings action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/showcase/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      showToast("success", "Display settings saved and published.");
      fetchData();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  // Media Picker Callback
  const handleMediaSelect = (media: MediaItem) => {
    if (mediaPickerTarget === "clientLogo") {
      setClientForm((prev) => ({ ...prev, logoUrl: media.url }));
    } else if (mediaPickerTarget === "clientPhoto") {
      setClientForm((prev) => ({ ...prev, photoUrl: media.url }));
    } else if (mediaPickerTarget === "reviewPhoto") {
      setReviewForm((prev) => ({ ...prev, photoUrl: media.url }));
    }
    setMediaPickerTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#FF5A00]" />
            Client Showcase & Marquee
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage authentic client relationships, company logos, verified reviews, and homepage marquee settings.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          {activeTab === "clients" && (
            <button
              onClick={() => handleOpenClientModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          )}
          {activeTab === "reviews" && (
            <button
              onClick={() => handleOpenReviewModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            msg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-px">
        <button
          onClick={() => setActiveTab("clients")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "clients"
              ? "border-[#FF5A00] text-[#FF5A00]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Clients ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "reviews"
              ? "border-[#FF5A00] text-[#FF5A00]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-[#FF5A00] text-[#FF5A00]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Display Settings</span>
        </button>
      </div>

      {/* TAB 1: CLIENTS */}
      {activeTab === "clients" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-700">
                <thead className="bg-stone-50 text-xs font-mono font-bold text-stone-500 uppercase border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3.5">Client & Company</th>
                    <th className="px-6 py-3.5">Country</th>
                    <th className="px-6 py-3.5">Logo</th>
                    <th className="px-6 py-3.5">Showcase Visibility</th>
                    <th className="px-6 py-3.5">Order</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                        No clients added yet. Click &quot;Add Client&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    clients.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {c.photoUrl ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-stone-200 shrink-0">
                                <Image src={c.photoUrl} alt={c.name} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                {c.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-stone-900">{c.name}</div>
                              {c.contactName && (
                                <div className="text-xs text-stone-500">{c.contactName}</div>
                              )}
                              {c.websiteUrl && (
                                <a
                                  href={c.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#FF5A00] hover:underline inline-flex items-center gap-1 mt-0.5"
                                >
                                  <span>{c.websiteUrl.replace(/^https?:\/\//, "")}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                            <span>{c.countryCode}</span>
                            <span>&bull;</span>
                            <span>{c.country}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {c.logoUrl ? (
                            <div className="relative w-16 h-8 bg-stone-50 rounded border border-stone-200 overflow-hidden flex items-center justify-center p-1">
                              <Image src={c.logoUrl} alt={c.name} fill className="object-contain p-1" />
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400 italic">No logo (Wordmark)</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                c.showInMarquee ? "text-emerald-700 font-medium" : "text-stone-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  c.showInMarquee ? "bg-emerald-500" : "bg-stone-300"
                                }`}
                              />
                              Marquee: {c.showInMarquee ? "Active" : "Hidden"}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                c.showInTicker ? "text-blue-700 font-medium" : "text-stone-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  c.showInTicker ? "bg-blue-500" : "bg-stone-300"
                                }`}
                              />
                              Ticker: {c.showInTicker ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-mono text-stone-500">
                          #{c.displayOrder}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenClientModal(c)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Edit client"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(c.id, c.name)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete client"
                            >
                              <Trash2 className="w-4 h-4" />
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
      )}

      {/* TAB 2: REVIEWS */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-700">
                <thead className="bg-stone-50 text-xs font-mono font-bold text-stone-500 uppercase border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3.5">Reviewer & Company</th>
                    <th className="px-6 py-3.5">Rating & Excerpt</th>
                    <th className="px-6 py-3.5">Source & Location</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Order</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                        No reviews recorded. Click &quot;Add Review&quot; to add authentic feedback.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {r.photoUrl ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-stone-200 shrink-0">
                                <Image src={r.photoUrl} alt={r.clientName} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                {r.clientName.replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-stone-900">{r.clientName}</div>
                              {r.companyName && (
                                <div className="text-xs text-stone-500">{r.companyName}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-sm">
                          <div className="space-y-1">
                            {r.rating && (
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {Array.from({ length: r.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-stone-800 line-clamp-2 italic font-normal">
                              &ldquo;{r.shortReview || r.fullReview}&rdquo;
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1 text-xs">
                            <span className="font-mono text-stone-500 block">{r.source}</span>
                            <span className="text-stone-700">
                              {r.location ? `${r.location}, ` : ""}
                              {r.country} ({r.countryCode})
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                r.isPublished ? "text-emerald-700 font-medium" : "text-amber-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  r.isPublished ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />
                              {r.isPublished ? "Published" : "Draft"}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                r.showInTicker ? "text-blue-700" : "text-stone-400"
                              }`}
                            >
                              Ticker: {r.showInTicker ? "Yes" : "No"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-mono text-stone-500">
                          #{r.displayOrder}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenReviewModal(r)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Edit review"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id, r.clientName)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
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
      )}

      {/* TAB 3: DISPLAY SETTINGS */}
      {activeTab === "settings" && settings && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {/* Ticker Settings Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FF5A00]" />
                  Client Review Ticker Settings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Controls the moving review strip positioned below the upper navigation.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tickerEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, tickerEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A00]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                  Movement Speed ({settings.tickerSpeed} px/sec)
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={settings.tickerSpeed}
                  onChange={(e) =>
                    setSettings({ ...settings, tickerSpeed: parseInt(e.target.value) || 30 })
                  }
                  className="w-full accent-[#FF5A00]"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Recommended: 25–35 px/sec for comfortable reading.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                  Movement Direction
                </label>
                <select
                  value={settings.tickerDirection}
                  onChange={(e) =>
                    setSettings({ ...settings, tickerDirection: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                >
                  <option value="rtl">Right to Left (Standard)</option>
                  <option value="ltr">Left to Right</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tickerPauseHover}
                  onChange={(e) =>
                    setSettings({ ...settings, tickerPauseHover: e.target.checked })
                  }
                  className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <span>Pause on Hover</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCountryFlags}
                  onChange={(e) =>
                    setSettings({ ...settings, showCountryFlags: e.target.checked })
                  }
                  className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <span>Show Country Flags</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showStarRatings}
                  onChange={(e) =>
                    setSettings({ ...settings, showStarRatings: e.target.checked })
                  }
                  className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <span>Show Star Ratings</span>
              </label>
            </div>
          </div>

          {/* Marquee Settings Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF5A00]" />
                  Client Logo Marquee Settings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Controls the client logo marquee placed below the Hero and above the Product Showcase.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marqueeEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, marqueeEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A00]"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Marquee Heading Text
                </label>
                <input
                  type="text"
                  value={settings.marqueeHeading}
                  onChange={(e) =>
                    setSettings({ ...settings, marqueeHeading: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  placeholder="Trusted by businesses we work with."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                    Movement Speed ({settings.marqueeSpeed} px/sec)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={settings.marqueeSpeed}
                    onChange={(e) =>
                      setSettings({ ...settings, marqueeSpeed: parseInt(e.target.value) || 25 })
                    }
                    className="w-full accent-[#FF5A00]"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Recommended: 20–30 px/sec for smooth non-distracting movement.
                  </span>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={settings.marqueeGrayscale}
                      onChange={(e) =>
                        setSettings({ ...settings, marqueeGrayscale: e.target.checked })
                      }
                      className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                    />
                    <span>Grayscale Logos by Default (Original Colors on Hover)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Publish Display Settings"}
            </button>
          </div>
        </form>
      )}

      {/* CLIENT MODAL */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-stone-200 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingClient ? "Edit Client Record" : "Add New Client"}
              </h3>
              <button
                onClick={() => setClientModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="e.g. Dr. Ratna Saxena IVF"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={clientForm.contactName}
                    onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })}
                    placeholder="e.g. Dr. Ratna Saxena"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Country
                  </label>
                  <select
                    value={clientForm.countryCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const c = COUNTRIES.find((x) => x.code === code);
                      setClientForm({
                        ...clientForm,
                        countryCode: code,
                        country: c ? c.name : "India",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={clientForm.websiteUrl}
                  onChange={(e) => setClientForm({ ...clientForm, websiteUrl: e.target.value })}
                  placeholder="https://client-website.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                />
              </div>

              {/* Media Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-3">
                    {clientForm.logoUrl ? (
                      <div className="relative w-16 h-10 bg-stone-50 rounded border border-stone-200 overflow-hidden flex items-center justify-center p-1">
                        <Image src={clientForm.logoUrl} alt="Logo" fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-16 h-10 rounded border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400">
                        No logo
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget("clientLogo")}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold hover:bg-stone-50 transition-colors"
                    >
                      {clientForm.logoUrl ? "Replace" : "Select Media"}
                    </button>
                    {clientForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setClientForm({ ...clientForm, logoUrl: "" })}
                        className="text-stone-400 hover:text-rose-600 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Profile Photograph
                  </label>
                  <div className="flex items-center gap-3">
                    {clientForm.photoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone-200 shrink-0">
                        <Image src={clientForm.photoUrl} alt="Photo" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400">
                        Avatar
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget("clientPhoto")}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold hover:bg-stone-50 transition-colors"
                    >
                      {clientForm.photoUrl ? "Replace" : "Select Media"}
                    </button>
                    {clientForm.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setClientForm({ ...clientForm, photoUrl: "" })}
                        className="text-stone-400 hover:text-rose-600 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientForm.showInMarquee}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, showInMarquee: e.target.checked })
                    }
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span>Show in Logo Marquee</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientForm.showInTicker}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, showInTicker: e.target.checked })
                    }
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span>Show in Review Ticker</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={clientForm.displayOrder}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-24 px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingClient ? "Update Client" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-stone-200 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingReview ? "Edit Client Review" : "Add Client Review"}
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Link to Existing Client
                  </label>
                  <select
                    value={reviewForm.clientId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const c = clients.find((x) => x.id === id);
                      if (c) {
                        setReviewForm({
                          ...reviewForm,
                          clientId: id,
                          clientName: c.contactName || c.name,
                          companyName: c.name,
                          country: c.country,
                          countryCode: c.countryCode,
                          photoUrl: c.photoUrl || reviewForm.photoUrl,
                        });
                      } else {
                        setReviewForm({ ...reviewForm, clientId: "" });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  >
                    <option value="">Standalone / Unlinked</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.contactName ? `(${c.contactName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.clientName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, clientName: e.target.value })
                    }
                    placeholder="e.g. Dr. Ratna Saxena"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={reviewForm.companyName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, companyName: e.target.value })
                    }
                    placeholder="e.g. Dr. Ratna Saxena IVF Centre"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={reviewForm.location}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, location: e.target.value })
                    }
                    placeholder="e.g. Meerut or Delhi NCR"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Country
                  </label>
                  <select
                    value={reviewForm.countryCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const c = COUNTRIES.find((x) => x.code === code);
                      setReviewForm({
                        ...reviewForm,
                        countryCode: code,
                        country: c ? c.name : "India",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                    Rating (1–5 Stars)
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Full Review Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.fullReview}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, fullReview: e.target.value })
                  }
                  placeholder="Complete authentic client review..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1">
                  Short Ticker Excerpt (6–12 words)
                </label>
                <input
                  type="text"
                  value={reviewForm.shortReview}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, shortReview: e.target.value })
                  }
                  placeholder="e.g. Clean, fast web platform for our healthcare practice."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20 focus:border-[#FF5A00]"
                />
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Used inside the moving ticker to keep multiple reviews simultaneously visible.
                </span>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.isPublished}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, isPublished: e.target.checked })
                    }
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.showInTicker}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, showInTicker: e.target.checked })
                    }
                    className="rounded text-[#FF5A00] focus:ring-[#FF5A00]"
                  />
                  <span>Show in Review Ticker</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#FF5A00] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingReview ? "Update Review" : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
