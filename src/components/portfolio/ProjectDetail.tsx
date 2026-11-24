import type { ProjectDocument } from "@/lib/cms/types";
import { CmsLink } from "@/components/cms/CmsLink";
import { RichText } from "@/components/cms/RichText";
import { SafeImage } from "@/components/cms/SafeImage";
import { safeImageSrc } from "@/lib/cms/url-safety";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif-heading text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

/** Public CMS project page body. Renders only the fields present; never invents metrics. */
export function ProjectDetail({ project }: { project: ProjectDocument }) {
  return (
    <article className="bg-[var(--color-ivory)] pb-24 pt-32 text-[#111827]">
      <div className="mx-auto max-w-4xl space-y-12 px-6 sm:px-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">{project.category}</span>
            <ProjectStatusBadge status={project.projectStatus} />
          </div>
          <h1 className="font-serif-heading text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
          <p className="text-lg text-[#374151]">{project.description}</p>
          {project.externalUrl && (
            <CmsLink href={project.externalUrl} className="inline-block font-semibold text-[var(--color-primary)] underline underline-offset-2">
              Visit project ↗
            </CmsLink>
          )}
        </header>

        {(project.hero || project.thumbnail) && (
          <SafeImage src={safeImageSrc(project.hero ?? project.thumbnail)} alt={`${project.title} hero`} priority wrapperClassName="aspect-[16/9] w-full rounded-[var(--radius-card)]" />
        )}

        {!!project.problem?.length && <Block title="The problem"><RichText value={project.problem} /></Block>}
        {!!project.solution?.length && <Block title="The solution"><RichText value={project.solution} /></Block>}
        {!!project.features?.length && (
          <Block title="Features">
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2"><span aria-hidden className="text-[var(--color-primary)]">✓</span>{f}</li>
              ))}
            </ul>
          </Block>
        )}
        {!!project.architecture?.length && <Block title="Architecture"><RichText value={project.architecture} /></Block>}
        {!!project.process?.length && (
          <Block title="Process">
            <ol className="space-y-4">
              {project.process.map((s, i) => (
                <li key={i}><h3 className="font-bold">{i + 1}. {s.title}</h3><p className="text-[#374151]">{s.description}</p></li>
              ))}
            </ol>
          </Block>
        )}
        {!!project.technologies?.length && (
          <Block title="Technologies">
            <ul className="flex flex-wrap gap-2">{project.technologies.map((t) => <li key={t} className="rounded-full bg-black/5 px-3 py-1 font-mono text-xs">{t}</li>)}</ul>
          </Block>
        )}
        {!!project.services?.length && (
          <Block title="Services delivered">
            <ul className="flex flex-wrap gap-2">{project.services.map((t) => <li key={t} className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">{t}</li>)}</ul>
          </Block>
        )}
        {!!project.gallery?.length && (
          <Block title="Gallery">
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((g, i) => (
                <li key={i}><SafeImage src={safeImageSrc(g)} alt={`${project.title} screenshot ${i + 1}`} wrapperClassName="aspect-[4/3] w-full rounded-[var(--radius-card)]" /></li>
              ))}
            </ul>
          </Block>
        )}
      </div>
    </article>
  );
}
