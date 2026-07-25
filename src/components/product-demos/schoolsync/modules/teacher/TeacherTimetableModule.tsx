import { TEACHER_TIMETABLE } from "../../schoolsync-data";
import { Clock } from "lucide-react";

export function TeacherTimetableModule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["08:30 AM", "09:30 AM", "10:30 AM (Break)", "11:00 AM", "12:00 PM", "01:00 PM (Lunch)", "01:45 PM", "02:45 PM"];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">My Timetable</h2>
        <p className="text-muted text-sm">Your weekly teaching schedule.</p>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar border border-white/10 rounded-2xl bg-white/5">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-black/40 border-b border-white/10 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted w-32 border-r border-white/10">Time</th>
              {days.map(d => (
                <th key={d} className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {periods.map((time) => {
              const isBreak = time.includes("Break") || time.includes("Lunch");
              return (
                <tr key={time} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 border-r border-white/10 font-bold text-xs bg-black/20">
                    {time}
                  </td>
                  {days.map(day => {
                    if (isBreak) {
                      return (
                        <td key={day} className="px-6 py-4 text-center text-muted opacity-30">
                          <Clock className="w-4 h-4 mx-auto" />
                        </td>
                      );
                    }
                    const cls = TEACHER_TIMETABLE.find(t => t.time === time && t.day === day);
                    return (
                      <td key={day} className="px-6 py-4">
                        {cls ? (
                          <div className="bg-primary/20 border border-primary/30 p-3 rounded-xl hover:bg-primary/30 transition-colors cursor-pointer">
                            <p className="font-bold text-primary text-sm">{cls.grade}</p>
                            <p className="text-xs">{cls.subject}</p>
                            <p className="text-[10px] text-muted mt-1">{cls.room}</p>
                          </div>
                        ) : (
                          <span className="text-muted text-xs italic">Free</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
