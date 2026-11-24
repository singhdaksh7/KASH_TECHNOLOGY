"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, QrCode } from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";

export default function AdminSetup2FaPage() {
  const [qr, setQr] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const session = await adminClient.getSession();
        if (session.twoFactorEnabled) {
          router.replace("/admin");
          return;
        }
        const r = await adminClient.setupTwoFactor();
        setQr(r.qrDataUrl);
        setManualKey(r.manualKey);
      } catch (e) {
        setError(errorMessage(e));
        router.replace("/admin/login");
      }
    })();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await adminClient.confirmTwoFactor(code);
      setRecovery(r.recoveryCodes);
    } catch (err) {
      setError(errorMessage(err));
    }
    setLoading(false);
  };

  if (recovery) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-5">
          <h1 className="text-xl font-extrabold">Save your recovery codes</h1>
          <p className="text-xs text-white/60">Each code works once if you lose your authenticator. They are shown only now — store them in a password manager.</p>
          <ul className="grid grid-cols-2 gap-2 font-mono text-sm bg-[#090A0D] border border-white/10 rounded-xl p-4 select-all">
            {recovery.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <button onClick={() => router.push("/admin")} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold">I have saved them — continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#12141A] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FF5A00] flex items-center justify-center mx-auto"><QrCode className="w-6 h-6" /></div>
          <h1 className="text-xl font-extrabold text-white">Set Up Authenticator App</h1>
          <p className="text-xs text-white/60">Two-factor authentication is required. Scan the QR code with Google Authenticator, 1Password or Authy.</p>
        </div>
        <div className="bg-white p-3 rounded-2xl max-w-[200px] mx-auto aspect-square flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr ? <img src={qr} alt="Authenticator QR code" className="w-full h-full" /> : <span className="text-xs text-black/50">Loading…</span>}
        </div>
        {manualKey && (
          <div className="bg-[#090A0D] p-3 rounded-xl border border-white/10 text-center space-y-1">
            <div className="text-[10px] text-white/50 font-mono">Manual setup key</div>
            <div className="text-xs font-mono font-bold text-[#FF5A00] tracking-wider select-all break-all">{manualKey}</div>
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-xs font-semibold text-white/80 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-[#FF5A00]" /><span>6-Digit Verification Code</span></label>
            <input id="code" type="text" required maxLength={6} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456"
              className="w-full text-center text-lg tracking-[0.5em] px-3.5 py-2.5 bg-[#090A0D] border border-white/10 rounded-xl text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FF5A00]" />
          </div>
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading || code.length < 6 || !qr} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span>{loading ? "Activating 2FA..." : "Verify & Enable 2FA"}</span><ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
