import type { ArticleDocument, GlobalSettings, PageDocument } from "@/lib/cms/types";
import { richTextToPlainText } from "@/lib/cms/richtext";
import { absoluteUrl } from "./url";

type JsonLd = Record<string, unknown>;

/** Serialises JSON-LD safely for inline <script>: "<" can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");
}

export function organizationSchema(s: GlobalSettings): JsonLd {
  const base = absoluteUrl("/");
  const phone = s.contactPhone;
  const node: JsonLd = {
    "@type": "Organization",
    "@id": `${base.replace(/\/$/, "")}/#organization`,
    name: s.organization?.name ?? s.siteName,
    url: base.replace(/\/$/, ""),
  };
  if (s.organization?.logo) node.logo = absoluteUrl(s.organization.logo);
  if (s.contactEmail) node.email = s.contactEmail;
  if (phone) node.telephone = phone;
  if (s.tagline) node.slogan = s.tagline;
  if (s.organization?.description) node.description = s.organization.description;
  if (s.contactEmail || phone) {
    node.contactPoint = [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        ...(phone ? { telephone: phone } : {}),
        ...(s.contactEmail ? { email: s.contactEmail } : {}),
        areaServed: ["IN", "Worldwide"],
        availableLanguage: ["English", "Hindi"],
      },
    ];
  }
  const sameAs = s.social.filter((x) => x.platform !== "whatsapp").map((x) => x.href);
  if (sameAs.length) node.sameAs = sameAs;
  return node;
}

export function websiteSchema(s: GlobalSettings, description?: string): JsonLd {
  const base = absoluteUrl("/").replace(/\/$/, "");
  return {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: s.siteName,
    ...(description ? { description } : {}),
    publisher: { "@id": `${base}/#organization` },
  };
}

export function siteGraph(s: GlobalSettings, websiteDescription?: string): JsonLd {
  return { "@context": "https://schema.org", "@graph": [organizationSchema(s), websiteSchema(s, websiteDescription)] };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]): JsonLd | null {
  const withUrl = items.filter((i) => i.label);
  if (withUrl.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: withUrl.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.label,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLd | null {
  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (!valid.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(input: { name: string; description?: string; url: string; areaServed?: string[] }, s: GlobalSettings): JsonLd {
  const base = absoluteUrl("/").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: absoluteUrl(input.url),
    provider: { "@id": `${base}/#organization`, "@type": "Organization", name: s.siteName },
    ...(input.areaServed?.length ? { areaServed: input.areaServed } : {}),
  };
}

export function articleSchema(a: ArticleDocument, path: string, s: GlobalSettings): JsonLd {
  const base = absoluteUrl("/").replace(/\/$/, "");
  // publishedAt may be free text ("August 2026"): only emit datePublished when it is a valid ISO date.
  const iso = /^\d{4}-\d{2}-\d{2}/.test(a.publishedAt) && !Number.isNaN(Date.parse(a.publishedAt)) ? a.publishedAt : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt || richTextToPlainText(a.content).slice(0, 200),
    ...(iso ? { datePublished: iso } : {}),
    ...(a.cover ? { image: absoluteUrl(a.cover) } : {}),
    author: { "@type": "Organization", name: a.author.name, url: base },
    publisher: {
      "@type": "Organization",
      name: s.siteName,
      ...(s.organization?.logo ? { logo: { "@type": "ImageObject", url: absoluteUrl(s.organization.logo) } } : {}),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
  };
}

/** FAQ pairs found in a page's enabled faq sections. */
export function extractFaqs(page: PageDocument): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];
  for (const sec of page.sections) {
    if (sec.type !== "faq" || !sec.enabled) continue;
    const items = (sec.content as { items?: unknown }).items;
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      const q = (it as { question?: unknown }).question;
      const a = (it as { answer?: unknown }).answer;
      if (typeof q === "string" && typeof a === "string") out.push({ question: q, answer: a });
    }
  }
  return out;
}

/** Schemas applicable to a CMS page. Only emits what the page actually contains (no invented ratings/reviews). */
export function buildPageSchemas(page: PageDocument, path: string, s: GlobalSettings): JsonLd[] {
  const out: JsonLd[] = [];
  const crumbs = page.breadcrumbs ?? (path === "/" ? [] : [{ label: "Home", href: "/" }, { label: page.title }]);
  const bc = breadcrumbSchema(crumbs);
  if (bc) out.push(bc);
  const faq = faqSchema(extractFaqs(page));
  if (faq) out.push(faq);
  if (page.pageType === "service" || page.schemaType === "Service") {
    out.push(serviceSchema({ name: page.title, description: page.seo?.description, url: path }, s));
  }
  return out;
}
