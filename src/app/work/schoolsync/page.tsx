import { Metadata } from "next";
import { CASE_STUDIES } from "@/data/case-studies";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyOverview } from "@/components/case-study/CaseStudyOverview";
import { FeatureGrid } from "@/components/case-study/FeatureGrid";
import { InteractiveDemoSection } from "@/components/case-study/InteractiveDemoSection";
import { ArchitectureSection } from "@/components/case-study/ArchitectureSection";
import { SecuritySection } from "@/components/case-study/SecuritySection";
import { TechnologyStack } from "@/components/case-study/TechnologyStack";
import { KeyDecisionsSection } from "@/components/case-study/KeyDecisionsSection";
import { DevelopmentProcess } from "@/components/case-study/DevelopmentProcess";
import { ProjectNavigation } from "@/components/case-study/ProjectNavigation";
import { CaseStudyCTA } from "@/components/case-study/CaseStudyCTA";
import { SchoolSyncDemo } from "@/components/product-demos/schoolsync/SchoolSyncDemo";

const caseStudy = CASE_STUDIES["schoolsync"];

export const metadata: Metadata = {
  title: `${caseStudy.title} | KASH Technologies`,
  description: caseStudy.description,
  openGraph: {
    title: `${caseStudy.title} | KASH Technologies`,
    description: caseStudy.description,
    url: `https://kash-technology.com/work/schoolsync`,
  },
  alternates: {
    canonical: `https://kash-technology.com/work/schoolsync`,
  }
};

export default function SchoolSyncCaseStudyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <CaseStudyHero caseStudy={caseStudy} />
      <CaseStudyOverview caseStudy={caseStudy} />
      <FeatureGrid caseStudy={caseStudy} />
      
      <InteractiveDemoSection disclaimer="All names, records, payments, and attendance values shown in this interactive prototype are entirely fictional.">
        <SchoolSyncDemo />
      </InteractiveDemoSection>
      
      <ArchitectureSection caseStudy={caseStudy} />
      <SecuritySection caseStudy={caseStudy} />
      <TechnologyStack caseStudy={caseStudy} />
      <KeyDecisionsSection caseStudy={caseStudy} />
      <DevelopmentProcess />
      <ProjectNavigation currentSlug={caseStudy.slug} />
      <CaseStudyCTA />
    </main>
  );
}
