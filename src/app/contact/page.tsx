import type { Metadata } from "next";
import { createCmsRoute } from "@/components/cms/createCmsRoute";
import { ContactPage } from "@/components/pages/ContactPage";

const baseMetadata: Metadata = {
  title: "Contact KASH Technology — Start Your Project",
  description: "Tell us about your project. KASH Technology builds websites, apps, custom software, content and digital marketing for businesses across Delhi NCR, Western UP and beyond.",
  alternates: { canonical: "/contact" },
};

// CMS progressive migration: a published CMS page for this path wins; otherwise the approved redesigned page renders.
const cmsRoute = createCmsRoute({ path: "/contact", pageType: "page", Fallback: ContactPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
