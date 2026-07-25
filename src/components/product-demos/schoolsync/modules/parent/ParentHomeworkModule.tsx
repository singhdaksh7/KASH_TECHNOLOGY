import { STUDENT_HOMEWORK } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { StatusBadge } from "../shared/StatusBadge";

export function ParentHomeworkModule() {
  const pendingHomework = STUDENT_HOMEWORK.filter(hw => hw.status === "pending");
  const completedHomework = STUDENT_HOMEWORK.filter(hw => hw.status !== "pending");

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">Homework & Assignments</h2>
        <p className="text-muted text-sm">Track pending and completed work.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar">
        <div>
          <h3 className="font-bold text-lg mb-4 text-yellow-500 flex items-center gap-2">
            Pending Tasks <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-xs">{pendingHomework.length}</span>
          </h3>
          <DemoTable headers={["Subject", "Assignment", "Due Date", "Status"]}>
            {pendingHomework.map(hw => (
              <tr key={hw.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold">{hw.subject}</td>
                <td className="px-6 py-4">{hw.title}</td>
                <td className="px-6 py-4 text-xs text-error">{new Date(hw.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={hw.status} type="warning" />
                </td>
              </tr>
            ))}
          </DemoTable>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-green-500 flex items-center gap-2">
            Completed <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">{completedHomework.length}</span>
          </h3>
          <DemoTable headers={["Subject", "Assignment", "Due Date", "Status"]}>
            {completedHomework.map(hw => (
              <tr key={hw.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold">{hw.subject}</td>
                <td className="px-6 py-4">{hw.title}</td>
                <td className="px-6 py-4 text-xs">{new Date(hw.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={hw.status} type="success" />
                </td>
              </tr>
            ))}
          </DemoTable>
        </div>
      </div>
    </div>
  );
}
