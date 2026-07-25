import { EXORA_USER } from "./exora-data";
import { ShieldCheck, Smartphone, Clock, LogOut, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileScreen() {
  return (
    <div className="flex-1 overflow-y-auto pb-20 pt-8 px-4 scrollbar-hide">
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-3xl border border-white/5">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-xl font-black">
          {EXORA_USER.avatar}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{EXORA_USER.name}</h3>
          <p className="text-xs text-muted mb-1">ID: EX-948271</p>
          <div className="flex items-center gap-1">
            {EXORA_USER.kycStatus === "verified" ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Verified Account
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" /> Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <h3 className="font-bold text-sm mb-3">Security</h3>
      <div className="bg-white/5 rounded-2xl border border-white/5 mb-6">
        <button className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-muted">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Two-Factor Authentication</p>
              <p className={cn("text-[10px]", EXORA_USER.twoFactorEnabled ? "text-tertiary" : "text-muted")}>
                {EXORA_USER.twoFactorEnabled ? "Enabled (Authenticator App)" : "Disabled"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        </button>
        <button className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-muted">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Trusted Devices</p>
              <p className="text-[10px] text-muted">2 active sessions</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-muted">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Login Activity</p>
              <p className="text-[10px] text-muted">Last login: Today, 10:45 AM</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Logout Mock */}
      <button className="w-full p-4 bg-error/10 hover:bg-error/20 border border-error/20 rounded-2xl flex items-center justify-center gap-2 transition-colors text-error group">
        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Log Out</span>
      </button>
    </div>
  );
}
