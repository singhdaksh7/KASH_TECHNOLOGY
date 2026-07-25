import { useState } from "react";
import { MOCK_STUDENTS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { formatPercent } from "../../../exora/exora-data";
import { MiniBarChart } from "../../charts/MiniBarChart";

export function AttendanceModule() {
  const [classFilter, setClassFilter] = useState("10");
  
  // Local state for toggling attendance
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late">>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: "present" }), {})
  );

  const filteredStudents = MOCK_STUDENTS.filter(s => s.grade === classFilter);
  
  const presentCount = Object.values(attendanceState).filter(s => s === "present").length;
  const absentCount = Object.values(attendanceState).filter(s => s === "absent").length;
  const lateCount = Object.values(attendanceState).filter(s => s === "late").length;
  const total = Object.keys(attendanceState).length;
  const todayPct = total ? (presentCount / total) * 100 : 0;

  const toggleStatus = (id: string, status: "present" | "absent" | "late") => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Attendance</h2>
          <p className="text-muted text-sm">Mark and track daily student attendance.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Today&apos;s Attendance</p>
          <p className="font-bold text-xl">{formatPercent(todayPct)}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Present</p>
          <p className="font-bold text-xl text-green-500">{presentCount}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Absent</p>
          <p className="font-bold text-xl text-red-500">{absentCount}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-yellow-500 uppercase tracking-wider mb-1">Late</p>
          <p className="font-bold text-xl text-yellow-500">{lateCount}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6">
        <h3 className="font-bold mb-4 text-sm">Weekly Attendance Trends</h3>
        <MiniBarChart 
          data={[92, 95, 91, 94, 88, 96]} 
          height={60} 
          labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          color="#22c55e"
          max={100}
        />
      </div>

      <DemoFilter 
        filters={[
          {
            value: classFilter,
            onChange: setClassFilter,
            options: [
              { label: "Grade 9", value: "9" },
              { label: "Grade 10", value: "10" },
              { label: "Grade 11", value: "11" },
              { label: "Grade 12", value: "12" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Name", "Roll No", "Section", "Status Action"]}>
          {filteredStudents.map(student => (
            <tr key={student.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{student.name}</td>
              <td className="px-6 py-4 font-mono text-xs">{student.rollNumber}</td>
              <td className="px-6 py-4">{student.section}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(student.id, "present")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${attendanceState[student.id] === "present" ? "bg-green-500/20 text-green-500 border-green-500/50" : "bg-white/5 text-muted border-white/10 hover:border-white/30"}`}
                  >
                    P
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id, "absent")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${attendanceState[student.id] === "absent" ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-white/5 text-muted border-white/10 hover:border-white/30"}`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id, "late")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${attendanceState[student.id] === "late" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" : "bg-white/5 text-muted border-white/10 hover:border-white/30"}`}
                  >
                    L
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-muted text-sm">No students found matching your criteria.</td>
            </tr>
          )}
        </DemoTable>
      </div>
    </div>
  );
}
