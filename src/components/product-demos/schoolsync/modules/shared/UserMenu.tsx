import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { SchoolSyncRole } from "../../types";

export function UserMenu({ role }: { role: SchoolSyncRole }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-muted hover:text-foreground transition-colors border border-white/10 hover:border-white/30"
      >
        {role.substring(0, 1).toUpperCase()}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <p className="font-bold text-sm capitalize">{role} User</p>
              <p className="text-xs text-muted">demo@{role}.schoolsync</p>
            </div>
            
            <div className="py-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" /> My Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors">
                <Settings className="w-4 h-4" /> Preferences
              </button>
            </div>
            
            <div className="border-t border-white/10 py-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
