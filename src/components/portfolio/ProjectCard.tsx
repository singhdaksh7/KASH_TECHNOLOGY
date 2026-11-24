import type { ProjectDocument } from "@/lib/cms/types";
import { CmsLink } from "@/components/cms/CmsLink";
import { SafeImage } from "@/components/cms/SafeImage";
import { safeImageSrc } from "@/lib/cms/url-safety";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

/** Where a project card links: bespoke internal page, generic CMS detail page, or nowhere for concepts without a page. */
export function projectHref(p: ProjectDocument): string | null {
  if (p.internalHref && p.internalHref !== "/contact") return p.internalHref;
  if (p.internalHref === "/contact") return null;
  return `/work/${p.slug}`;
}

export function ProjectCard({ project }: { project: ProjectDocument }) {
  const href = projectHref(project);
  const body = (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-current/10 bg-white/5 transition hover:border-[var(--color-primary)]/50">
      <SafeImage
        src={safeImageSrc(project.thumbnail ?? project.hero)}
        alt={project.thumbnail || project.hero ? `${project.title} preview` : ""}
        wrapperClassName="aspect-[16/10] w-full"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider opacity-60">{project.category}</span>
          <ProjectStatusBadge status={project.projectStatus} />
        </div>
        <h3 className="font-serif-heading text-xl font-bold">{project.title}</h3>
        <p className="line-clamp-3 text-sm opacity-75">{project.description}</p>
        {!!project.technologies?.length && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.technologies.slice(0, 5).map((t) => (
              <li key={t} className="rounded bg-current/10 px-2 py-0.5 font-mono text-[10px]">{t}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
  return href ? (
    <CmsLink href={href} className="block h-full focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">
      {body}
    </CmsLink>
  ) : (
    body
  );
}
