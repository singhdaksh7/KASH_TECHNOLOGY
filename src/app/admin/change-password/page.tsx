"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, ShieldAlert } from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";

const field = "w-full px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5A00] transition-colors";
const MIN = 12;

/** Forced first-login password change (temporary/bootstrap password). Gated server-side by admin/layout.tsx and every admin API. */
export default function AdminChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const strength = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(next)).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (next !== confirm) return setError("New password and confirmation do not match.");
    if (next === current) return setError("Choose a password different from the temporary one.");
    setLoading(true);
    try {
      const r = await adminClient.changePassword(current, next);
      router.replace(r.twoFactorEnabled ? "/admin" : "/admin/setup-2fa");
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FF5A00] flex items-center justify-center mx-auto"><ShieldAlert className="w-6 h-6" /></div>
          <h1 className="text-xl font-extrabold text-white">Create Your Password</h1>
          <p className="text-xs text-white/60">You signed in with a temporary password. Choose a new one to continue — next you will set up your authenticator app.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5 text-xs font-semibold text-white/80">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#FF5A00]" />Current (temporary) password</span>
            <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-white/80">
            <span>New password (min {MIN} characters)</span>
            <input type="password" required minLength={MIN} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
            <span className="block text-[10px] font-normal text-white/50">Mix uppercase, lowercase, numbers and symbols — a long passphrase works too. Strength: {["Too weak", "Weak", "Fair", "Good", "Strong"][next.length >= MIN ? strength : 0]}</span>
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-white/80">
            <span>Confirm new password</span>
            <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
          </label>
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span>{loading ? "Saving..." : "Set New Password"}</span><ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
