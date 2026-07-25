import { CaseStudy } from "@/types/case-study";
import { Target, CheckCircle2 } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function CaseStudyOverview({ caseStudy }: Props) {
  return (
    <section className="py-24 px-8 max-w-[1024px] mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <Target className="w-8 h-8 text-error" />
            The Problem
          </h2>
          <ul className="space-y-4">
            {caseStudy.problem.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-error/50 mt-2 shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-tertiary" />
            The Solution
          </h2>
          <ul className="space-y-4">
            {caseStudy.solution.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary/50 mt-2 shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
