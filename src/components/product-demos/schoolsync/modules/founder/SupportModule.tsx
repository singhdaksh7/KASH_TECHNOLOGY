import { DemoTable } from "../shared/DemoTable";
import { StatusBadge } from "../shared/StatusBadge";
import { MessageSquare } from "lucide-react";

export function SupportModule() {
  const tickets = [
    { id: "T-1024", school: "Delhi Public School", issue: "Payment gateway integration failing for AMEX cards.", priority: "high", status: "open", date: "2026-07-25" },
    { id: "T-1023", school: "Greenwood Academy", issue: "How to configure custom grading scales?", priority: "low", status: "resolved", date: "2026-07-24" },
    { id: "T-1022", school: "Modern Vidya Niketan", issue: "SMS alerts not delivering to certain carrier networks.", priority: "medium", status: "in_progress", date: "2026-07-23" },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Global Support Desk</h2>
          <p className="text-muted text-sm">Manage tenant support tickets and inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
           <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Open Tickets</p>
           <p className="font-bold text-xl">12</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-center">
           <p className="text-[10px] text-yellow-500 uppercase tracking-wider mb-1">In Progress</p>
           <p className="font-bold text-xl text-yellow-500">5</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
           <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">High Priority</p>
           <p className="font-bold text-xl text-red-500">3</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-center">
           <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Avg Resolution</p>
           <p className="font-bold text-xl text-green-500">4.2h</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Ticket ID", "Tenant", "Issue", "Priority", "Status", "Actions"]}>
          {tickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-mono text-xs">{ticket.id}</td>
              <td className="px-6 py-4 font-bold">{ticket.school}</td>
              <td className="px-6 py-4 text-sm truncate max-w-[200px]">{ticket.issue}</td>
              <td className="px-6 py-4">
                 <StatusBadge status={ticket.priority} type={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'default'} />
              </td>
              <td className="px-6 py-4">
                 <StatusBadge status={ticket.status} type={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'error' : 'warning'} />
              </td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                  <MessageSquare className="w-3 h-3" /> Reply
                </button>
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
