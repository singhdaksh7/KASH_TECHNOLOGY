
import { MiniLineChart } from "../../charts/MiniLineChart";
import { MiniBarChart } from "../../charts/MiniBarChart";
import { TrendingUp, Users, Database, Globe } from "lucide-react";

export function AnalyticsModule() {
  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1">Global Analytics</h2>
        <p className="text-muted text-sm">System-wide usage and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"><Users className="w-6 h-6"/></div>
            <div>
               <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Daily Active Users</p>
               <p className="font-bold text-xl">42.5k</p>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0"><Globe className="w-6 h-6"/></div>
            <div>
               <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Total API Requests</p>
               <p className="font-bold text-xl">1.2M <span className="text-xs text-muted font-normal">/day</span></p>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0"><TrendingUp className="w-6 h-6"/></div>
            <div>
               <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Avg Session Duration</p>
               <p className="font-bold text-xl">14m 32s</p>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0"><Database className="w-6 h-6"/></div>
            <div>
               <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Storage Consumed</p>
               <p className="font-bold text-xl">842 GB</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="font-bold mb-6">User Growth (Last 30 Days)</h3>
            <MiniLineChart data={[30, 32, 35, 34, 38, 40, 42]} height={200} labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7"]} color="#3b82f6" />
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="font-bold mb-6">Bandwidth Usage</h3>
            <MiniBarChart data={[120, 150, 180, 140, 210, 250, 230]} height={200} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} color="#a855f7" />
         </div>
      </div>
    </div>
  );
}
