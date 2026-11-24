"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminVerify2FaPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast("Two-factor authentication verified. Welcome back, Daksh!", "success");
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/login" className="text-xs text-white/50 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <span className="text-[10px] font-mono font-bold text-[#FF5A00] bg-[#FF5A00]/15 px-2 py-0.5 rounded border border-[#FF5A00]/30">
            2FA VERIFICATION
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A00]/15 border border-[#FF5A00]/30 text-[#FF5A00] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Two-Factor Authentication
          </h1>
          <p className="text-xs text-white/60">
            Enter the 6-digit verification code from your authenticator device.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Authentication Token</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-2xl tracking-[0.6em] px-3.5 py-3 bg-[#090A0D] border border-white/10 rounded-xl text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#FF5A00]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Validating Session..." : "Verify & Access Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <Link href="/admin/setup-2fa" className="text-xs text-white/40 hover:text-[#FF5A00] transition-colors">
            Lost device or need to re-configure authenticator?
          </Link>
        </div>
      </div>
    </div>
  );
}
