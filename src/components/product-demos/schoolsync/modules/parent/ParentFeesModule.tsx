import { useState } from "react";
import { MOCK_FEES } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { StatusBadge } from "../shared/StatusBadge";
import { formatCurrency } from "../../../exora/exora-data";
import { ShieldAlert, CreditCard } from "lucide-react";

export function ParentFeesModule() {
  const [feeState, setFeeState] = useState(MOCK_FEES.filter(f => f.studentId === "s1"));
  const [showToast, setShowToast] = useState(false);

  const handleDemoPayment = (id: string) => {
    setFeeState(prev => prev.map(f => f.id === id ? { ...f, status: "paid" } : f));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">Fee & Payments</h2>
        <p className="text-muted text-sm">View invoices and make payments.</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Invoice", "Amount", "Due Date", "Status", "Action"]}>
          {feeState.map(fee => (
            <tr key={fee.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-mono text-xs">{fee.invoiceNumber}</td>
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
                    className="flex items-center gap-2 text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90"
                  >
                    <CreditCard className="w-3 h-3" /> Pay Now
                  </button>
                ) : (
                  <button className="text-xs font-bold text-muted hover:text-white transition-colors">
                    Download Receipt
                  </button>
                )}
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-500 text-xs flex gap-2 transition-opacity duration-300 shadow-2xl backdrop-blur-md ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>Demo Action: Simulated payment. No actual gateway was invoked.</span>
      </div>
    </div>
  );
}
