/* eslint-disable */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, QrCode, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminSetup2FaPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast("Two-factor authentication successfully configured!", "success");
      router.push("/admin");
    }, 600);
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
            SECURITY SETUP
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FF5A00] flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Set Up Authenticator App
          </h1>
          <p className="text-xs text-white/60">
            Scan the QR code with Google Authenticator, 1Password, or Authy.
          </p>
        </div>

        {/* Mock QR Code Display */}
        <div className="bg-white p-4 rounded-2xl max-w-[180px] mx-auto aspect-square flex flex-col items-center justify-center shadow-inner">
          <div className="w-full h-full border-4 border-dashed border-[#0B0B0F]/30 rounded-xl flex items-center justify-center text-[#0B0B0F] text-center p-2 text-xs font-mono font-bold">
            [ TOTP QR SECRET ]
          </div>
        </div>

        <div className="bg-[#090A0D] p-3 rounded-xl border border-white/10 text-center space-y-1">
          <div className="text-[10px] text-white/50 font-mono">Manual Secret Key:</div>
          <div className="text-xs font-mono font-bold text-[#FF5A00] tracking-wider select-all">
            KASH-AUTH-7789-X92Z-PROD
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>6-Digit Verification Code</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center text-lg tracking-[0.5em] px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#FF5A00]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Activating 2FA..." : "Verify & Enable 2FA"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
