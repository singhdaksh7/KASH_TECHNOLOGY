import { useState } from "react";
import { STUDENT_HOMEWORK } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { Plus, ShieldAlert } from "lucide-react";

export function TeacherHomeworkModule() {
  const [showToast, setShowToast] = useState(false);

  const teacherHomework = STUDENT_HOMEWORK.filter(hw => hw.teacher === "Mr. Sharma");

  const handleDemoCreate = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">My Assignments</h2>
          <p className="text-muted text-sm">Create and track homework for your classes.</p>
        </div>
        <button 
          onClick={handleDemoCreate}
          className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Create Homework
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Title", "Class", "Assigned Date", "Due Date", "Submissions", "Action"]}>
          {teacherHomework.map(hw => (
            <tr key={hw.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{hw.title}</td>
              <td className="px-6 py-4">{hw.class}</td>
              <td className="px-6 py-4 text-xs">{new Date(hw.assignedDate || "").toLocaleDateString()}</td>
              <td className="px-6 py-4 text-xs">{new Date(hw.dueDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden w-24">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(hw.submissionCount || 0) / (hw.totalStudents || 1) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px]">{hw.submissionCount}/{hw.totalStudents}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <button className="text-xs font-bold text-primary hover:underline">
                  View Submissions
                </button>
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-500 text-xs flex gap-2 transition-opacity duration-300 shadow-2xl backdrop-blur-md ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>Demo Action: Form disabled in frontend simulation.</span>
      </div>
    </div>
  );
}
