import { useState } from "react";
import { SchoolSidebar } from "./SchoolSidebar";
import { MetricCard } from "./MetricCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { TimetableCard } from "./TimetableCard";
import { ModulePreview } from "./ModulePreview";
import { TEACHER_METRICS, ANNOUNCEMENTS, TEACHER_TIMETABLE } from "./schoolsync-data";
import { Users, BookOpen, ClipboardList } from "lucide-react";

import { MyClassesModule } from "./modules/teacher/MyClassesModule";
import { TeacherAttendanceModule } from "./modules/teacher/TeacherAttendanceModule";
import { TeacherHomeworkModule } from "./modules/teacher/TeacherHomeworkModule";
import { EvaluationsModule } from "./modules/teacher/EvaluationsModule";
import { TeacherTimetableModule } from "./modules/teacher/TeacherTimetableModule";
import { TeacherAnnouncementsModule } from "./modules/teacher/TeacherAnnouncementsModule";

import { Breadcrumbs } from "./modules/shared/Breadcrumbs";
import { GlobalSearch } from "./modules/shared/GlobalSearch";
import { NotificationCenter } from "./modules/shared/NotificationCenter";
import { UserMenu } from "./modules/shared/UserMenu";

export function TeacherDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderModule = () => {
    switch (activeModule) {
      case "my_classes": return <MyClassesModule />;
      case "attendance": return <TeacherAttendanceModule />;
      case "homework": return <TeacherHomeworkModule />;
      case "evaluations": return <EvaluationsModule />;
      case "timetable": return <TeacherTimetableModule />;
      case "announcements": return <TeacherAnnouncementsModule />;
      default: return <ModulePreview moduleName={activeModule} />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <SchoolSidebar role="teacher" activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col h-full bg-[#131313]">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Breadcrumbs module={activeModule} />
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <UserMenu role="teacher" />
          </div>
        </header>

        {/* Content */}
        {activeModule === "dashboard" ? (
          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">Welcome, Ravi Sharma</h2>
                <p className="text-muted text-sm">Mathematics Department</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                  Mark Attendance
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Total Students" value={TEACHER_METRICS.totalStudents.toString()} icon={<Users className="w-5 h-5" />} />
              <MetricCard title="Classes Today" value={TEACHER_METRICS.classesToday.toString()} icon={<BookOpen className="w-5 h-5" />} />
              <MetricCard title="Assignments to Grade" value={TEACHER_METRICS.assignmentsToGrade.toString()} icon={<ClipboardList className="w-5 h-5" />} trend="+5 since yesterday" trendPositive={false} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TimetableCard schedule={TEACHER_TIMETABLE} />
                
                {/* Pending Actions */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Pending Tasks</h3>
                  <div className="space-y-3">
                    {["Grade Grade 10-A Mathematics Midterms", "Submit weekly lesson plan", "Review PTA meeting notes"].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0"></div>
                        <span className="text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <AnnouncementCard announcements={ANNOUNCEMENTS.filter(a => a.audience === "all" || a.audience === "teachers")} />
              </div>
            </div>
          </main>
        ) : (
          renderModule()
        )}
      </div>
    </div>
  );
}
