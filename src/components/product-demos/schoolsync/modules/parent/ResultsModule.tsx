import { STUDENT_RESULTS } from "../../schoolsync-data";
import { DemoTable } from "../shared/DemoTable";
import { Download } from "lucide-react";

export function ResultsModule() {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Exam Results</h2>
          <p className="text-muted text-sm">Academic performance and report cards.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Download className="w-4 h-4" /> Download Report Card
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <DemoTable headers={["Subject", "Marks Obtained", "Total Marks", "Grade", "Teacher Remarks"]}>
          {STUDENT_RESULTS.map(result => (
            <tr key={result.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-bold">{result.subject}</td>
              <td className="px-6 py-4">{result.marksObtained}</td>
              <td className="px-6 py-4">{result.totalMarks}</td>
              <td className="px-6 py-4 text-primary font-bold">{result.grade}</td>
              <td className="px-6 py-4 text-sm text-muted">{result.remarks}</td>
            </tr>
          ))}
        </DemoTable>
      </div>
    </div>
  );
}
