import { useState } from "react";
import { MOCK_SUBSCRIPTIONS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { StatusBadge } from "../shared/StatusBadge";
import { formatCurrency } from "../../../exora/exora-data";

export function SubscriptionsModule() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => {
    const matchesSearch = s.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalMRR = MOCK_SUBSCRIPTIONS.filter(s => s.status === "active").reduce((sum, s) => sum + s.mrr, 0);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Billing & Subscriptions</h2>
          <p className="text-muted text-sm">Manage tenant billing, plans, and revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Total MRR</p>
          <p className="font-bold text-xl text-green-500">{formatCurrency(totalMRR, "INR")}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Active Subscriptions</p>
          <p className="font-bold text-xl">{MOCK_SUBSCRIPTIONS.filter(s => s.status === "active").length}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-yellow-500 uppercase tracking-wider mb-1">Past Due</p>
          <p className="font-bold text-xl text-yellow-500">{MOCK_SUBSCRIPTIONS.filter(s => s.status === "past_due").length}</p>
        </div>
      </div>

      <DemoFilter 
        searchPlaceholder="Search schools..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Past Due", value: "past_due" },
              { label: "Trial", value: "trial" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["School Name", "Plan", "MRR", "Status", "Next Billing", "Actions"]}>
          {filteredSubscriptions.map(sub => (
            <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{sub.schoolName}</td>
              <td className="px-6 py-4">{sub.plan}</td>
              <td className="px-6 py-4 font-bold">{formatCurrency(sub.mrr, "INR")}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={sub.status} 
                  type={sub.status === "active" ? "success" : sub.status === "trial" ? "warning" : "error"} 
                />
              </td>
              <td className="px-6 py-4 text-xs">{new Date(sub.nextBilling).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <button className="text-xs font-bold text-primary hover:underline">
                  View Invoices
                </button>
              </td>
            </tr>
          ))}
          {filteredSubscriptions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">No subscriptions found.</td>
            </tr>
          )}
        </DemoTable>
      </div>
    </div>
  );
}
