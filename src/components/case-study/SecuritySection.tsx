import { CaseStudy } from "@/types/case-study";
import { ShieldCheck } from "lucide-react";

interface Props {
  caseStudy: CaseStudy;
}

export function SecuritySection({ caseStudy }: Props) {
  return (
    <section className="py-24 px-8 max-w-[1024px] mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5">
          <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-tertiary w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black mb-4">Security & Reliability</h2>
          <p className="text-muted leading-relaxed">
            Engineering a secure platform requires strict enforcement at every layer. We applied industry-standard patterns to ensure data integrity, safe access, and reliable operations.
          </p>
        </div>
        
        <div className="md:col-span-7 bg-white/5 border border-white/10 p-8 rounded-3xl">
          <ul className="space-y-4">
            {caseStudy.security.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(var(--tertiary),0.8)]"></span>
                <span className="text-foreground leading-relaxed font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
