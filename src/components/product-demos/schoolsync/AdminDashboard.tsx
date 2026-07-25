import { useState } from "react";
import { SchoolSidebar } from "./SchoolSidebar";
import { MetricCard } from "./MetricCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { AttendanceCard } from "./AttendanceCard";
import { TimetableCard } from "./TimetableCard";
import { ModulePreview } from "./ModulePreview";
import { ADMIN_METRICS, ANNOUNCEMENTS, TEACHER_TIMETABLE } from "./schoolsync-data";
import { Users, GraduationCap, CheckCircle2, Wallet } from "lucide-react";

import { StudentsModule } from "./modules/admin/StudentsModule";
import { TeachersModule } from "./modules/admin/TeachersModule";
import { ClassesModule } from "./modules/admin/ClassesModule";
import { AttendanceModule } from "./modules/admin/AttendanceModule";
import { FeesModule } from "./modules/admin/FeesModule";
import { HomeworkModule } from "./modules/admin/HomeworkModule";
import { TimetableModule } from "./modules/admin/TimetableModule";
import { AnnouncementsModule } from "./modules/admin/AnnouncementsModule";
import { ReportsModule } from "./modules/admin/ReportsModule";
import { SettingsModule } from "./modules/admin/SettingsModule";

import { Breadcrumbs } from "./modules/shared/Breadcrumbs";
import { GlobalSearch } from "./modules/shared/GlobalSearch";
import { NotificationCenter } from "./modules/shared/NotificationCenter";
import { UserMenu } from "./modules/shared/UserMenu";

export function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderModule = () => {
    switch (activeModule) {
      case "students": return <StudentsModule />;
      case "teachers": return <TeachersModule />;
      case "classes": return <ClassesModule />;
      case "attendance": return <AttendanceModule />;
      case "fees": return <FeesModule />;
      case "homework": return <HomeworkModule />;
      case "timetable": return <TimetableModule />;
      case "announcements": return <AnnouncementsModule />;
      case "reports": return <ReportsModule />;
      case "settings": return <SettingsModule />;
      default: return <ModulePreview moduleName={activeModule} />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <SchoolSidebar role="admin" activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col h-full bg-[#131313]">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Breadcrumbs module={activeModule} />
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <UserMenu role="admin" />
          </div>
        </header>

        {/* Content */}
        {activeModule === "dashboard" ? (
          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">Welcome back, Principal</h2>
                <p className="text-muted text-sm">Academic Session 2026-2027 • Term 1</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Total Students" value={ADMIN_METRICS.totalStudents.toString()} icon={<Users className="w-5 h-5" />} trend="+4.2%" trendPositive />
              <MetricCard title="Total Staff" value={ADMIN_METRICS.totalTeachers.toString()} icon={<GraduationCap className="w-5 h-5" />} />
              <MetricCard title="Today's Attendance" value={`${ADMIN_METRICS.attendanceToday}%`} icon={<CheckCircle2 className="w-5 h-5" />} trend="-1.2%" trendPositive={false} />
              <MetricCard title="Fees Collected" value={`$${(ADMIN_METRICS.feesCollected / 1000).toFixed(1)}k`} icon={<Wallet className="w-5 h-5" />} trend="+12%" trendPositive />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TimetableCard schedule={TEACHER_TIMETABLE} />
                
                {/* Quick Actions Panel */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Pending Admin Tasks</h3>
                  <div className="space-y-3">
                    {["Review new admission applications (12 pending)", "Approve teacher leave requests (3 pending)", "Generate term 1 fee invoices"].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-error"></div>
                        <span className="text-sm font-medium">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <AttendanceCard percentage={94.5} />
                <AnnouncementCard announcements={ANNOUNCEMENTS} />
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
