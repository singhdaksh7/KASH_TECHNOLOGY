"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { adminClient, errorMessage, type SessionInfo } from "@/lib/admin-client";
import { ShieldCheck, Lock, Palette } from "lucide-react";

export default function SystemSettingsPage() {
  const { addToast } = useToast();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  useEffect(() => { adminClient.getSession().then(setSession).catch(() => undefined); }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminClient.changePassword(current, next);
      setCurrent(""); setNext("");
      addToast({ title: "Password changed", message: "Other sessions were signed out.", type: "success" });
    } catch (err) {
      addToast({ title: "Could not change password", message: errorMessage(err), type: "error" });
    }
  };
  const input = "w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs";

  return (
    <div className="space-y-6">
      <AdminHeader title="Account & Security" subtitle="Your sign-in security. Site-wide design settings live under Design; the server is configured through environment variables." breadcrumbs={[{ label: "System" }, { label: "Settings" }]} />
      <div className="px-4 sm:px-6 grid gap-5 max-w-4xl lg:grid-cols-2">
        <section className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FF5A00]" />Signed in as</h4>
          <p className="font-semibold">{session?.user.name ?? session?.user.email}</p>
          <p className="text-stone-500">{session?.user.email}</p>
          <p><span className="text-stone-400">Roles:</span> {session?.user.roles.map((r) => r.replace(/_/g, " ")).join(", ")}</p>
          <p><span className="text-stone-400">Two-factor authentication:</span> <b className={session?.twoFactorEnabled ? "text-green-700" : "text-red-600"}>{session?.twoFactorEnabled ? "Enabled" : "Not enabled"}</b></p>
          <Link href="/admin/design/theme" className="inline-flex items-center gap-1.5 text-[#FF5A00] font-semibold hover:underline"><Palette className="w-3.5 h-3.5" />Theme, header &amp; footer</Link>
        </section>
        <form onSubmit={changePassword} className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold uppercase tracking-wider flex items-center gap-2"><Lock className="w-4 h-4 text-[#FF5A00]" />Change password</h4>
          <label className="block font-semibold">Current password<input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={`${input} mt-1`} /></label>
          <label className="block font-semibold">New password (min 12 characters)<input type="password" required minLength={12} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={`${input} mt-1`} /></label>
          <button type="submit" className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold">Update password</button>
        </form>
      </div>
    </div>
  );
}
