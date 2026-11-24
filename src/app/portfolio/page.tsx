import type { Metadata } from "next";
import { createCmsRoute } from "@/components/cms/createCmsRoute";
import { PortfolioPage } from "@/components/pages/PortfolioPage";
import { getPortfolioProjects } from "@/lib/cms";
import { toPortfolioCard } from "@/lib/cms/portfolio-cards";

const baseMetadata: Metadata = {
  title: "Portfolio — Selected Work & Case Studies | KASH Technology",
  description: "Explore our recent web platforms, custom apps, software systems, and creative digital projects engineered for business growth.",
  alternates: { canonical: "/portfolio" },
};

/** The project grid is fed by the CMS (admin Portfolio); with no CMS data it is the approved static list. */
async function PortfolioWithData() {
  const projects = await getPortfolioProjects();
  return <PortfolioPage projects={projects.map(toPortfolioCard)} />;
}

const cmsRoute = createCmsRoute({ path: "/portfolio", pageType: "page", Fallback: PortfolioWithData, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
