export interface Project {
  title: string;
  category: string;
  tag: string;
  statusType: "REAL PROJECT" | "PROTOTYPE" | "IN DEVELOPMENT" | "STAGING" | "CONCEPT";
  description: string;
  image: string;
  href: string;
}

/**
 * The approved portfolio entries (single source for the page fallback, the seed script and the static CMS fallback).
 * Statuses are the approved, truthful labels; edit them in the admin Portfolio CMS, not here, once the CMS is live.
 */
export const APPROVED_PROJECTS: Project[] = [
  {
    title: "SchoolSync",
    category: "ERP / SaaS",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "School management platform prototype to manage admissions, attendance and academic schedules.",
    image: "/images/projects/schoolsync-mockup.png",
    href: "/work/schoolsync",
  },
  {
    title: "Launchpad X",
    category: "Blockchain / Web3",
    tag: "Software / SaaS",
    statusType: "PROTOTYPE",
    description: "Token presale deployment and smart contract infrastructure prototype.",
    image: "/images/projects/launchpad-mockup.png",
    href: "/work/crypto-launchpad",
  },
  {
    title: "Kasba Express",
    category: "E-Commerce",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "On-demand local merchant ordering and delivery concept workflow.",
    image: "/images/projects/kasba-mockup.png",
    href: "/contact",
  },
  {
    title: "Dr. Ratna Saxena IVF",
    category: "Website",
    tag: "Websites",
    statusType: "REAL PROJECT",
    description: "IVF & fertility centre healthcare website with service details and patient enquiries.",
    image: "/images/projects/ratna-ivf-mockup.png",
    href: "/contact",
  },
  {
    title: "FuelOps",
    category: "ERP / Operations",
    tag: "Software / SaaS",
    statusType: "CONCEPT",
    description: "Fuel station enterprise operations platform concept for pump sales, settlement and reporting.",
    image: "/images/projects/fuelops-mockup.png",
    href: "/contact",
  },
  {
    title: "TaxiSegrator",
    category: "Mobile App",
    tag: "Mobile Apps",
    statusType: "CONCEPT",
    description: "B2B taxi marketplace concept connecting travel agents and verified operators.",
    image: "/images/projects/taxisegrator-mockup.png",
    href: "/contact",
  },
];
