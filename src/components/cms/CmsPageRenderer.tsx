import type { PageDocument } from "@/lib/cms/types";
import { logOnce } from "@/lib/cms/log";
import { getRegistryEntry } from "@/components/cms-sections/registry";
import { SectionFrame } from "./SectionFrame";

/**
 * Renders a PageDocument: sorts by `order`, skips disabled sections, applies safe style
 * settings and skips unknown section types (logged once, never thrown).
 * Server component; only leaf sections that need interactivity are client components.
 * Section components are defensive by construction (every field goes through str()/objs()/cta()), and the
 * repository never throws, so a malformed section degrades to empty output instead of crashing the page.
 */
export function CmsPageRenderer({ page }: { page: PageDocument }) {
  const sections = [...page.sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const primaryHeroId = sections.find((s) => s.type === "hero" && getRegistryEntry("hero"))?.id;

  return (
    <>
      {sections.map((section) => {
        const entry = getRegistryEntry(section.type);
        if (!entry) {
          logOnce(`unknown-section:${section.type}`, `Unknown section type "${String(section.type).slice(0, 40)}"; skipped`);
          return null;
        }
        const isPrimaryHero = section.id === primaryHeroId;
        const Comp = entry.component as React.ComponentType<{ section: typeof section; isPrimaryHero?: boolean }>;
        const labelRaw = entry.labelKey ? section.content[entry.labelKey] : undefined;
        const label = typeof labelRaw === "string" ? labelRaw.slice(0, 120) : undefined;
        return (
          <SectionFrame key={section.id} id={section.id} type={section.type} style={section.style} label={label} selfFramed={entry.selfFramed}>
            <Comp section={section} isPrimaryHero={isPrimaryHero} />
          </SectionFrame>
        );
      })}
    </>
  );
}
