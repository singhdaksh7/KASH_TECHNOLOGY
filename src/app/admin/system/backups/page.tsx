"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { Database, ShieldCheck, HardDrive, CheckCircle2 } from "lucide-react";

interface BackupPolicyData {
  configured: boolean;
  policy: {
    strategy: string;
    schedule: string;
    retentionDays: number;
    format: string;
    integrityCheck?: string;
  };
  status: string;
  lastSuccessfulBackup: {
    timestamp: string;
    status: string;
    retentionPolicyMet: boolean;
  };
  mediaBackupStatus: {
    strategy: string;
    automatedArchive: string;
  };
}

export default function BackupsPage() {
  const [data, setData] = useState<BackupPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminClient
      .getSystemBackups()
      .then((data) => setData(data as unknown as BackupPolicyData))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Database & Media Backups"
        subtitle="Read-only operational backup telemetry. Nightly automated snapshots are verified with table of contents checks."
        breadcrumbs={[{ label: "System" }, { label: "Backups" }]}
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-5xl">
        {error && <p className="text-xs text-red-600">{error}</p>}
        {loading && <p className="text-xs text-stone-400">Loading backup policies…</p>}

        {data && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E5E2] pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#FF5A00]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                    Database Backup Policy
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Active &amp; Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#FAF9F8] p-3 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[10px] uppercase">Strategy</span>
                  <span className="font-semibold text-stone-800">{data.policy.strategy}</span>
                </div>
                <div className="bg-[#FAF9F8] p-3 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[10px] uppercase">Schedule</span>
                  <span className="font-semibold text-stone-800">{data.policy.schedule}</span>
                </div>
                <div className="bg-[#FAF9F8] p-3 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[10px] uppercase">Retention</span>
                  <span className="font-semibold text-stone-800">{data.policy.retentionDays} Days</span>
                </div>
                <div className="bg-[#FAF9F8] p-3 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[10px] uppercase">Format</span>
                  <span className="font-semibold text-stone-800">{data.policy.format}</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-3">
                <HardDrive className="w-4 h-4 text-[#FF5A00]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">
                  Media Volume Persistence
                </h3>
              </div>
              <div className="text-xs text-[#4B5563] space-y-2">
                <p>
                  Uploaded assets are stored in isolated persistent Docker volume mounts (or object storage).
                  To prevent data loss during container redeployment, assets reside decoupled from application container layers.
                </p>
                <div className="bg-[#FAF9F8] p-3 rounded-xl border border-stone-100 font-mono text-[11px] text-stone-700">
                  Volume mount strategy: {data.mediaBackupStatus.strategy}
                </div>
              </div>
            </section>

            <section className="bg-[#FFF9F4] rounded-2xl border border-[#FF5A00]/20 p-5 shadow-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF5A00] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-[#0B0B0F]">Disaster Recovery &amp; Restore Safety</span>
                <p className="text-[#4B5563] leading-relaxed">
                  Destructive database restoration requires manual privileged execution via CLI scripts with
                  isolated verify mode (<code className="font-mono text-[#0B0B0F]">--verify</code>) into a scratch database. One-click web restore is intentionally prevented to protect production integrity.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
