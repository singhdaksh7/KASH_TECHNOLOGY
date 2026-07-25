import { LayoutDashboard, Users, BookOpen, Clock, CheckSquare, Bell, FileText, Settings, Wallet } from "lucide-react";
import { SchoolSyncRole } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  role: SchoolSyncRole;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export function SchoolSidebar({ role, activeModule, onModuleChange }: Props) {
  const adminModules = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "fees", label: "Fees", icon: Wallet },
    { id: "homework", label: "Homework", icon: FileText },
    { id: "timetable", label: "Timetable", icon: Clock },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const teacherModules = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-classes", label: "My Classes", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "homework", label: "Homework", icon: FileText },
    { id: "evaluations", label: "Evaluations", icon: CheckSquare },
    { id: "timetable", label: "Timetable", icon: Clock },
    { id: "announcements", label: "Announcements", icon: Bell },
  ];

  const parentModules = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-child", label: "My Child", icon: Users },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "homework", label: "Homework", icon: FileText },
    { id: "fees", label: "Fees", icon: Wallet },
    { id: "results", label: "Results", icon: BookOpen },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const founderModules = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "schools", label: "Schools", icon: BookOpen },
    { id: "subscriptions", label: "Subscriptions", icon: Wallet },
    { id: "features", label: "Feature Control", icon: Settings },
    { id: "analytics", label: "Analytics", icon: FileText },
    { id: "support", label: "Support", icon: Users },
    { id: "health", label: "System Health", icon: CheckSquare },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  const modules = role === "founder" ? founderModules : role === "admin" ? adminModules : role === "teacher" ? teacherModules : parentModules;

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-border h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="font-black text-xl text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">S</div>
          SchoolSync
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {modules.map((m) => {
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModuleChange(m.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-muted">
            {role.substring(0, 1).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold capitalize">{role}</p>
            <p className="text-[10px] text-muted">Demo Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
