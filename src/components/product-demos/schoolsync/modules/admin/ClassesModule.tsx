import { useState } from "react";
import { MOCK_CLASSES } from "../../schoolsync-data";
import { ClassRecord } from "../../types";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { DemoDrawer } from "../shared/DemoDrawer";
import { StatusBadge } from "../shared/StatusBadge";
import { formatPercent } from "../../../exora/exora-data";

export function ClassesModule() {
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);

  const filteredClasses = MOCK_CLASSES.filter(c => gradeFilter ? c.grade === gradeFilter : true);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Classes & Sections</h2>
          <p className="text-muted text-sm">Manage class structures and assignments.</p>
        </div>
      </div>

      <DemoFilter 
        filters={[
          {
            value: gradeFilter,
            onChange: setGradeFilter,
            placeholder: "All Grades",
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
        <DemoTable headers={["Grade", "Section", "Class Teacher", "Students", "Attendance", "Actions"]}>
          {filteredClasses.map(c => (
            <tr key={c.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">Grade {c.grade}</td>
              <td className="px-6 py-4">{c.section}</td>
              <td className="px-6 py-4">{c.classTeacher}</td>
              <td className="px-6 py-4">{c.studentCount}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={formatPercent(c.attendancePct)} 
                  type={c.attendancePct > 90 ? "success" : "warning"} 
                />
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => setSelectedClass(c)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Summary
                </button>
              </td>
            </tr>
          ))}
          {filteredClasses.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">No classes found matching your criteria.</td>
            </tr>
          )}
        </DemoTable>
      </div>

      <DemoDrawer 
        isOpen={!!selectedClass} 
        onClose={() => setSelectedClass(null)}
        title="Class Summary"
      >
        {selectedClass && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black mb-6">Grade {selectedClass.grade}-{selectedClass.section}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Total Students</p>
                <p className="font-bold text-xl">{selectedClass.studentCount}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Avg Attendance</p>
                <p className="font-bold text-xl">{formatPercent(selectedClass.attendancePct)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold border-b border-white/10 pb-2">Class Details</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Class Teacher</span>
                <span className="font-bold">{selectedClass.classTeacher}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Room</span>
                <span>Room {selectedClass.grade}0{selectedClass.section === "A" ? "1" : "2"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Timetable Status</span>
                <span className="text-tertiary">Active</span>
              </div>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mt-8">
               <p className="text-xs text-primary text-center font-bold">Demo Profile: Data is locally mocked.</p>
            </div>
          </div>
        )}
      </DemoDrawer>
    </div>
  );
}
