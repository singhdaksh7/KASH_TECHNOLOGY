import { CaseStudy } from "@/types/case-study";
import { GitCommit } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function KeyDecisionsSection({ caseStudy }: Props) {
  if (!caseStudy.decisions || caseStudy.decisions.length === 0) return null;

  return (
    <section className="py-24 px-8 max-w-[1024px] mx-auto border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
          <GitCommit className="text-primary w-8 h-8" />
          Key Engineering Decisions
        </h2>
        <p className="text-muted">Critical architectural and design choices made during development.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {caseStudy.decisions.map((decision, idx) => (
          <div key={idx} className="bg-white/5 border-l-4 border-primary p-6 rounded-r-2xl">
            <h3 className="text-xl font-bold mb-3">{decision.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{decision.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
