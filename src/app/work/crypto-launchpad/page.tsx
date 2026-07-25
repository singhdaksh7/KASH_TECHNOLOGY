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
import { LaunchpadDemo } from "@/components/product-demos/launchpad/LaunchpadDemo";

const caseStudy = CASE_STUDIES["crypto-launchpad"];

export const metadata: Metadata = {
  title: `${caseStudy.title} | KASH Technologies`,
  description: caseStudy.description,
  openGraph: {
    title: `${caseStudy.title} | KASH Technologies`,
    description: caseStudy.description,
    url: `https://kash-technology.com/work/crypto-launchpad`,
  },
  alternates: {
    canonical: `https://kash-technology.com/work/crypto-launchpad`,
  }
};

export default function LaunchpadCaseStudyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <CaseStudyHero caseStudy={caseStudy} />
      <CaseStudyOverview caseStudy={caseStudy} />
      <FeatureGrid caseStudy={caseStudy} />
      
      <InteractiveDemoSection disclaimer="This prototype is a safe frontend simulation. It does not connect a real wallet, deploy contracts, or accept funds on the Binance Smart Chain.">
        <div className="w-full max-w-[1440px]">
          <LaunchpadDemo />
        </div>
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
