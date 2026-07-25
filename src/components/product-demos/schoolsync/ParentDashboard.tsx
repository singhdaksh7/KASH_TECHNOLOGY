import { useState } from "react";
import { SchoolSidebar } from "./SchoolSidebar";
import { MetricCard } from "./MetricCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { TimetableCard } from "./TimetableCard";
import { ModulePreview } from "./ModulePreview";
import { DUMMY_STUDENT, ANNOUNCEMENTS, STUDENT_TIMETABLE } from "./schoolsync-data";
import { Clock, Calculator, ScrollText, CheckSquare } from "lucide-react";
import { formatPercent } from "../exora/exora-data";

import { ChildProfileModule } from "./modules/parent/ChildProfileModule";
import { ParentAttendanceModule } from "./modules/parent/ParentAttendanceModule";
import { ParentHomeworkModule } from "./modules/parent/ParentHomeworkModule";
import { ParentFeesModule } from "./modules/parent/ParentFeesModule";
import { ResultsModule } from "./modules/parent/ResultsModule";
import { ParentAnnouncementsModule } from "./modules/parent/ParentAnnouncementsModule";
import { NotificationsModule } from "./modules/parent/NotificationsModule";

import { Breadcrumbs } from "./modules/shared/Breadcrumbs";
import { GlobalSearch } from "./modules/shared/GlobalSearch";
import { NotificationCenter } from "./modules/shared/NotificationCenter";
import { UserMenu } from "./modules/shared/UserMenu";

export function ParentDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderModule = () => {
    switch (activeModule) {
      case "my_child": return <ChildProfileModule />;
      case "attendance": return <ParentAttendanceModule />;
      case "homework": return <ParentHomeworkModule />;
      case "fees": return <ParentFeesModule />;
      case "results": return <ResultsModule />;
      case "announcements": return <ParentAnnouncementsModule />;
      case "notifications": return <NotificationsModule />;
      default: return <ModulePreview moduleName={activeModule} />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <SchoolSidebar role="parent" activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col h-full bg-[#131313]">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Breadcrumbs module={activeModule} />
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <UserMenu role="parent" />
          </div>
        </header>

        {/* Content */}
        {activeModule === "dashboard" ? (
          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">
                  {DUMMY_STUDENT.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-1">{DUMMY_STUDENT.name}</h2>
                  <p className="text-muted text-sm">Grade {DUMMY_STUDENT.grade}-{DUMMY_STUDENT.section} • Roll No: {DUMMY_STUDENT.rollNumber}</p>
                </div>
              </div>
              <button 
                className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
                onClick={() => setActiveModule("fees")}
              >
                Pay Fees
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard title="Overall Attendance" value={formatPercent(DUMMY_STUDENT.attendancePct)} icon={<CheckSquare className="w-5 h-5" />} trend="Excellent" trendPositive />
              <MetricCard title="Pending Homework" value="3" icon={<Clock className="w-5 h-5" />} trend="Due tomorrow" trendPositive={false} />
              <MetricCard title="Next Exam" value="Oct 15" icon={<ScrollText className="w-5 h-5" />} trend="Mid-terms" trendPositive />
              <MetricCard title="Fee Status" value="Paid" icon={<Calculator className="w-5 h-5" />} trend="Next due: Jan 15" trendPositive />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TimetableCard schedule={STUDENT_TIMETABLE} />
                
                {/* Academic Progress */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Academic Progress</h3>
                    <button onClick={() => setActiveModule("results")} className="text-sm text-primary hover:underline font-bold">View Report Card</button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { subject: "Mathematics", grade: "A+", pct: 95, color: "bg-blue-500" },
                      { subject: "Science", grade: "A", pct: 88, color: "bg-green-500" },
                      { subject: "English", grade: "A-", pct: 82, color: "bg-yellow-500" },
                    ].map((subj, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-24 font-bold text-sm">{subj.subject}</div>
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${subj.color}`} style={{ width: `${subj.pct}%` }}></div>
                        </div>
                        <div className="w-8 text-right font-bold text-sm">{subj.grade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <AnnouncementCard announcements={ANNOUNCEMENTS.filter(a => a.audience === "all" || a.audience === "parents")} />
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
