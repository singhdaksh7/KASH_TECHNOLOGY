import type { Metadata } from "next";
import { createCmsRoute } from "@/components/cms/createCmsRoute";
import { AboutPage } from "@/components/pages/AboutPage";

const baseMetadata: Metadata = {
  title: "About Us — Full-Service Digital Agency | KASH Technology",
  description: "Learn about KASH Technology's philosophy. We are a full-service digital agency combining engineering, creative content, marketing, and automation.",
  alternates: { canonical: "/about" },
};

// CMS progressive migration: a published CMS page for this path wins; otherwise the approved redesigned page renders.
const cmsRoute = createCmsRoute({ path: "/about", pageType: "page", Fallback: AboutPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
