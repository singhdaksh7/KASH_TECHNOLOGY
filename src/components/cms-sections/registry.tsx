import type { ComponentType } from "react";
import type { SectionProps } from "./util";
import {
  CtaSection, FaqSection, FounderSection, GallerySection, HeroSection, ImageTextSection, LogoStripSection,
  PricingSection, ProcessSection, RichTextSection, SpacerSection, StatsSection, TeamSection, TestimonialsSection,
  TrustStripSection, VideoSection,
} from "./basic";
import { ContactFormSection, FeaturedProjectSection, InsightsFeedSection, PortfolioGridSection, ServicesGridSection } from "./data";
import type { SectionType } from "@/lib/cms/types";

type SectionComponent = ComponentType<SectionProps> | ((props: SectionProps) => Promise<React.ReactNode>);

interface RegistryEntry {
  component: SectionComponent;
  /** Component draws its own background/padding; SectionFrame only applies explicit style overrides. */
  selfFramed?: boolean;
  /** Accessible label for the <section> landmark, derived from content. */
  labelKey?: string;
}

/** Section type → React component. Add a new section type here (and in SECTION_TYPES). */
export const SECTION_REGISTRY: Record<SectionType, RegistryEntry> = {
  hero: { component: HeroSection, selfFramed: true, labelKey: "titlePrimary" },
  richText: { component: RichTextSection, labelKey: "heading" },
  imageText: { component: ImageTextSection, labelKey: "heading" },
  servicesGrid: { component: ServicesGridSection, selfFramed: false, labelKey: "heading" },
  portfolioGrid: { component: PortfolioGridSection, labelKey: "heading" },
  featuredProject: { component: FeaturedProjectSection },
  cta: { component: CtaSection, selfFramed: true, labelKey: "title" },
  faq: { component: FaqSection, labelKey: "heading" },
  stats: { component: StatsSection, labelKey: "heading" },
  trustStrip: { component: TrustStripSection },
  logoStrip: { component: LogoStripSection, labelKey: "heading" },
  founder: { component: FounderSection, labelKey: "name" },
  team: { component: TeamSection, labelKey: "heading" },
  process: { component: ProcessSection, selfFramed: true, labelKey: "heading" },
  video: { component: VideoSection, labelKey: "heading" },
  gallery: { component: GallerySection, labelKey: "heading" },
  contactForm: { component: ContactFormSection, labelKey: "heading" },
  pricing: { component: PricingSection, labelKey: "heading" },
  testimonials: { component: TestimonialsSection, labelKey: "heading" },
  insightsFeed: { component: InsightsFeedSection, labelKey: "heading" },
  spacer: { component: SpacerSection },
};

export function getRegistryEntry(type: string): RegistryEntry | null {
  return Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, type) ? SECTION_REGISTRY[type as SectionType] : null;
}
