import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/cms";
import { InsightsIndex } from "@/components/insights/InsightsIndex";

export const metadata: Metadata = {
  title: "Insights & Engineering Perspectives | KASH Technology",
  description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses in Delhi NCR and Western UP.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights & Engineering Perspectives | KASH Technology",
    description: "Practical engineering blueprints, software architecture insights, and technology strategy for growing businesses.",
    url: "https://kash-technology.com/insights",
  },
};

export const revalidate = 60;

// Server wrapper: articles come from the CMS repository (static fallback when the CMS is empty/unavailable);
// the approved redesigned list UI lives unchanged in InsightsIndex (client, for category filtering).
export default async function InsightsPage() {
  const articles = await getPublishedArticles();
  return <InsightsIndex articles={articles} />;
}
