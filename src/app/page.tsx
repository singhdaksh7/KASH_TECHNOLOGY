import { createCmsRoute } from "@/components/cms/createCmsRoute";
import { HomePage } from "@/components/home/HomePage";

// CMS progressive migration: a published CMS home page wins; otherwise the approved redesigned homepage
// (components/home/HomePage.tsx, unchanged) renders.
const cmsRoute = createCmsRoute({ path: "/", pageType: "home", Fallback: HomePage });
export const generateMetadata = cmsRoute.generateMetadata;
export const revalidate = 60;
export default cmsRoute.Page;
