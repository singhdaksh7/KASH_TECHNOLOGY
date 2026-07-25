import { useState } from "react";
import { STUDENT_TIMETABLE } from "../../schoolsync-data";
import { DemoFilter } from "../shared/DemoFilter";
import { Clock } from "lucide-react";

export function TimetableModule() {
  const [classFilter, setClassFilter] = useState("10");
  const [day, setDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["08:30 AM", "09:30 AM", "10:30 AM (Break)", "11:00 AM", "12:00 PM", "01:00 PM (Lunch)", "01:45 PM", "02:45 PM"];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Master Timetable</h2>
          <p className="text-muted text-sm">View and manage class schedules across the school.</p>
        </div>
      </div>

      <DemoFilter 
        filters={[
          {
            value: classFilter,
            onChange: setClassFilter,
            options: [
              { label: "Grade 9-A", value: "9" },
              { label: "Grade 10-A", value: "10" },
              { label: "Grade 11-A", value: "11" },
            ]
          }
        ]}
      />

      <div className="flex gap-2 mb-6">
        {days.map(d => (
          <button 
            key={d}
            onClick={() => setDay(d)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${day === d ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted hover:bg-white/10"}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-4">
        {periods.map((time, i) => {
          const isBreak = time.includes("Break") || time.includes("Lunch");
          const cls = !isBreak ? STUDENT_TIMETABLE.find(t => t.time === time && t.day === day) : null;
          
          if (isBreak) {
            return (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-center justify-center opacity-50">
                <Clock className="w-4 h-4" />
                <span className="font-bold text-sm tracking-widest uppercase">{time}</span>
              </div>
            );
          }

          return (
            <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 items-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-24 shrink-0 text-center border-r border-white/10 pr-6">
                <p className="font-black text-lg text-primary">P{i < 2 ? i + 1 : i < 5 ? i : i - 1}</p>
                <p className="text-[10px] text-muted">{time}</p>
              </div>
              
              {cls ? (
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{cls.subject}</h3>
                    <p className="text-sm text-muted">Teacher: {cls.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{cls.room}</p>
                    <p className="text-[10px] text-muted uppercase">Location</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-muted text-sm italic">
                  Free Period / Not Assigned
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
