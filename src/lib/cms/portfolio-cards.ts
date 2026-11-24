import type { Project } from "@/data/approved-projects";
import type { ProjectDocument } from "./types";

const tagFor = (category: string) => (/mobile|app\b/i.test(category) ? "Mobile Apps" : /web|site|commerce|portal/i.test(category) ? "Websites" : "Software / SaaS");

/** Canonical project → the approved portfolio card shape. */
export function toPortfolioCard(p: ProjectDocument): Project {
  return {
    title: p.title,
    category: p.category || "Project",
    tag: tagFor(p.category),
    statusType: p.projectStatus,
    description: p.description,
    image: p.thumbnail || p.hero || "/images/projects/exora-preview.png",
    href: p.internalHref || `/work/${p.slug}`,
  };
}
