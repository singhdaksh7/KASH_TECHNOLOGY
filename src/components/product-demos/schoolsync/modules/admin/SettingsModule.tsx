import { useState } from "react";
import { ShieldAlert, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsModule() {
  const [showToast, setShowToast] = useState(false);
  const [toggles, setToggles] = useState({
    smsAuth: true,
    emailAuth: true,
    autoBackup: false,
    publicNotices: true,
  });

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 h-full flex flex-col relative overflow-y-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black mb-1">System Settings</h2>
          <p className="text-muted text-sm">Configure school profile and system preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Save Demo Settings
        </button>
      </div>

      <div className="space-y-8 max-w-3xl">
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <ShieldAlert className="w-24 h-24 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2 relative z-10">School Profile</h3>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="block text-xs text-muted mb-1">School Name</label>
              <input type="text" defaultValue="KASH International Academy" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Registration Code</label>
              <input type="text" defaultValue="KIA-9982" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Academic Session</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option>2026 - 2027</option>
                <option>2025 - 2026</option>
              </select>
            </div>
            <div>
               <label className="block text-xs text-muted mb-1">Primary Email domain</label>
               <input type="text" defaultValue="@kashacademy.edu" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
            Notifications & Security
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-wider">Enterprise</span>
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">SMS & WhatsApp Alerts</p>
                <p className="text-xs text-muted">Send automated alerts for absence, fee dues, and emergencies.</p>
              </div>
              <button 
                onClick={() => toggleSetting("smsAuth")}
                className={cn("w-12 h-6 rounded-full transition-colors relative", toggles.smsAuth ? "bg-primary" : "bg-white/10")}
              >
                <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", toggles.smsAuth ? "right-1" : "left-1")}></span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Automated Database Backups (Multi-region)</p>
                <p className="text-xs text-muted">Backup local database to secure cloud storage daily with redundancy.</p>
              </div>
              <button 
                onClick={() => toggleSetting("autoBackup")}
                className={cn("w-12 h-6 rounded-full transition-colors relative", toggles.autoBackup ? "bg-primary" : "bg-white/10")}
              >
                <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", toggles.autoBackup ? "right-1" : "left-1")}></span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Single Sign-On (SSO)</p>
                <p className="text-xs text-muted">Allow staff to sign in via Google Workspace or Microsoft Entra.</p>
              </div>
              <button 
                onClick={() => toggleSetting("emailAuth")}
                className={cn("w-12 h-6 rounded-full transition-colors relative", toggles.emailAuth ? "bg-primary" : "bg-white/10")}
              >
                <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", toggles.emailAuth ? "right-1" : "left-1")}></span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-500 text-xs flex gap-2 transition-opacity duration-300 shadow-2xl backdrop-blur-md z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>Demo Settings: Changes are mocked locally and will not persist.</span>
      </div>
    </div>
  );
}
