import { useState } from "react";
import { STUDENT_RESULTS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { Save, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EvaluationsModule() {
  const [marks, setMarks] = useState<Record<string, number>>(
    STUDENT_RESULTS.reduce((acc, r) => ({ ...acc, [r.id]: r.marksObtained }), {})
  );
  const [saved, setSaved] = useState(false);

  const handleMarkChange = (id: string, val: string) => {
    setMarks(prev => ({ ...prev, [id]: Number(val) }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Evaluations</h2>
          <p className="text-muted text-sm">Enter and manage student grades.</p>
        </div>
        <button 
          onClick={handleSave}
          className={cn(
            "font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all",
            saved ? "bg-green-500/20 text-green-500" : "bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Marks</>}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Student", "Subject", "Total Marks", "Marks Obtained", "Grade", "Remarks"]}>
          {STUDENT_RESULTS.map((result, idx) => (
            <tr key={result.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">Student {idx + 1}</td>
              <td className="px-6 py-4">{result.subject}</td>
              <td className="px-6 py-4">{result.totalMarks}</td>
              <td className="px-6 py-4">
                <input 
                  type="number" 
                  value={marks[result.id]}
                  onChange={(e) => handleMarkChange(result.id, e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 w-20 text-sm focus:outline-none focus:border-primary"
                  max={result.totalMarks}
                />
              </td>
              <td className="px-6 py-4 font-bold text-primary">{result.grade}</td>
              <td className="px-6 py-4">
                <input 
                  type="text" 
                  defaultValue={result.remarks}
                  className="bg-transparent border-b border-transparent focus:border-primary px-2 py-1 text-xs w-full focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
