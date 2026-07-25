import { TimetableClass } from "./types";
import { Clock } from "lucide-react";

interface Props {
  schedule: TimetableClass[];
}

export function TimetableCard({ schedule }: Props) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Today&apos;s Timetable
        </h3>
        <button className="text-xs text-primary font-bold hover:underline">Full Schedule</button>
      </div>
      <div className="space-y-3">
        {schedule.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-muted w-16">{cls.time}</div>
              <div>
                <p className="font-bold text-sm">{cls.subject}</p>
                <p className="text-[10px] text-muted">{cls.grade}</p>
              </div>
            </div>
            <div className="text-xs font-mono bg-surface-variant px-2 py-1 rounded text-muted">
              {cls.room}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
