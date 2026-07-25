import { useState } from "react";
import { BarChart3, TrendingUp, Users, BookOpen, ShieldAlert } from "lucide-react";
import { DemoDrawer } from "../shared/DemoDrawer";
import { MiniLineChart } from "../../charts/MiniLineChart";
import { MiniBarChart } from "../../charts/MiniBarChart";

export function ReportsModule() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const reports = [
    { id: "attendance", title: "Attendance Report", icon: Users, desc: "School-wide attendance trends.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "fees", title: "Fee Collection Report", icon: TrendingUp, desc: "Revenue and outstanding dues analysis.", color: "text-green-500", bg: "bg-green-500/10" },
    { id: "academic", title: "Academic Performance", icon: BookOpen, desc: "Class-wise average grades.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "strength", title: "Student Strength", icon: BarChart3, desc: "Enrollment demographics.", color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1">Analytics & Reports</h2>
        <p className="text-muted text-sm">Generate comprehensive reports for administration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => (
          <div 
            key={report.id} 
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer flex gap-4 group"
            onClick={() => setSelectedReport(report.title)}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${report.bg} ${report.color} group-hover:scale-110 transition-transform`}>
              <report.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{report.title}</h3>
              <p className="text-sm text-muted">{report.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <DemoDrawer 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)}
        title={selectedReport || "Report Preview"}
      >
        <div className="space-y-6">
          <div className="h-48 bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col justify-end">
            {selectedReport === "Attendance Report" ? (
              <MiniBarChart data={[85, 92, 88, 95, 91]} height={120} labels={["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]} color="#3b82f6" />
            ) : selectedReport === "Fee Collection Report" ? (
              <MiniLineChart data={[100000, 250000, 320000, 480000, 520000, 750000, 850000]} height={120} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"]} color="#22c55e" />
            ) : selectedReport === "Academic Performance" ? (
              <MiniBarChart data={[75, 82, 88, 90, 85, 92]} height={120} labels={["Math", "Sci", "Eng", "Hist", "Geo", "Comp"]} color="#a855f7" />
            ) : (
              <MiniBarChart data={[450, 480, 520, 600, 750, 850]} height={120} labels={["2021", "2022", "2023", "2024", "2025", "2026"]} color="#FF5F1F" />
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold border-b border-white/10 pb-2">Report Parameters</h4>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary">
              <option>Current Academic Year</option>
              <option>Last Academic Year</option>
              <option>Custom Date Range</option>
            </select>
          </div>

          <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
            Download PDF Report
          </button>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-500 text-xs flex gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p><strong>Demo Mode:</strong> Report generation and downloading are disabled in this frontend simulation.</p>
          </div>
        </div>
      </DemoDrawer>
    </div>
  );
}
