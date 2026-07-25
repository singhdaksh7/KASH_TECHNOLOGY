import { DUMMY_STUDENT } from "../../schoolsync-data";
import { formatPercent } from "../../../exora/exora-data";

export function ParentAttendanceModule() {
  const presentDays = 22;
  const absentDays = 1;

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">Attendance Record</h2>
        <p className="text-muted text-sm">Monthly attendance summary for {DUMMY_STUDENT.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Overall Percentage</p>
          <p className="text-4xl font-black text-primary">{formatPercent(DUMMY_STUDENT.attendancePct)}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-green-500 uppercase tracking-wider mb-2">Days Present</p>
          <p className="text-4xl font-black text-green-500">{presentDays}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-red-500 uppercase tracking-wider mb-2">Days Absent</p>
          <p className="text-4xl font-black text-red-500">{absentDays}</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <div className="w-64 h-64 border-4 border-white/10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}></div>
          <p className="text-muted text-sm italic">Calendar visualization active in production.</p>
        </div>
      </div>
    </div>
  );
}
