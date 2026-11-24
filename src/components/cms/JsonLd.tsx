import { serializeJsonLd } from "@/lib/seo/schema";

/** Server-rendered JSON-LD. Accepts one object or many; `<` is escaped so content cannot break out of the tag. */
export function JsonLd({ data }: { data: unknown | unknown[] | null | undefined }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.filter(Boolean).map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(d) }} />
      ))}
    </>
  );
}
