import { useState, useMemo } from "react";
import { MOCK_STUDENTS } from "../../schoolsync-data";
import { StudentProfile } from "../../types";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { DemoDrawer } from "../shared/DemoDrawer";
import { StatusBadge } from "../shared/StatusBadge";
import { DetailTabs } from "../shared/DetailTabs";
import { formatPercent } from "../../../exora/exora-data";

export function StudentsModule() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
      const matchesClass = classFilter ? s.grade === classFilter : true;
      return matchesSearch && matchesClass;
    });
  }, [search, classFilter]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Students</h2>
          <p className="text-muted text-sm">Manage student records and profiles.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{MOCK_STUDENTS.length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Total Students</p>
        </div>
      </div>

      <DemoFilter 
        searchPlaceholder="Search by name or roll number..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            value: classFilter,
            onChange: setClassFilter,
            placeholder: "All Classes",
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
        <DemoTable headers={["Name", "Roll No", "Class", "Attendance", "Fee Status", "Actions"]}>
          {filteredStudents.map(student => (
            <tr key={student.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <p className="font-bold">{student.name}</p>
                <p className="text-[10px] text-muted">Guardian: {student.guardianName}</p>
              </td>
              <td className="px-6 py-4 font-mono text-xs">{student.rollNumber}</td>
              <td className="px-6 py-4">{student.grade}-{student.section}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={formatPercent(student.attendancePct)} 
                  type={student.attendancePct > 90 ? "success" : student.attendancePct > 75 ? "warning" : "error"} 
                />
              </td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={student.feeStatus || "unknown"} 
                  type={student.feeStatus === "paid" ? "success" : student.feeStatus === "pending" ? "warning" : "error"} 
                />
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => setSelectedStudent(student)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">No students found matching your criteria.</td>
            </tr>
          )}
        </DemoTable>
      </div>

      <DemoDrawer 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)}
        title="Student Profile"
      >
        {selectedStudent && (
          <StudentDrawerContent student={selectedStudent} />
        )}
      </DemoDrawer>
    </div>
  );
}

function StudentDrawerContent({ student }: { student: StudentProfile }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-black text-primary">
          {student.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold">{student.name}</h3>
          <p className="text-sm text-muted">Admission No: SS{student.id.replace('s', '10')}</p>
        </div>
      </div>

      <DetailTabs 
        tabs={["Overview", "Academics", "Attendance", "Fees"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Overview" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Class</p>
              <p className="font-bold">{student.grade}-{student.section}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Roll Number</p>
              <p className="font-bold">{student.rollNumber}</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Guardian Information</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Name</span>
              <span>{student.guardianName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Phone</span>
              <span>+91 •••••• {student.phone?.slice(-4)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Academics" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Subjects</h4>
            <div className="flex flex-wrap gap-2">
              {["Mathematics", "Science", "English", "Hindi", "Social Science"].map(sub => (
                <span key={sub} className="px-2.5 py-1 bg-white/10 rounded-md text-xs">{sub}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Recent Results</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Mathematics</span><span className="font-bold text-primary">96%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Science</span><span className="font-bold text-primary">91%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">English</span><span className="font-bold text-primary">89%</span></div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Recent Homework</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Math Assignment</span><StatusBadge status="pending" type="warning" /></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Science Worksheet</span><StatusBadge status="submitted" type="success" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Attendance" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Overall Attendance</p>
            <p className="font-bold text-2xl">{formatPercent(student.attendancePct)}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Recent Attendance</h4>
            <div className="flex justify-between text-sm"><span className="text-muted">Today</span><span className="text-green-500 font-bold">Present</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Yesterday</span><span className="text-green-500 font-bold">Present</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Monday</span><span className="text-red-500 font-bold">Absent</span></div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-sm mb-2">Teacher Remarks</h4>
            <p className="text-sm text-muted">Aisha is very attentive but missed Monday due to illness. Needs to catch up on Science notes.</p>
          </div>
        </div>
      )}

      {activeTab === "Fees" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Fee Status</p>
            <p className="font-bold capitalize text-xl">{student.feeStatus}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Recent Payments</h4>
            <div className="flex justify-between text-sm"><span className="text-muted">Term 1 Fee (Paid)</span><span>₹15,000</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Transport Fee (Paid)</span><span>₹2,500</span></div>
          </div>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mt-8">
         <p className="text-xs text-primary text-center font-bold">Demo Profile: Data is locally mocked.</p>
      </div>
    </div>
  );
}
