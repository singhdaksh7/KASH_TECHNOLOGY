import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/cms";
import { InsightsIndex } from "@/components/insights/InsightsIndex";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const baseMetadata: Metadata = {
  title: "Insights & Engineering Perspectives | KASH Technology",
  description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses in Delhi NCR and Western UP.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights & Engineering Perspectives | KASH Technology",
    description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses.",
    url: "https://kash-technology.com/insights",
  },
};


// Server wrapper: articles come from the CMS repository (static fallback when the CMS is empty/unavailable);
// the approved redesigned list UI lives unchanged in InsightsIndex (client, for category filtering).
async function InsightsPage() {
  const articles = await getPublishedArticles();
  return <InsightsIndex articles={articles} />;
}

const cmsRoute = createCmsRoute({ path: "/insights", pageType: "page", Fallback: InsightsPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
