# KASH CMS Content Engine (public rendering layer)

Branch: `feature/cms-content-engine`. Owns the public-site side of the CMS only — no Prisma, auth, admin UI or database API.

## Architecture

```
React components ──► @/lib/cms (cms repository, getHeaderConfig, …)
                        │
                        ├─ ApiCmsRepository  (HTTP + zod validation; active only if CMS_API_URL is set)
                        └─ StaticFallbackRepository (today's hardcoded content; always available)
```

* Components depend only on the contracts in `src/lib/cms/types.ts`. Nothing imports Prisma.
* Repository methods never throw: "not available" = `null` / `[]`, and the composed `cms` object falls back to static content.
* With no `CMS_API_URL` there are **zero network calls** and every route stays statically generated (ISR `revalidate = 60`).

### Progressive migration (per route)
`createCmsRoute({ path, pageType, Fallback, metadata })` wraps an existing route:
published CMS page for that path → `CmsPageRenderer` + CMS SEO + schema; otherwise the untouched original page and metadata.
Applied to `/`, the 18 service routes and the 8 location routes. `/[location]/[service]` additionally accepts CMS-only combinations.
Not wrapped (static, can be added later the same way): `/about`, `/contact`, `/services`, `/solutions`, `/portfolio`, `/insights` index.

### Routing
* Static routes always beat dynamic segments in Next.js. `/[location]` serves CMS custom pages (param is named `location` only because Next forbids two different dynamic names at one level and `[location]/[service]` already exists). `RESERVED_TOP_LEVEL_SLUGS` stops CMS pages from claiming static names.
* `/work/[slug]` renders generic CMS projects; bespoke `/work/exora|schoolsync|crypto-launchpad` stay static.
* Unknown, draft, archived or reserved slug → 404.

## Environment (all server-side, all optional)
| Var | Purpose |
|---|---|
| `CMS_API_URL` | Base URL of the CMS read API. Unset = static fallback only |
| `CMS_API_TOKEN` | Optional bearer for public reads |
| `CMS_REVALIDATE_SECONDS` (60) / `CMS_TIMEOUT_MS` (4000) | Cache window / request timeout |
| `CMS_REVALIDATE_SECRET` | Enables `POST /api/cms/revalidate` (Bearer). Unset → 404 |
| `CMS_PREVIEW_SECRET` | HMAC key for preview tokens. Unset → preview denied |

## HTTP contract the backend should satisfy (`ApiCmsRepository`)
Envelope `{ "data": … }`; 404 = not found; any failure = silent fallback.
```
GET /pages/home            GET /pages?slug=<slug>      GET /pages  → [{slug,pageType,updatedAt,seo,status}]
GET /navigation  /footer  /theme  /settings
GET /portfolio   /portfolio/<slug>      GET /articles  /articles/<slug>
GET /preview/pages/<id>    (Bearer = preview credential; draft-capable)
```
Shapes: zod schemas in `src/lib/cms/schemas.ts` (authoritative). Public endpoints must return **published** content only; the adapter re-checks `status`.

**After publish**, call `POST /api/cms/revalidate` with `Authorization: Bearer $CMS_REVALIDATE_SECRET` and optional `{"tags":["cms:page:home"]}`.
Tags: `cms`, `cms:page:<slug>` (`home` for the homepage), `cms:pages`, `cms:navigation`, `cms:footer`, `cms:theme`, `cms:settings`, `cms:portfolio`, `cms:articles`.

## Sections (`src/components/cms-sections/registry.tsx`)
Registry maps type → component; unknown types are skipped and logged once. Disabled sections are skipped; sorted by `order`.
Style (`background, textColor, paddingTop/Bottom, container, alignment, borderRadius, shadow, customClass`) is **enumerated** → literal Tailwind classes; `customClass` is stripped to `[a-z0-9 _-]`. No raw CSS from the CMS.

| type | content keys |
|---|---|
| hero | badge, titlePrimary, titleAccent, titleSecondary, description, primaryCta{label,href}, secondaryCta, quickLinks[] (first hero = page `<h1>`, later heroes render as `<h2>` banners) |
| richText | heading, body |
| imageText | badge, heading, body, image{src,alt}, imagePosition(left/right), cta |
| servicesGrid | badge, heading, subheading, items[{title,description,href}], columns, limit (no items → existing static service grid) |
| portfolioGrid | heading, limit, category, slugs[] |
| featuredProject | slug |
| cta | title, subtitle, buttonText, buttonHref, variant(dark/ivory) |
| faq | heading, items[{question,answer}] (native `<details>`, zero JS; also emits FAQPage schema) |
| stats | items[{value,label}] (CMS-supplied only) |
| trustStrip | items[string] |
| logoStrip | heading, logos[{src,alt,href}] |
| founder | name, role, bio, image |
| team | members[{name,role,bio,image}] |
| process | badge, heading, subheading, steps[{title,description}] |
| video | url (YouTube/Vimeo → privacy embed; or .mp4/.webm), poster, title |
| gallery | images[{src,alt,caption}], columns |
| contactForm | formSlug (`contact` = existing form), heading, subheading |
| pricing | plans[{name,price,period,features[],cta,highlighted}] |
| testimonials | items[{quote,name,role,company}] (never fabricated) |
| insightsFeed | heading, limit, category |
| spacer | height(sm/md/lg/xl) |

`body`/`bio`/rich fields accept structured blocks, `string[]` paragraphs, or an HTML string. HTML is parsed with an allow-list
(`src/lib/cms/richtext.ts`) into a block tree and rendered as React elements — `dangerouslySetInnerHTML` is never used for CMS content.
Scripts/iframes/styles/event handlers are dropped; only `http(s)/mailto/tel/relative` links and `http(s)/relative` images survive.

## SEO
`buildMetadata()` (`src/lib/seo/metadata.ts`): CMS SEO → route's existing metadata → global defaults, per field. One canonical, same-origin only
(cross-origin CMS canonicals are ignored), normalised path. `index/follow=false` → robots meta. Invalid CMS images fall through to the next tier.
`src/lib/seo/schema.ts`: Organization + WebSite (root layout, from settings), BreadcrumbList, FAQPage (only from real FAQ items), Service
(service pages), Article. No ratings/reviews are ever generated. JSON-LD is serialised with `<` escaped.
Sitemap (`src/lib/seo/sitemap.ts`): the original static URL list + published CMS pages + articles + generic projects; de-duplicated; no drafts/admin/preview/noindex pages.
Robots: disallows `/api/`, `/admin`, `/preview`.

## Theme
`src/lib/theme/theme.ts` + `<ThemeStyle/>` in the root layout emit `:root{--color-primary … --section-spacing}`. Defaults = approved KASH theme
(`#FF5A00 / #FF8A3D / #FFF9F4 / #0B0B0F`). Each override is validated (hex/rgb/hsl colours, simple lengths); invalid values are dropped.
CMS sections consume the variables. **Legacy components still use hardcoded hex** (`#f36b21` etc.), so changing the CMS theme recolours CMS
sections immediately but legacy sections only as they are migrated to the variables (deliberately not done here — it would touch the approved design).

## Header / Footer
`getHeaderConfig()` / `getFooterConfig()` are loaded in the root layout and passed to `Navbar` / `MobileNavigation` / `Footer`
(`config` prop; default = `FALLBACK_HEADER` / `FALLBACK_FOOTER` in `src/lib/cms/fallback-content.ts`, which reproduce the current content).
Header supports menu + dropdowns, primary/secondary CTA, announcement bar, sticky on/off. `logo` is in the contract but the existing `KashLogo` is still used.
Footer supports columns/links/contact/social/newsletter (via `FormEmbed`)/legal. Footer is now a server component.

## Preview
`/preview?page=<id>&token=<signed>` — dynamic, uncached, `noindex, nofollow`, banner shown. Access is decided only by
`authorizePreview()` in `src/lib/cms/preview.ts`: **integration hook** (default = short-lived HMAC token via `signPreviewToken`, denied if `CMS_PREVIEW_SECRET` unset).
Replace its body to use admin sessions; return `{ok:true, credential}` where `credential` is forwarded as the Bearer to `GET /preview/pages/<id>`.

## Forms
`<FormEmbed formSlug="free-digital-audit" />` (client). `contact` reuses the existing form. Other slugs post to
`POST /api/forms/<slug>/submit` `{ fields, page }` via `src/lib/cms/forms-client.ts` (backend not implemented here; failure shows a friendly message).

## Content migration strategy (nothing deleted; static files stay as fallback)
Order matters — each step is independently shippable and reversible by unpublishing/deleting the CMS record.
| Content | Source today | CMS target | Notes |
|---|---|---|---|
| Header/Footer | `SITE_CONFIG.navLinks`, `FALLBACK_FOOTER` | header/footer config | Export via `FALLBACK_HEADER/FOOTER` (already CMS-shaped) |
| Global settings, theme | `SITE_CONFIG`, layout metadata, `DEFAULT_THEME` | settings, theme | Seed from `StaticFallbackRepository` |
| Insights | `insights-data.ts` (3 articles) | articles | `contentHtml: string[]` → paragraph blocks; `publishedAt` is free text → set a real ISO date when migrating |
| Portfolio | `data/portfolioData.ts` (8 concepts), `data/case-studies.ts` (3 real) | projects | Concepts stay `CONCEPT`; real ones `REAL PROJECT`; keep bespoke `/work/*` pages via `internalHref` |
| Locations | `locations-data.ts` (8) + `curated-local-services.ts` (3) | pages, `pageType: location` | slug = route path (`noida`, `baghpat/website-development`). Fields map to hero / richText / faq / cta sections. Do not imply offices |
| Service pages | per-route `page.tsx` (18) | pages, `pageType: service` | hero, feature grid (servicesGrid/imageText), process, faq, cta sections |
| Homepage | `src/app/page.tsx` | page `home` | hero → HeroDiagonal; ServiceScrollShowcase/AgencyPillars have no section type yet (add to registry before migrating); WhyChooseUs → stats/trustStrip; PortfolioGrid → portfolioGrid(limit 3); ProcessSteps → process; CtaBanner → cta |
| About / Contact / Services / Solutions / Portfolio | static pages | pages | wrap with `createCmsRoute` first (one line each), then seed |
| Privacy / Terms | static | leave static | legal copy |

Recommended rollout: (1) seed settings/theme/header/footer → verify visual parity; (2) articles + projects; (3) service/location overrides one at a time; (4) homepage last.
