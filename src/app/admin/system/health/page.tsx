"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage } from "@/lib/admin-client";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Mail,
  HardDrive,
  Calendar,
} from "lucide-react";

interface ComponentHealth {
  name: string;
  status: "HEALTHY" | "WARNING" | "ERROR" | "NOT_CONFIGURED";
  message: string;
  lastCheckedAt: string;
  details?: Record<string, string | number | boolean | null>;
}

export default function SystemHealthPage() {
  const [data, setData] = useState<{ overallStatus: string; components: ComponentHealth[] } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runChecks = () => {
    setLoading(true);
    adminClient
      .getSystemHealth()
      .then((data) => setData(data as unknown as { overallStatus: string; components: ComponentHealth[] }))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminClient
      .getSystemHealth()
      .then((data) => setData(data as unknown as { overallStatus: string; components: ComponentHealth[] }))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const iconFor = (name: string) => {
    if (name.includes("Database")) return <Database className="w-4 h-4 text-[#FF5A00]" />;
    if (name.includes("Email")) return <Mail className="w-4 h-4 text-[#FF5A00]" />;
    if (name.includes("Scheduler")) return <Calendar className="w-4 h-4 text-[#FF5A00]" />;
    if (name.includes("Storage")) return <HardDrive className="w-4 h-4 text-[#FF5A00]" />;
    return <Activity className="w-4 h-4 text-[#FF5A00]" />;
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="System Health & Observability"
        subtitle="Safe real-time telemetry across core subsystems: Database, Email Deliverability, Cron Scheduler, Backups, and Storage."
        breadcrumbs={[{ label: "System" }, { label: "Health" }]}
        actions={
          <button
            onClick={runChecks}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 bg-white"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{loading ? "Checking…" : "Run Checks"}</span>
          </button>
        }
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl">
        {error && <p className="text-xs text-red-600">{error}</p>}

        {data && (
          <div className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Platform Status
              </span>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#0B0B0F]">
                  All Operational Subsystems
                </h3>
                {data.overallStatus === "HEALTHY" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Healthy
                  </span>
                )}
                {data.overallStatus === "WARNING" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3 h-3" /> Degraded
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-stone-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Checked live</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.components.map((c) => {
            const isHealthy = c.status === "HEALTHY";
            const isWarn = c.status === "WARNING";
            const isErr = c.status === "ERROR";

            return (
              <div
                key={c.name}
                className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {iconFor(c.name)}
                      <h4 className="font-bold text-sm text-[#0B0B0F]">{c.name}</h4>
                    </div>
                    {isHealthy && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Healthy
                      </span>
                    )}
                    {isWarn && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Warning
                      </span>
                    )}
                    {isErr && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Error
                      </span>
                    )}
                    {c.status === "NOT_CONFIGURED" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        Not Set
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">{c.message}</p>
                </div>

                {c.details && (
                  <div className="bg-[#FAF9F8] rounded-xl p-3 text-[11px] font-mono space-y-1 border border-stone-100">
                    {Object.entries(c.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-stone-600">
                        <span className="text-stone-400">{k}:</span>
                        <span className="font-semibold text-stone-800 truncate max-w-[160px]">
                          {v === null ? "—" : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
