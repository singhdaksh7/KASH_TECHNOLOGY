import { useState } from "react";
import { MOCK_STUDENTS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";

export function TeacherAttendanceModule() {
  const [classFilter, setClassFilter] = useState("10");
  
  // Local state for toggling attendance
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late">>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: "present" }), {})
  );

  const filteredStudents = MOCK_STUDENTS.filter(s => s.grade === classFilter);

  const toggleStatus = (id: string, status: "present" | "absent" | "late") => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Mark Attendance</h2>
          <p className="text-muted text-sm">Record attendance for your assigned classes.</p>
        </div>
      </div>

      <DemoFilter 
        filters={[
          {
            value: classFilter,
            onChange: setClassFilter,
            options: [
              { label: "Grade 9-A (Science)", value: "9" },
              { label: "Grade 10-A (Mathematics)", value: "10" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Name", "Roll No", "Status Action"]}>
          {filteredStudents.map(student => (
            <tr key={student.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{student.name}</td>
              <td className="px-6 py-4 font-mono text-xs">{student.rollNumber}</td>
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
                </div>
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
