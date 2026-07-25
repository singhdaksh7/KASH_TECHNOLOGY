import { useState } from "react";
import { MOCK_SCHOOLS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { DemoFilter } from "../shared/DemoFilter";
import { StatusBadge } from "../shared/StatusBadge";
import { DemoDrawer } from "../shared/DemoDrawer";
import { DetailTabs } from "../shared/DetailTabs";
import { DemoSchool } from "../../types";
import { ShieldAlert, Users, Calendar } from "lucide-react";

export function SchoolsModule() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<DemoSchool | null>(null);

  const filteredSchools = MOCK_SCHOOLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Onboarded Schools</h2>
          <p className="text-muted text-sm">Manage tenant instances and configurations.</p>
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
              { label: "Trial", value: "trial" },
              { label: "Suspended", value: "suspended" }
            ]
          }
        ]}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["School Name", "Plan", "Students", "Status", "Renewal Date", "Actions"]}>
          {filteredSchools.map(school => (
            <tr key={school.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{school.name}</td>
              <td className="px-6 py-4">{school.plan}</td>
              <td className="px-6 py-4 font-mono">{school.studentCount.toLocaleString()}</td>
              <td className="px-6 py-4">
                <StatusBadge 
                  status={school.status} 
                  type={school.status === "active" ? "success" : school.status === "trial" ? "warning" : "error"} 
                />
              </td>
              <td className="px-6 py-4 text-xs">{new Date(school.renewalDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => setSelectedSchool(school)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Manage Tenant
                </button>
              </td>
            </tr>
          ))}
          {filteredSchools.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">No schools found.</td>
            </tr>
          )}
        </DemoTable>
      </div>

      <DemoDrawer 
        isOpen={!!selectedSchool} 
        onClose={() => setSelectedSchool(null)}
        title="Tenant Management"
      >
        {selectedSchool && (
          <SchoolDrawerContent school={selectedSchool} />
        )}
      </DemoDrawer>
    </div>
  );
}

function SchoolDrawerContent({ school }: { school: DemoSchool }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold">{school.name}</h3>
        <p className="text-sm text-muted">Tenant ID: {school.id}</p>
      </div>

      <DetailTabs 
        tabs={["Overview", "Database", "Security"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Overview" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Students</p>
                <p className="font-bold">{school.studentCount.toLocaleString()}</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Renewal</p>
                <p className="font-bold">{new Date(school.renewalDate).toLocaleDateString()}</p>
             </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
             <h4 className="font-bold text-sm">Subscription Tier</h4>
             <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-primary">{school.plan}</span>
                <StatusBadge 
                  status={school.status} 
                  type={school.status === "active" ? "success" : school.status === "trial" ? "warning" : "error"} 
                />
             </div>
          </div>
        </div>
      )}

      {activeTab === "Database" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
             <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Storage Used</p>
                <div className="flex justify-between items-end mb-1">
                   <span className="font-bold">4.2 GB</span>
                   <span className="text-xs text-muted">of 10 GB (Plan Limit)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-[42%]"></div>
                </div>
             </div>
             <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Last Backup</p>
                <p className="font-bold text-sm">Today at 02:00 AM UTC</p>
             </div>
          </div>
          <button className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
            Trigger Manual Backup
          </button>
        </div>
      )}

      {activeTab === "Security" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
             <div className="flex justify-between items-center">
                <div>
                   <p className="font-bold text-sm">Force Password Reset</p>
                   <p className="text-xs text-muted">Require all users to reset passwords on next login.</p>
                </div>
                <button className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">Execute</button>
             </div>
             <div className="flex justify-between items-center">
                <div>
                   <p className="font-bold text-sm text-red-500">Suspend Tenant</p>
                   <p className="text-xs text-muted">Temporarily block all access to this instance.</p>
                </div>
                <button className="bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors">Suspend</button>
             </div>
           </div>
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mt-8">
         <p className="text-xs text-yellow-500 flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0" /> Super Admin Preview. No actions will be performed.</p>
      </div>
    </div>
  );
}
