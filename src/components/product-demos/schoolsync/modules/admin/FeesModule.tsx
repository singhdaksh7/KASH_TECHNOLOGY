import { useState, useMemo } from "react";
import { MOCK_FEES } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { StatusBadge } from "../shared/StatusBadge";
import { formatCurrency } from "../../../exora/exora-data";
import { ShieldAlert } from "lucide-react";
import { MiniLineChart } from "../../charts/MiniLineChart";

export function FeesModule() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  
  // Local state for fee payments
  const [feeState, setFeeState] = useState(MOCK_FEES);
  const [showToast, setShowToast] = useState(false);

  const filteredFees = useMemo(() => {
    return feeState.filter(f => {
      const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.invoiceNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? f.status === statusFilter : true;
      const matchesClass = classFilter ? f.grade.includes(classFilter) : true;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [search, statusFilter, classFilter, feeState]);

  const totalCollected = feeState.filter(f => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const totalPending = feeState.filter(f => f.status === "pending").reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = feeState.filter(f => f.status === "overdue").reduce((sum, f) => sum + f.amount, 0);

  const handleDemoPayment = (id: string) => {
    setFeeState(prev => prev.map(f => f.id === id ? { ...f, status: "paid" } : f));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8 h-full flex flex-col relative overflow-y-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Fee Management</h2>
          <p className="text-muted text-sm">Track collections, pending dues, and generate receipts.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Today&apos;s Collection</p>
          <p className="font-bold text-xl">{formatCurrency(48500, "INR")}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Total Collected</p>
          <p className="font-bold text-xl text-green-500">{formatCurrency(totalCollected, "INR")}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-yellow-500 uppercase tracking-wider mb-1">Pending Dues</p>
          <p className="font-bold text-xl text-yellow-500">{formatCurrency(totalPending, "INR")}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Overdue</p>
          <p className="font-bold text-xl text-red-500">{formatCurrency(totalOverdue, "INR")}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6">
        <h3 className="font-bold mb-4 text-sm">Monthly Collection Progress</h3>
        <MiniLineChart 
          data={[100000, 250000, 320000, 480000, 520000, 750000, 850000]} 
          height={60} 
          labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"]}
        />
      </div>

      <DemoFilter 
        searchPlaceholder="Search by student or invoice..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Status",
            options: [
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Overdue", value: "overdue" }
            ]
          },
          {
            value: classFilter,
            onChange: setClassFilter,
            placeholder: "All Classes",
            options: [
              { label: "Grade 9", value: "9" },
              { label: "Grade 10", value: "10" },
              { label: "Grade 11", value: "11" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Invoice", "Student", "Class", "Amount", "Due Date", "Status", "Action"]}>
          {filteredFees.map(fee => (
            <tr key={fee.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-mono text-xs">{fee.invoiceNumber}</td>
              <td className="px-6 py-4 font-bold">{fee.studentName}</td>
              <td className="px-6 py-4">{fee.grade}</td>
              <td className="px-6 py-4 font-bold">{formatCurrency(fee.amount, "INR")}</td>
              <td className="px-6 py-4 text-xs">{new Date(fee.dueDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={fee.status} 
                  type={fee.status === "paid" ? "success" : fee.status === "pending" ? "warning" : "error"} 
                />
              </td>
              <td className="px-6 py-4">
                {fee.status !== "paid" ? (
                  <button 
                    onClick={() => handleDemoPayment(fee.id)}
                    className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90"
                  >
                    Demo Pay
                  </button>
                ) : (
                  <span className="text-xs text-muted">Receipt Sent</span>
                )}
              </td>
            </tr>
          ))}
          {filteredFees.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-muted text-sm">No records found.</td>
            </tr>
          )}
        </DemoTable>
      </div>

      {/* Demo Notice Toast */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-500 text-xs flex gap-2 transition-opacity duration-300 shadow-2xl backdrop-blur-md ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>Demo Action: Payment recorded locally. No actual gateway was invoked.</span>
      </div>
    </div>
  );
}
