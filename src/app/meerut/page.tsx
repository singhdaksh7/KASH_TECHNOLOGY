import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS_DATA } from "@/lib/locations-data";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";

const locationKey = "meerut";
const location = LOCATIONS_DATA[locationKey];

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: {
    canonical: "/meerut",
  },
  openGraph: {
    title: location.metaTitle,
    description: location.metaDescription,
    url: "https://kash-technology.com/meerut",
  },
};

export default function LocationPage() {
  if (!location) notFound();
  return <LocationPageTemplate location={location} />;
}
