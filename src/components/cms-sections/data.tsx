import { CmsLink } from "@/components/cms/CmsLink";
import { FormEmbed } from "@/components/cms/FormEmbed";
import { SafeImage } from "@/components/cms/SafeImage";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ServiceCardsGrid } from "@/components/sections/ServiceCardsGrid";
import { ProjectDetail } from "@/components/portfolio/ProjectDetail";
import { cms, getPortfolioProjects, getPublishedArticles } from "@/lib/cms";
import { safeImageSrc } from "@/lib/cms/url-safety";
import { CardBox, PrimaryButton, SectionHeader, num, objs, str, strs, type SectionProps } from "./util";

export function ServicesGridSection({ section }: SectionProps) {
  const c = section.content;
  const items = objs(c.items, 24).flatMap((i) => (str(i.title, 120) ? [i] : []));
  // No CMS items → the existing static service grid (same look as today).
  if (!items.length) return <ServiceCardsGrid badge={str(c.badge)} title={str(c.heading)} subtitle={str(c.subheading)} limit={typeof c.limit === "number" ? num(c.limit, 6) : undefined} />;
  const cols = num(c.columns, 3, 2, 4);
  const colCls = cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <ul className={`grid gap-6 sm:grid-cols-2 ${colCls}`}>
        {items.map((it, i) => {
          const card = (
            <CardBox className="h-full">
              <h3 className="text-lg font-bold">{str(it.title, 120)}</h3>
              {str(it.description) && <p className="mt-2 text-sm opacity-75">{str(it.description)}</p>}
            </CardBox>
          );
          return <li key={i}>{it.href ? <CmsLink href={it.href} className="block h-full">{card}</CmsLink> : card}</li>;
        })}
      </ul>
    </>
  );
}

export async function PortfolioGridSection({ section }: SectionProps) {
  const c = section.content;
  let projects = await getPortfolioProjects();
  const slugs = strs(c.slugs, 24);
  if (slugs.length) projects = slugs.flatMap((s) => projects.filter((p) => p.slug === s));
  const category = str(c.category, 80);
  if (category) projects = projects.filter((p) => p.category === category);
  projects = projects.slice(0, num(c.limit, 6, 1, 24));
  if (!projects.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading)} subheading={str(c.subheading)} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.id}><ProjectCard project={p} /></li>
        ))}
      </ul>
    </>
  );
}

export async function FeaturedProjectSection({ section }: SectionProps) {
  const slug = str(section.content.slug, 80);
  if (!slug) return null;
  const project = await cms.getPortfolioProject(slug);
  if (!project) return null;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <SafeImage src={safeImageSrc(project.hero ?? project.thumbnail)} alt={`${project.title} preview`} wrapperClassName="aspect-[16/10] w-full rounded-[var(--radius-card)]" />
      <div className="space-y-4">
        <SectionHeader badge={str(section.content.badge) ?? "FEATURED PROJECT"} />
        <h2 className="font-serif-heading text-3xl font-bold">{project.title}</h2>
        <p className="opacity-80">{project.description}</p>
        <CmsLink href={project.internalHref && project.internalHref !== "/contact" ? project.internalHref : `/work/${project.slug}`}>
          <PrimaryButton>View case study</PrimaryButton>
        </CmsLink>
      </div>
    </div>
  );
}

export async function InsightsFeedSection({ section }: SectionProps) {
  const c = section.content;
  let articles = await getPublishedArticles();
  const category = str(c.category, 80);
  if (category) articles = articles.filter((a) => a.category === category);
  articles = articles.slice(0, num(c.limit, 3, 1, 12));
  if (!articles.length) return null;
  return (
    <>
      <SectionHeader badge={str(c.badge)} heading={str(c.heading) ?? "Insights"} subheading={str(c.subheading)} />
      <ul className="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <li key={a.id}>
            <CmsLink href={`/insights/${a.slug}`} className="block h-full">
              <CardBox className="h-full">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">{a.category}</span>
                <h3 className="mt-2 font-serif-heading text-lg font-bold">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm opacity-75">{a.excerpt}</p>
              </CardBox>
            </CmsLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ContactFormSection({ section }: SectionProps) {
  const c = section.content;
  const slug = str(c.formSlug, 80) ?? "contact";
  return <FormEmbed formSlug={slug} heading={str(c.heading)} subheading={str(c.subheading)} />;
}

export { ProjectDetail };
