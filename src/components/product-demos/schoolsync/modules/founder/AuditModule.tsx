import { DemoTable } from "../shared/DemoTable";

export function AuditModule() {
  const logs = [
    { id: "L-9982", user: "system", action: "Tenant Creation", resource: "Delhi Public School", timestamp: "2026-07-25 10:23:41 UTC", status: "success" },
    { id: "L-9981", user: "admin@greenwood", action: "Failed Login", resource: "Auth System", timestamp: "2026-07-25 09:15:22 UTC", status: "failure" },
    { id: "L-9980", user: "founder@schoolsync", action: "Feature Toggle", resource: "AI Grading (Enabled)", timestamp: "2026-07-24 16:45:00 UTC", status: "success" },
    { id: "L-9979", user: "system", action: "Automated Backup", resource: "Database Cluster B", timestamp: "2026-07-24 02:00:00 UTC", status: "success" },
    { id: "L-9978", user: "admin@mvn", action: "Data Export", resource: "Term 1 Results", timestamp: "2026-07-23 11:20:15 UTC", status: "success" },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">Security Audit Logs</h2>
        <p className="text-muted text-sm">Immutable record of system-wide administrative actions.</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white/5 border border-white/10 rounded-2xl">
        <DemoTable headers={["Log ID", "User / Actor", "Action", "Resource", "Timestamp", "Status"]}>
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
              <td className="px-6 py-4 font-mono text-xs text-muted">{log.id}</td>
              <td className="px-6 py-4 font-mono text-xs">{log.user}</td>
              <td className="px-6 py-4 font-bold text-sm">{log.action}</td>
              <td className="px-6 py-4 text-sm">{log.resource}</td>
              <td className="px-6 py-4 text-xs text-muted">{log.timestamp}</td>
              <td className="px-6 py-4">
                 <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${log.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {log.status}
                 </span>
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
