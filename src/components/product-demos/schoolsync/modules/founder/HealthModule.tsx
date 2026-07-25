import { Activity, Server, Database, Globe, CheckCircle2, AlertTriangle } from "lucide-react";

export function HealthModule() {
  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black mb-1">System Health</h2>
          <p className="text-muted text-sm">Real-time infrastructure monitoring.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl font-bold text-sm">
           <CheckCircle2 className="w-4 h-4" /> All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-1">Load Balancers</h3>
            <p className="text-sm text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-1">Application Servers</h3>
            <p className="text-sm text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy (6 instances)</p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center border-yellow-500/30">
            <Database className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="font-bold mb-1">Primary Database</h3>
            <p className="text-sm text-yellow-500 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High Load (78%)</p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <Activity className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-1">Background Workers</h3>
            <p className="text-sm text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Processing</p>
         </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
         <h3 className="font-bold text-lg mb-6">Recent Incidents</h3>
         <div className="space-y-4">
            <div className="border-l-2 border-yellow-500 pl-4 py-1">
               <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Elevated Database Latency</h4>
                  <span className="text-xs text-muted">Oct 14, 14:30 UTC</span>
               </div>
               <p className="text-sm text-muted">Primary database experienced high CPU utilization during bulk report generation. Auto-scaling resolved the issue within 5 minutes.</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4 py-1 opacity-50">
               <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Scheduled Maintenance Completed</h4>
                  <span className="text-xs text-muted">Oct 10, 02:00 UTC</span>
               </div>
               <p className="text-sm text-muted">Database security patching completed successfully with zero downtime.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
