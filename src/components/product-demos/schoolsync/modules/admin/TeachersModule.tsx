import { useState, useMemo } from "react";
import { MOCK_TEACHERS } from "../../schoolsync-data";
import { TeacherProfile } from "../../types";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { DemoDrawer } from "../shared/DemoDrawer";
import { StatusBadge } from "../shared/StatusBadge";
import { DetailTabs } from "../shared/DetailTabs";

export function TeachersModule() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  const filteredTeachers = useMemo(() => {
    return MOCK_TEACHERS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subjectFilter ? t.subject === subjectFilter : true;
      return matchesSearch && matchesSubject;
    });
  }, [search, subjectFilter]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Teachers & Staff</h2>
          <p className="text-muted text-sm">Manage teaching staff, assignments, and attendance.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{MOCK_TEACHERS.length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Total Staff</p>
        </div>
      </div>

      <DemoFilter 
        searchPlaceholder="Search by name..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            value: subjectFilter,
            onChange: setSubjectFilter,
            placeholder: "All Subjects",
            options: [
              { label: "Mathematics", value: "Mathematics" },
              { label: "Physics", value: "Physics" },
              { label: "Chemistry", value: "Chemistry" },
              { label: "English", value: "English" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Name", "Subject", "Assigned Classes", "Attendance", "Actions"]}>
          {filteredTeachers.map(teacher => (
            <tr key={teacher.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <p className="font-bold">{teacher.name}</p>
                <p className="text-[10px] text-muted">{teacher.email}</p>
              </td>
              <td className="px-6 py-4">{teacher.subject}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1 flex-wrap">
                  {teacher.assignedClasses.map(c => (
                    <span key={c} className="bg-white/10 px-2 py-0.5 rounded text-[10px]">{c}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={teacher.attendanceStatus} 
                  type={teacher.attendanceStatus === "present" ? "success" : teacher.attendanceStatus === "absent" ? "error" : "warning"} 
                />
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => setSelectedTeacher(teacher)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
          {filteredTeachers.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-muted text-sm">No teachers found matching your criteria.</td>
            </tr>
          )}
        </DemoTable>
      </div>

      <DemoDrawer 
        isOpen={!!selectedTeacher} 
        onClose={() => setSelectedTeacher(null)}
        title="Teacher Profile"
      >
        {selectedTeacher && (
          <TeacherDrawerContent teacher={selectedTeacher} />
        )}
      </DemoDrawer>
    </div>
  );
}

function TeacherDrawerContent({ teacher }: { teacher: TeacherProfile }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-black text-primary">
          {teacher.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold">{teacher.name}</h3>
          <p className="text-sm text-muted">Employee ID: EMP{teacher.id.replace('tr', '20')}</p>
        </div>
      </div>

      <DetailTabs 
        tabs={["Overview", "Schedule", "Workload"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Overview" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Department</p>
              <p className="font-bold">{teacher.subject}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Employment</p>
              <p className="font-bold">Full-Time</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Contact Information</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Email</span>
              <span>{teacher.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Phone</span>
              <span>+91 •••••• {teacher.phone?.slice(-4)}</span>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Today&apos;s Attendance</p>
            <StatusBadge 
              status={teacher.attendanceStatus} 
              type={teacher.attendanceStatus === "present" ? "success" : teacher.attendanceStatus === "absent" ? "error" : "warning"} 
            />
          </div>
        </div>
      )}

      {activeTab === "Schedule" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Assigned Classes</h4>
            <div className="flex flex-wrap gap-2">
              {teacher.assignedClasses.map(c => (
                <div key={c} className="bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                  Grade {c}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Today&apos;s Lectures</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-muted">08:30 AM</span>
                <span className="font-bold">Grade 10-A</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-muted">11:00 AM</span>
                <span className="font-bold">Grade 9-B</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">01:45 PM</span>
                <span className="font-bold">Grade 11-A</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Workload" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Weekly Lectures</p>
              <p className="font-bold text-2xl text-primary">24</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Pending Review</p>
              <p className="font-bold text-2xl text-yellow-500">12</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-sm">Recent Evaluations</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Mid-term Papers (10-A)</span><StatusBadge status="completed" type="success" /></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Weekly Test (9-B)</span><StatusBadge status="pending" type="warning" /></div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mt-8">
         <p className="text-xs text-primary text-center font-bold">Demo Profile: Data is locally mocked.</p>
      </div>
    </div>
  );
}
