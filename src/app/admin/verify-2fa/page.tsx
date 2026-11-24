"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";

export default function AdminVerify2FaPage() {
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (useRecovery) await adminClient.useRecoveryCode(code.trim());
      else await adminClient.verifyTwoFactor(code);
      router.push("/admin");
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <Link href="/admin/login" className="text-xs text-white/50 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Login</span>
        </Link>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FF5A00] flex items-center justify-center mx-auto"><ShieldCheck className="w-6 h-6" /></div>
          <h1 className="text-xl font-extrabold text-white">Two-Factor Verification</h1>
          <p className="text-xs text-white/60">{useRecovery ? "Enter one of your single-use recovery codes." : "Enter the 6-digit code from your authenticator app."}</p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-xs font-semibold text-white/80 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-[#FF5A00]" /><span>{useRecovery ? "Recovery Code" : "6-Digit Code"}</span></label>
            <input
              id="code" type="text" required autoFocus autoComplete="one-time-code" inputMode={useRecovery ? "text" : "numeric"}
              maxLength={useRecovery ? 32 : 6} value={code}
              onChange={(e) => setCode(useRecovery ? e.target.value : e.target.value.replace(/\D/g, ""))}
              placeholder={useRecovery ? "xxxxxxxxxx" : "123456"}
              className="w-full text-center text-lg tracking-[0.4em] px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FF5A00]"
            />
          </div>
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading || (!useRecovery && code.length < 6) || code.length === 0} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span>{loading ? "Verifying..." : "Verify & Sign In"}</span><ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <button type="button" onClick={() => { setUseRecovery(!useRecovery); setCode(""); setError(""); }} className="w-full text-center text-[11px] text-[#FF5A00] hover:underline">
          {useRecovery ? "Use authenticator app instead" : "Lost your device? Use a recovery code"}
        </button>
      </div>
    </div>
  );
}
