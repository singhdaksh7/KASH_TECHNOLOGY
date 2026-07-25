import { Announcement } from "./types";
import { Bell } from "lucide-react";

interface Props {
  announcements: Announcement[];
}

export function AnnouncementCard({ announcements }: Props) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Announcements
        </h3>
        <button className="text-xs text-primary font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="border-l-2 border-primary/50 pl-4 py-1">
            <h4 className="font-bold text-sm text-foreground">{a.title}</h4>
            <p className="text-xs text-muted mt-1">{a.content}</p>
            <div className="flex gap-3 mt-2 text-[10px] text-muted font-medium">
              <span>{new Date(a.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{a.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
