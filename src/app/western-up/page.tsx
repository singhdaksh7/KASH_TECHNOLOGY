import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS_DATA } from "@/lib/locations-data";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";

const locationKey = "western-up";
const location = LOCATIONS_DATA[locationKey];

export const metadata: Metadata = {
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

export default function LocationPage() {
  if (!location) notFound();
  return <LocationPageTemplate location={location} />;
}
