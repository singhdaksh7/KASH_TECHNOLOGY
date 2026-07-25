import { useState } from "react";
import { SchoolSidebar } from "./SchoolSidebar";
import { MetricCard } from "./MetricCard";
import { ModulePreview } from "./ModulePreview";
import { FOUNDER_METRICS } from "./schoolsync-data";
import { Users, GraduationCap, Building2, Wallet } from "lucide-react";

import { Breadcrumbs } from "./modules/shared/Breadcrumbs";
import { GlobalSearch } from "./modules/shared/GlobalSearch";
import { NotificationCenter } from "./modules/shared/NotificationCenter";
import { UserMenu } from "./modules/shared/UserMenu";
import { MiniLineChart } from "./charts/MiniLineChart";
import { DonutChart } from "./charts/DonutChart";
import { formatCurrency } from "../exora/exora-data";

import { SchoolsModule } from "./modules/founder/SchoolsModule";
import { SubscriptionsModule } from "./modules/founder/SubscriptionsModule";
import { FeaturesModule } from "./modules/founder/FeaturesModule";
import { AnalyticsModule } from "./modules/founder/AnalyticsModule";
import { SupportModule } from "./modules/founder/SupportModule";
import { HealthModule } from "./modules/founder/HealthModule";
import { AuditModule } from "./modules/founder/AuditModule";

export function FounderDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderModule = () => {
    switch (activeModule) {
      case "schools": return <SchoolsModule />;
      case "subscriptions": return <SubscriptionsModule />;
      case "features": return <FeaturesModule />;
      case "analytics": return <AnalyticsModule />;
      case "support": return <SupportModule />;
      case "health": return <HealthModule />;
      case "audit": return <AuditModule />;
      default: return <ModulePreview moduleName={activeModule} />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <SchoolSidebar role="founder" activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col h-full bg-[#131313]">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Breadcrumbs module={activeModule} />
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <UserMenu role="founder" />
          </div>
        </header>

        {/* Content */}
        {activeModule === "dashboard" ? (
          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">Founder Overview</h2>
                <p className="text-muted text-sm">System-wide metrics and global performance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Total Schools" value={FOUNDER_METRICS.totalSchools.toString()} icon={<Building2 className="w-5 h-5" />} trend="+2 this month" trendPositive />
              <MetricCard title="Total Students" value={FOUNDER_METRICS.totalStudents.toString()} icon={<Users className="w-5 h-5" />} />
              <MetricCard title="Monthly Revenue" value={formatCurrency(FOUNDER_METRICS.monthlyRevenue, "INR")} icon={<Wallet className="w-5 h-5" />} trend="+15%" trendPositive />
              <MetricCard title="Active Trials" value={FOUNDER_METRICS.trialSchools.toString()} icon={<GraduationCap className="w-5 h-5" />} trend="1 converting soon" trendPositive />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Revenue Growth (YTD)</h3>
                  <div className="pt-4">
                    <MiniLineChart 
                      data={[250000, 265000, 280000, 310000, 325000, 340000]} 
                      height={180} 
                      labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} 
                      color="#FF5F1F" 
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg">Recent Platform Activity</h3>
                     <button onClick={() => setActiveModule("audit")} className="text-sm text-primary hover:underline font-bold">View Audit Logs</button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="font-bold text-sm">Delhi Public School upgraded to Enterprise</p>
                        <p className="text-[10px] text-muted">2 hours ago</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded font-bold">Revenue Event</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="font-bold text-sm">New Trial: Greenwood Academy</p>
                        <p className="text-[10px] text-muted">5 hours ago</p>
                      </div>
                      <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded font-bold">Onboarding</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-6">Plan Distribution</h3>
                  <div className="flex justify-center">
                    <DonutChart 
                      data={[
                        { label: "Enterprise", value: 4, color: "#FF5F1F" },
                        { label: "Pro", value: 6, color: "#3b82f6" },
                        { label: "Basic", value: 2, color: "#22c55e" }
                      ]} 
                      size={180} 
                      strokeWidth={24} 
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">API Uptime</span>
                        <span className="text-green-500 font-bold">99.99%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[99.99%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">Database Load</span>
                        <span className="text-yellow-500 font-bold">42%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[42%]"></div></div>
                    </div>
                  </div>
                </div>
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
