import { MOCK_CLASSES } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { StatusBadge } from "../shared/StatusBadge";
import { formatPercent } from "../../../exora/exora-data";

export function MyClassesModule() {
  const teacherClasses = MOCK_CLASSES.filter(c => c.classTeacher === "Anita Desai" || c.classTeacher === "Ravi Sharma");

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">My Classes</h2>
          <p className="text-muted text-sm">Overview of classes you teach.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Grade", "Section", "Students", "Avg Attendance", "Next Period", "Action"]}>
          {teacherClasses.map(c => (
            <tr key={c.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">Grade {c.grade}</td>
              <td className="px-6 py-4">{c.section}</td>
              <td className="px-6 py-4">{c.studentCount}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={formatPercent(c.attendancePct)} 
                  type={c.attendancePct > 90 ? "success" : "warning"} 
                />
              </td>
              <td className="px-6 py-4 text-xs">Mathematics - 08:30 AM</td>
              <td className="px-6 py-4">
                <button className="text-xs font-bold text-primary hover:underline">
                  View Roster
                </button>
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
