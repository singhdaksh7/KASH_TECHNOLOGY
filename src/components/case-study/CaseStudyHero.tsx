"use client";

import { LinkButton } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CaseStudy } from "@/types/case-study";
import { SITE_CONFIG } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { useConsultation } from "@/components/conversion/ConsultationContext";

interface Props {
  caseStudy: CaseStudy;
}

export function CaseStudyHero({ caseStudy }: Props) {
  const { setLeadSource } = useConsultation();

  const getSource = () => {
    if (caseStudy.slug === "exora") return "Exora Case Study";
    if (caseStudy.slug === "schoolsync") return "SchoolSync Case Study";
    if (caseStudy.slug === "crypto-launchpad") return "Crypto Launchpad Case Study";
    return "Unknown";
  };

  return (
    <section className="pt-32 pb-16 px-8 max-w-[1280px] mx-auto">
      <Link href="/#work" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Selected Work
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            {caseStudy.category}
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-foreground">
            {caseStudy.title}
          </h1>
          <p className="text-xl text-muted leading-relaxed max-w-lg">
            {caseStudy.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
            {caseStudy.technologies.slice(0, 5).map(tech => (
              <span key={tech} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-bold text-muted">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 flex flex-col justify-center items-center text-center space-y-6">
          <h3 className="text-2xl font-black">Ready to build?</h3>
          <p className="text-muted">Explore how we engineered this solution, or start a conversation about your own project.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center flex-wrap">
            <LinkButton 
              href="/#contact" 
              variant="primary" 
              className="w-full sm:w-auto flex-1"
              onClick={() => {
                setLeadSource(getSource());
                trackEvent("cta_click", { location: "case_study_hero", label: "start_project" });
              }}
            >
              Start a Project
            </LinkButton>
            <LinkButton 
              href="#demo" 
              variant="outline" 
              className="w-full sm:w-auto flex-1"
              onClick={() => trackEvent("cta_click", { location: "case_study_hero", label: "view_demo" })}
            >
              View Interactive Demo
            </LinkButton>
            {caseStudy.slug === "exora" && SITE_CONFIG.products.exora.externalUrl && (
              <a 
                href={SITE_CONFIG.products.exora.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Visit live project for ${caseStudy.title}`}
                onClick={() => trackEvent("live_project_click", { project: "exora", location: "case_study" })}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-sm"
              >
                Visit Live Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            )}
            {caseStudy.slug === "schoolsync" && SITE_CONFIG.products.schoolsync.externalUrl && (
              <a 
                href={SITE_CONFIG.products.schoolsync.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Visit live project for ${caseStudy.title}`}
                onClick={() => trackEvent("live_project_click", { project: "schoolsync", location: "case_study" })}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-sm"
              >
                Visit Live Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            )}
            {caseStudy.slug === "crypto-launchpad" && SITE_CONFIG.products.launchpad.externalUrl && (
              <a 
                href={SITE_CONFIG.products.launchpad.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Visit live project for ${caseStudy.title}`}
                onClick={() => trackEvent("live_project_click", { project: "crypto-launchpad", location: "case_study" })}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-sm"
              >
                Visit Live Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
