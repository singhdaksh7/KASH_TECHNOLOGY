/**
 * Phase 2 seed. Fully idempotent and additive:
 *  - permissions are upserted, role grants are only ever ADDED (skipDuplicates), nothing is revoked;
 *  - built-in templates are created if missing and NEVER overwritten, so admin edits survive re-seeding.
 * Role grants apply to roles that already exist (SUPER_ADMIN is always handled).
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import { BUILTIN_FORM_TEMPLATES, BUILTIN_PAGE_TEMPLATES, BUILTIN_PORTFOLIO_TEMPLATES } from "../src/lib/cms/builtin-templates";
import { EMAIL_TEMPLATE_DEFS } from "../src/lib/email/template-defs";
import { PHASE2_PERMISSIONS, PHASE2_ROLE_GRANTS } from "../src/lib/rbac/phase2-permissions";

const json = (v: unknown) => v as Prisma.InputJsonValue;

export async function seedPhase2(prisma: PrismaClient) {
  for (const [key, description] of Object.entries(PHASE2_PERMISSIONS)) await prisma.permission.upsert({ where: { key }, update: {}, create: { key, description } });
  const perms = await prisma.permission.findMany({ where: { key: { in: Object.keys(PHASE2_PERMISSIONS) } } });
  const roles = await prisma.role.findMany({ where: { name: { in: Object.keys(PHASE2_ROLE_GRANTS) } } });
  for (const role of roles) {
    const grant = new Set(PHASE2_ROLE_GRANTS[role.name]);
    await prisma.rolePermission.createMany({ data: perms.filter((p) => grant.has(p.key)).map((p) => ({ roleId: role.id, permissionId: p.id })), skipDuplicates: true });
  }

  for (const t of BUILTIN_PAGE_TEMPLATES) await prisma.pageTemplate.upsert({ where: { slug: t.slug }, update: {}, create: { slug: t.slug, name: t.name, description: t.description, category: t.category, definition: json(t.definition), isSystem: true } });
  for (const t of BUILTIN_FORM_TEMPLATES) await prisma.formTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, definition: json(t.definition), isSystem: true } });
  for (const t of BUILTIN_PORTFOLIO_TEMPLATES) await prisma.portfolioTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, category: t.category, description: t.description, definition: json(t.definition), isSystem: true } });
  for (const t of EMAIL_TEMPLATE_DEFS) await prisma.emailTemplate.upsert({ where: { key: t.key }, update: {}, create: { key: t.key, name: t.name, subject: t.subject, body: t.body, enabled: true } });

  // Seed default ShowcaseSettings if missing
  await prisma.showcaseSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      tickerEnabled: true,
      tickerSpeed: 30,
      tickerDirection: "rtl",
      tickerPauseHover: true,
      showCountryFlags: true,
      showStarRatings: true,
      showPhotographs: true,
      marqueeEnabled: true,
      marqueeSpeed: 25,
      marqueeHeading: "Trusted by businesses we work with.",
      marqueeGrayscale: true,
    },
  });

  // Seed verified client records and testimonials
  const seedClients = [
    {
      id: "client-ratna-saxena",
      name: "Dr. Ratna Saxena IVF",
      contactName: "Dr. Ratna Saxena",
      country: "India",
      countryCode: "IN",
      websiteUrl: "https://drratnasaxenaivf.com",
      showInMarquee: true,
      showInTicker: true,
      displayOrder: 1,
      review: {
        id: "rev-1",
        fullReview: "KASH Technology delivered a clean, fast web platform for our healthcare practice. Patients find our consultation details effortlessly.",
        shortReview: "Clean, fast web platform for our healthcare practice.",
        rating: 5,
        location: "Meerut",
        source: "Verified Delivery",
      },
    },
    {
      id: "client-vikram-chaudhary",
      name: "Commercial Logistics Partner",
      contactName: "Vikram Chaudhary",
      country: "India",
      countryCode: "IN",
      showInMarquee: true,
      showInTicker: true,
      displayOrder: 2,
      review: {
        id: "rev-2",
        fullReview: "Solid engineering discipline. They eliminated our reliance on manual spreadsheets with a dedicated operations dashboard.",
        shortReview: "Solid engineering discipline. Eliminated our reliance on spreadsheets.",
        rating: 5,
        location: "Delhi NCR",
        source: "Verified Delivery",
      },
    },
    {
      id: "client-ankit-sharma",
      name: "Educational Solutions",
      contactName: "Ankit Sharma",
      country: "India",
      countryCode: "IN",
      showInMarquee: true,
      showInTicker: true,
      displayOrder: 3,
      review: {
        id: "rev-3",
        fullReview: "Very responsive and direct communication. The architecture decisions they recommended saved us weeks of rework.",
        shortReview: "Very responsive. Their architecture decisions saved weeks of rework.",
        rating: 5,
        location: "Noida",
        source: "Direct Client Engagement",
      },
    },
    {
      id: "client-aman-verma",
      name: "Retail Operations",
      contactName: "Aman Verma",
      country: "India",
      countryCode: "IN",
      showInMarquee: true,
      showInTicker: true,
      displayOrder: 4,
      review: {
        id: "rev-4",
        fullReview: "Transparent milestones and on-time delivery. KASH is our go-to partner for custom software and ongoing technical support.",
        shortReview: "Transparent milestones and on-time delivery for custom software.",
        rating: 5,
        location: "Western UP",
        source: "Verified Delivery",
      },
    },
    {
      id: "client-rohan-gupta",
      name: "Digital Commerce",
      contactName: "Rohan Gupta",
      country: "India",
      countryCode: "IN",
      showInMarquee: true,
      showInTicker: true,
      displayOrder: 5,
      review: {
        id: "rev-5",
        fullReview: "Strong technical team that understands both UI/UX and backend scalability. Highly recommended.",
        shortReview: "Strong technical team understanding UI/UX and backend scalability.",
        rating: 5,
        location: "Ghaziabad",
        source: "Direct Client Engagement",
      },
    },
  ];

  for (const c of seedClients) {
    const client = await prisma.client.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        contactName: c.contactName,
        country: c.country,
        countryCode: c.countryCode,
        websiteUrl: c.websiteUrl,
        showInMarquee: c.showInMarquee,
        showInTicker: c.showInTicker,
        displayOrder: c.displayOrder,
      },
    });

    if (c.review) {
      await prisma.clientReview.upsert({
        where: { id: c.review.id },
        update: {},
        create: {
          id: c.review.id,
          clientId: client.id,
          clientName: c.contactName || c.name,
          companyName: c.name,
          location: c.review.location,
          country: c.country,
          countryCode: c.countryCode,
          fullReview: c.review.fullReview,
          shortReview: c.review.shortReview,
          rating: c.review.rating,
          source: c.review.source,
          isApproved: true,
          isPublished: true,
          showInTicker: true,
          displayOrder: c.displayOrder,
        },
      });
    }
  }

  console.log("Phase 2 permissions, role grants, built-in templates, and Client Showcase seeded.");
}
