"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";

const field = "w-full px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5A00] transition-colors";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await adminClient.login(email.trim(), password);
      router.push(r.requiresTwoFactor ? "/admin/verify-2fa" : r.mustChangePassword ? "/admin/change-password" : "/admin/setup-2fa");
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#FF5A00]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-[#FF8A3D]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5A00] to-[#FF8A3D] text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#FF5A00]/30">K</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white pt-2">KASH Technology CMS</h1>
          <p className="text-xs text-white/60">Sign in to access your administrative workspace and page builder.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF5A00]" /><span>Email Address</span>
            </label>
            <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@kash-technology.com" className={field} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF5A00]" /><span>Password</span>
            </label>
            <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={field} />
          </div>
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#FF5A00]/20 flex items-center justify-center gap-2 disabled:opacity-60">
            <span>{loading ? "Authenticating..." : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/50">
          <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
          <span>Protected by Two-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
}
