import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(3);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unread > 0 && (
                <button 
                  onClick={() => setUnread(0)}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1">
              <div className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${unread > 0 ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-primary">System Alert</span>
                  <span className="text-[10px] text-muted">2m ago</span>
                </div>
                <p className="text-sm">Database backup completed successfully.</p>
              </div>
              <div className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${unread > 0 ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-yellow-500">Payment Failed</span>
                  <span className="text-[10px] text-muted">1h ago</span>
                </div>
                <p className="text-sm">Subscription payment for Modern Vidya Niketan failed.</p>
              </div>
              <div className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${unread > 0 ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-green-500">New Signup</span>
                  <span className="text-[10px] text-muted">3h ago</span>
                </div>
                <p className="text-sm">Delhi Public School started a new trial.</p>
              </div>
            </div>
            
            <div className="p-3 border-t border-white/10 bg-white/5 text-center">
              <button className="text-xs text-muted hover:text-foreground">View all notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
