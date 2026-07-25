import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface Props {
  currentSlug: string;
}

export function ProjectNavigation({ currentSlug }: Props) {
  const projects = [
    { slug: "exora", ...SITE_CONFIG.products.exora },
    { slug: "schoolsync", ...SITE_CONFIG.products.schoolsync },
    { slug: "crypto-launchpad", ...SITE_CONFIG.products.launchpad },
  ];

  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  const prevProject = projects[currentIndex - 1] || projects[projects.length - 1];
  const nextProject = projects[currentIndex + 1] || projects[0];

  return (
    <section className="py-16 px-8 max-w-[1280px] mx-auto border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
      <Link 
        href={prevProject.caseStudyPath} 
        className="flex items-center gap-4 group text-left w-full md:w-1/3 hover:bg-white/5 p-4 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Previous Project</p>
          <p className="font-bold text-lg group-hover:text-primary transition-colors">{prevProject.name}</p>
        </div>
      </Link>

      <div className="w-full md:w-1/3 text-center">
        <Link href="/#work" className="inline-block px-6 py-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-colors">
          View All Work
        </Link>
      </div>

      <Link 
        href={nextProject.caseStudyPath} 
        className="flex items-center justify-end gap-4 group text-right w-full md:w-1/3 hover:bg-white/5 p-4 rounded-xl transition-colors"
      >
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Next Project</p>
          <p className="font-bold text-lg group-hover:text-primary transition-colors">{nextProject.name}</p>
        </div>
        <ArrowRight className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
      </Link>
    </section>
  );
}
