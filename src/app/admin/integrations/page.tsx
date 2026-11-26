"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage } from "@/lib/admin-client";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Shield,
  Clock,
  Layers,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  configured: boolean;
  status: "HEALTHY" | "WARNING" | "NOT_CONFIGURED" | "COMING_SOON";
  nonSecretConfig: Record<string, string | number | boolean>;
  lastActivityAt?: string | null;
  lastFailure?: string | null;
  docsUrl?: string;
}

export default function IntegrationsCenterPage() {
  const [items, setItems] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminClient
      .getIntegrations()
      .then((data) => setItems(data as unknown as IntegrationItem[]))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Integrations Center"
        subtitle="Manage configured external providers: Resend email, Google Analytics, Search Console, Storage and Cloudflare."
        breadcrumbs={[{ label: "System" }, { label: "Integrations" }]}
      />

      <div className="px-4 sm:px-6 space-y-4 max-w-7xl">
        {/* Security Note Alert */}
        <div className="bg-[#FFF9F4] border border-[#FF5A00]/20 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#FF5A00] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-[#0B0B0F]">Zero-Secret Storage Policy</span>
            <p className="text-[#4B5563]">
              API keys, webhook tokens, and credentials are read strictly from secure environment variables.
              Non-secret telemetry and health status are displayed below without exposing secrets.
            </p>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {loading && <p className="text-xs text-stone-400">Loading integrations…</p>}

        <div className="space-y-8 pt-2">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-2">
                  <Layers className="w-4 h-4 text-stone-400" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                    {cat}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catItems.map((item) => {
                    const isHealthy = item.status === "HEALTHY";
                    const isWarning = item.status === "WARNING";
                    const isSoon = item.status === "COMING_SOON";
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-[#0B0B0F]">{item.name}</h4>
                            {isHealthy && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Connected
                              </span>
                            )}
                            {isWarning && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertTriangle className="w-3 h-3" /> Warning
                              </span>
                            )}
                            {!isHealthy && !isWarning && !isSoon && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                                <XCircle className="w-3 h-3" /> Not Configured
                              </span>
                            )}
                            {isSoon && (
                              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                Optional / Planned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#4B5563] leading-relaxed">{item.description}</p>
                        </div>

                        {/* Non-secret config summary */}
                        <div className="bg-[#FAF9F8] rounded-xl p-3 text-[11px] font-mono space-y-1.5 border border-stone-100">
                          {Object.entries(item.nonSecretConfig).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center text-stone-600">
                              <span className="text-stone-400">{k}:</span>
                              <span className="font-semibold text-stone-800 truncate max-w-[180px]">
                                {String(v)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Activity & links */}
                        <div className="pt-2 border-t border-[#E8E5E2] flex items-center justify-between text-[11px]">
                          {item.id === "resend" ? (
                            <Link
                              href="/admin/settings/email-templates"
                              className="text-[#FF5A00] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>Manage Email Templates</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : item.docsUrl ? (
                            <a
                              href={item.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-500 hover:text-stone-800 inline-flex items-center gap-1"
                            >
                              <span>Documentation</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-stone-400">Integrated</span>
                          )}

                          {item.lastActivityAt && (
                            <span className="text-[10px] text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.lastActivityAt.slice(0, 10)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
