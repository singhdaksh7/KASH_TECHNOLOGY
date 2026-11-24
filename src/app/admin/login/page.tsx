"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("founder@kash-technology.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Visual route transition expecting backend session authentication
    setTimeout(() => {
      setLoading(false);
      toast("Credentials accepted. Please enter your 2FA verification code.", "info");
      router.push("/admin/verify-2fa");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle brand orange backdrop glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#FF5A00]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-[#FF8A3D]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5A00] to-[#FF8A3D] text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#FF5A00]/30">
            K
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white pt-2">
            KASH Technology CMS
          </h1>
          <p className="text-xs text-white/60">
            Sign in to access your administrative workspace and page builder.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@kash-technology.com"
              className="w-full px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5A00] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>Password</span>
              </label>
              <Link href="/admin/setup-2fa" className="text-[11px] text-[#FF5A00] hover:underline">
                Setup 2FA?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your master password"
              className="w-full px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5A00] transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#FF5A00]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Continue to 2FA"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/50">
          <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
          <span>Protected by Enterprise Two-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
}
