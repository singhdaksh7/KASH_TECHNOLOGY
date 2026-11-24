import type { Metadata } from "next";
import { createCmsRoute } from "@/components/cms/createCmsRoute";
import { ServicesPage } from "@/components/pages/ServicesPage";

const baseMetadata: Metadata = {
  title: "Services — Custom Technology Services for Growing Businesses | KASH Technology",
  description: "End-to-end technology services: Web Development, Mobile Apps, Custom Software, AI Automation, ERP / CRM Systems, E-commerce Solutions, API Integrations, and Cloud Deployment.",
  alternates: { canonical: "/services" },
};

// CMS progressive migration: a published CMS page for this path wins; otherwise the approved redesigned page renders.
const cmsRoute = createCmsRoute({ path: "/services", pageType: "page", Fallback: ServicesPage, metadata: baseMetadata });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
