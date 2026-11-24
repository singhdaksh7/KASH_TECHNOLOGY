import type { ProjectStatus } from "@/lib/cms/types";

const STYLES: Record<ProjectStatus, string> = {
  "REAL PROJECT": "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  PROTOTYPE: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  "IN DEVELOPMENT": "bg-blue-500/15 text-blue-600 border-blue-500/30",
  STAGING: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  CONCEPT: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

/** Truthfulness label: every project is explicitly a real project, prototype or concept. */
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${STYLES[status] ?? STYLES.CONCEPT}`}>
      {status}
    </span>
  );
}
