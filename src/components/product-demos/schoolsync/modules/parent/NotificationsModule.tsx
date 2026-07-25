import { useState } from "react";
import { Bell, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationsModule() {
  const [readStates, setReadStates] = useState<Record<string, boolean>>({});

  const notifications = [
    { id: "n1", type: "fee", title: "Fee Invoice Generated", date: "2 Hours Ago", content: "Term 1 fee invoice of ₹15,000 has been generated and is due next week.", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "n2", type: "academic", title: "Term 1 Results Published", date: "Yesterday", content: "The examination results for Term 1 have been published. You can now download the report card.", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { id: "n3", type: "general", title: "School Closed Tomorrow", date: "2 Days Ago", content: "Due to heavy rainfall forecast, the school will remain closed tomorrow.", icon: Bell, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { id: "n4", type: "academic", title: "New Homework Assigned", date: "Last Week", content: "Mr. Sharma has assigned a new Mathematics worksheet.", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  const markAllRead = () => {
    const allRead = notifications.reduce((acc, n) => ({ ...acc, [n.id]: true }), {});
    setReadStates(allRead);
  };

  const toggleRead = (id: string) => {
    setReadStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const unreadCount = notifications.filter(n => !readStates[n.id]).length;

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Notifications</h2>
          <p className="text-muted text-sm">You have {unreadCount} unread notifications.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-bold text-primary hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
        {notifications.map(notif => {
          const isRead = readStates[notif.id];
          return (
            <div 
              key={notif.id} 
              onClick={() => toggleRead(notif.id)}
              className={cn(
                "p-4 rounded-xl border flex gap-4 transition-all cursor-pointer relative",
                isRead ? "bg-white/5 border-white/5 opacity-60" : "bg-white/10 border-white/20 hover:border-primary/50"
              )}
            >
              {!isRead && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"></div>}
              
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                <notif.icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={cn("font-bold", isRead ? "text-muted-foreground" : "text-foreground")}>{notif.title}</h3>
                  <span className="text-[10px] text-muted whitespace-nowrap">{notif.date}</span>
                </div>
                <p className="text-sm text-muted">{notif.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
