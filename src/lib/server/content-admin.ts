import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { articleEnvelope, type ProjectRow } from "@/lib/server/dto-content";
import type { ArticleItem, PortfolioItem } from "@/lib/admin-client/types";

export const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const seoSchema = z.object({
  title: z.string().max(300).default(""), metaDescription: z.string().max(500).default(""), slug: z.string().max(200).default(""),
  canonicalUrl: z.string().max(2048).default(""), focusKeyword: z.string().max(200).default(""), secondaryKeywords: z.string().max(500).default(""),
  ogTitle: z.string().max(300).default(""), ogDescription: z.string().max(500).default(""), ogImage: z.string().max(2048).default(""),
  twitterImage: z.string().max(2048).optional(), index: z.boolean().default(true), follow: z.boolean().default(true),
}).partial();

export const portfolioSchema = z.object({
  name: z.string().trim().min(1).max(200), slug: z.string().regex(slugRe).max(120), status: z.enum(["Draft", "Published"]),
  projectType: z.enum(["REAL PROJECT", "PROTOTYPE", "IN DEVELOPMENT", "STAGING", "CONCEPT"]),
  category: z.string().max(120).default(""), industry: z.string().max(120).default(""),
  shortDescription: z.string().max(1000).default(""), fullDescription: z.string().max(20000).default(""),
  thumbnail: z.string().max(2048).default(""), heroImage: z.string().max(2048).default(""), gallery: z.array(z.string().max(2048)).max(40).default([]),
  videoUrl: z.string().max(2048).optional(), technologies: z.array(z.string().max(80)).max(40).default([]), services: z.array(z.string().max(80)).max(40).default([]),
  problem: z.array(z.string().max(2000)).max(30).default([]), solution: z.array(z.string().max(2000)).max(30).default([]),
  features: z.array(z.object({ title: z.string().max(200), description: z.string().max(1000) })).max(40).default([]),
  architecture: z.array(z.object({ label: z.string().max(200), description: z.string().max(1000) })).max(40).default([]),
  developmentProcess: z.array(z.string().max(1000)).max(30).optional(),
  externalUrl: z.string().max(2048).optional(), caseStudyUrl: z.string().max(2048).optional(),
  clickBehaviour: z.enum(["Open Case Study", "External Website", "Modal", "Custom URL", "No Link"]).default("No Link"),
  seo: seoSchema.optional(),
});

export async function categoryId(kind: "portfolio" | "article", name: string): Promise<string | null> {
  const n = name.trim();
  if (!n) return null;
  const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "general";
  const row = kind === "portfolio"
    ? await prisma.portfolioCategory.upsert({ where: { slug }, update: { name: n }, create: { name: n, slug } })
    : await prisma.articleCategory.upsert({ where: { slug }, update: { name: n }, create: { name: n, slug } });
  return row.id;
}

export async function savePortfolio(id: string | null, d: z.infer<typeof portfolioSchema>): Promise<ProjectRow> {
  const { name, slug, status, shortDescription, ...rest } = d;
  const data = {
    title: name, slug, status: status === "Published" ? ("PUBLISHED" as const) : ("DRAFT" as const), summary: shortDescription,
    content: { ...rest, shortDescription } as Prisma.InputJsonValue,
    categoryId: await categoryId("portfolio", d.category),
  };
  if (id) {
    const cur = await prisma.portfolioProject.findUniqueOrThrow({ where: { id } });
    return prisma.portfolioProject.update({ where: { id }, data: { ...data, publishedAt: data.status === "PUBLISHED" ? cur.publishedAt ?? new Date() : null }, include: { category: true } });
  }
  return prisma.portfolioProject.create({ data: { ...data, publishedAt: data.status === "PUBLISHED" ? new Date() : null }, include: { category: true } });
}

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(250), slug: z.string().regex(slugRe).max(160), status: z.enum(["Draft", "Published"]),
  excerpt: z.string().max(1000).default(""), category: z.string().max(120).default(""),
  authorName: z.string().max(120).default("KASH Technology"), authorRole: z.string().max(120).default(""),
  cover: z.string().max(2048).default(""), publishedAt: z.string().max(60).default(""), readTime: z.string().max(40).default(""),
  body: z.string().max(200_000).default(""), relatedSlugs: z.array(z.string().max(160)).max(6).default([]), seo: seoSchema.optional(),
});

export async function saveArticle(id: string | null, d: z.infer<typeof articleSchema>) {
  const item = d as unknown as ArticleItem;
  const published = d.status === "Published";
  const data = {
    title: d.title, slug: d.slug, status: published ? ("PUBLISHED" as const) : ("DRAFT" as const), excerpt: d.excerpt,
    content: articleEnvelope(item) as Prisma.InputJsonValue, categoryId: await categoryId("article", d.category),
  };
  if (id) {
    const cur = await prisma.article.findUniqueOrThrow({ where: { id } });
    return prisma.article.update({ where: { id }, data: { ...data, publishedAt: published ? cur.publishedAt ?? new Date() : null }, include: { category: true } });
  }
  return prisma.article.create({ data: { ...data, publishedAt: published ? new Date() : null }, include: { category: true } });
}
export type { PortfolioItem };
