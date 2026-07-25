import { useState } from "react";
import { ANNOUNCEMENTS } from "../../schoolsync-data";
import { DemoFilter } from "../shared/DemoFilter";
import { Plus, Megaphone, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnnouncementsModule() {
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [readStates, setReadStates] = useState<Record<string, boolean>>({});

  const filteredAnnouncements = ANNOUNCEMENTS.filter(a => {
    if (audienceFilter === "all") return true;
    return a.audience === audienceFilter || a.audience === "all";
  });

  const toggleRead = (id: string) => {
    setReadStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Notice Board</h2>
          <p className="text-muted text-sm">Publish and manage school-wide announcements.</p>
        </div>
        <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90">
          <Plus className="w-4 h-4" /> New Notice
        </button>
      </div>

      <DemoFilter 
        filters={[
          {
            value: audienceFilter,
            onChange: setAudienceFilter,
            options: [
              { label: "Everyone", value: "all" },
              { label: "Teachers Only", value: "teachers" },
              { label: "Parents Only", value: "parents" },
              { label: "Students Only", value: "students" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
        {filteredAnnouncements.map(ann => {
          const isRead = readStates[ann.id];
          return (
            <div 
              key={ann.id} 
              className={cn(
                "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                isRead ? "bg-white/5 border-white/5 opacity-70" : "bg-white/10 border-white/20 hover:border-primary/50 shadow-lg"
              )}
              onClick={() => toggleRead(ann.id)}
            >
              {!isRead && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isRead ? "bg-white/5" : "bg-primary/20 text-primary")}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ann.title}</h3>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{ann.author} • {new Date(ann.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-white/10 text-muted border-white/10">
                    {ann.audience}
                  </span>
                  {isRead && (
                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      <Check className="w-3 h-3" /> Read
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed pl-13">
                {ann.content}
              </p>
            </div>
          );
        })}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">No announcements found.</div>
        )}
      </div>
    </div>
  );
}
