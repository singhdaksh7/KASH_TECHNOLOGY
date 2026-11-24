import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS_DATA } from "@/lib/locations-data";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";
import { createCmsRoute } from "@/components/cms/createCmsRoute";

const locationKey = "western-up";
const location = LOCATIONS_DATA[locationKey];

const baseMetadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: {
    canonical: "/western-up",
  },
  openGraph: {
    title: location.metaTitle,
    description: location.metaDescription,
    url: "https://kash-technology.com/western-up",
  },
};

function LocationPage() {
  if (!location) notFound();
  return <LocationPageTemplate location={location} />;
}

// CMS progressive migration: a published CMS page for this path wins; otherwise the page above renders unchanged.
const cmsRoute = createCmsRoute({ path: "/western-up", pageType: "location", Fallback: LocationPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
