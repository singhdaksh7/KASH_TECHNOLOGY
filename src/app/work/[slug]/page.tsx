import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms, getSettings } from "@/lib/cms";
import { isValidSlugSegment } from "@/lib/cms/reserved-slugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { ProjectDetail } from "@/components/portfolio/ProjectDetail";

/** Generic CMS project page. Bespoke case studies (/work/exora, …) are static routes and win over this. */
export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

async function load(slug: string) {
  if (!isValidSlugSegment(slug)) return null;
  const p = await cms.getPortfolioProject(slug);
  // Static fallback entries that link elsewhere (concepts, bespoke pages) have no generic page.
  return p && p.status === "published" && !p.internalHref ? p : null;
}

export async function generateStaticParams() {
  const projects = await cms.getPortfolio();
  return projects.filter((p) => !p.internalHref && isValidSlugSegment(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await load(slug);
  if (!project) return { robots: { index: false, follow: false } };
  const settings = await getSettings();
  return buildMetadata({
    path: `/work/${slug}`,
    seo: { title: `${project.title} | ${settings.siteName}`, description: project.description, ogImage: project.hero ?? project.thumbnail, ...project.seo },
    settings,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await load(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
