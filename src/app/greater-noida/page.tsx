import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS_DATA } from "@/lib/locations-data";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";

const locationKey = "greater-noida";
const location = LOCATIONS_DATA[locationKey];

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: {
    canonical: "/greater-noida",
  },
  openGraph: {
    title: location.metaTitle,
    description: location.metaDescription,
    url: "https://kash-technology.com/greater-noida",
  },
};

export default function LocationPage() {
  if (!location) notFound();
  return <LocationPageTemplate location={location} />;
}
