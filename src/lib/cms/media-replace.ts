import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { HttpError } from "@/lib/server/api";
import { auditTx } from "@/lib/server/audit-tx";
import { assertCan, type Actor } from "@/lib/rbac/actor";

export interface ReplaceEverywhereResult {
  sourceAssetId: string;
  targetAssetId: string;
  sourceUrl: string;
  targetUrl: string;
  updates: {
    pageSections: number;
    pageDrafts: number;
    globalBlocks: number;
    portfolioProjects: number;
    articles: number;
    seoMetadata: number;
    globalSettings: number;
    themeSettings: number;
  };
  totalUpdated: number;
}

/**
 * Replace Everywhere: Transactionally substitutes all references of an old media asset with a new one
 * across PageSection, Page drafts, GlobalBlock, PortfolioProject, Article, SeoMetadata, and Settings.
 * Emits audit log "media.replaced_globally" and leaves the old asset intact until explicitly deleted.
 */
export async function replaceMediaEverywhere(
  actor: Actor,
  sourceAssetId: string,
  targetAssetId: string
): Promise<ReplaceEverywhereResult> {
  assertCan(actor, "media.upload", "media.edit");

  if (sourceAssetId === targetAssetId) {
    throw new HttpError(400, "VALIDATION_ERROR", "Source and target media assets cannot be identical");
  }

  const [sourceAsset, targetAsset] = await Promise.all([
    prisma.mediaAsset.findUnique({ where: { id: sourceAssetId } }),
    prisma.mediaAsset.findUnique({ where: { id: targetAssetId } }),
  ]);

  if (!sourceAsset || sourceAsset.deletedAt) {
    throw new HttpError(404, "NOT_FOUND", "Source media asset not found");
  }
  if (!targetAsset || targetAsset.deletedAt) {
    throw new HttpError(404, "NOT_FOUND", "Target media asset not found");
  }

  const oldUrl = sourceAsset.publicUrl;
  const newUrl = targetAsset.publicUrl;

  return prisma.$transaction(async (tx) => {
    // 1. PageSection (live content & style)
    const secUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "PageSection"
        SET
          content = replace(content::text, ${oldUrl}, ${newUrl})::jsonb,
          style = CASE WHEN style IS NOT NULL THEN replace(style::text, ${oldUrl}, ${newUrl})::jsonb ELSE NULL END,
          "updatedAt" = now()
        WHERE content::text LIKE ${`%${oldUrl}%`} OR (style IS NOT NULL AND style::text LIKE ${`%${oldUrl}%`})
      `
    );

    // 2. Page draft JSON
    const draftUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "Page"
        SET
          draft = replace(draft::text, ${oldUrl}, ${newUrl})::jsonb,
          "updatedAt" = now()
        WHERE draft IS NOT NULL AND draft::text LIKE ${`%${oldUrl}%`}
      `
    );

    // 3. GlobalBlock content & style
    const blocksUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "GlobalBlock"
        SET
          content = replace(content::text, ${oldUrl}, ${newUrl})::jsonb,
          style = CASE WHEN style IS NOT NULL THEN replace(style::text, ${oldUrl}, ${newUrl})::jsonb ELSE NULL END,
          "updatedAt" = now()
        WHERE content::text LIKE ${`%${oldUrl}%`} OR (style IS NOT NULL AND style::text LIKE ${`%${oldUrl}%`})
      `
    );

    // 4. PortfolioProject
    const portfolioUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "PortfolioProject"
        SET
          content = CASE WHEN content IS NOT NULL THEN replace(content::text, ${oldUrl}, ${newUrl})::jsonb ELSE NULL END,
          summary = CASE WHEN summary IS NOT NULL THEN replace(summary, ${oldUrl}, ${newUrl}) ELSE NULL END,
          "updatedAt" = now()
        WHERE (content IS NOT NULL AND content::text LIKE ${`%${oldUrl}%`}) OR (summary IS NOT NULL AND summary LIKE ${`%${oldUrl}%`})
      `
    );

    // 5. Article
    const articlesUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "Article"
        SET
          content = replace(content::text, ${oldUrl}, ${newUrl})::jsonb,
          "updatedAt" = now()
        WHERE content::text LIKE ${`%${oldUrl}%`}
      `
    );

    // 6. SeoMetadata (ogImage, twitterImage)
    const seoUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "SeoMetadata"
        SET
          "ogImage" = CASE WHEN "ogImage" = ${oldUrl} THEN ${newUrl} ELSE "ogImage" END,
          "twitterImage" = CASE WHEN "twitterImage" = ${oldUrl} THEN ${newUrl} ELSE "twitterImage" END,
          "updatedAt" = now()
        WHERE "ogImage" = ${oldUrl} OR "twitterImage" = ${oldUrl}
      `
    );

    // 7. GlobalSetting (e.g. site, header, footer)
    const settingsUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "GlobalSetting"
        SET
          value = replace(value::text, ${oldUrl}, ${newUrl})::jsonb,
          "updatedAt" = now()
        WHERE value::text LIKE ${`%${oldUrl}%`}
      `
    );

    // 8. ThemeSetting
    const themeUpdated = await tx.$executeRaw(
      Prisma.sql`
        UPDATE "ThemeSetting"
        SET
          value = replace(value::text, ${oldUrl}, ${newUrl})::jsonb,
          "updatedAt" = now()
        WHERE value::text LIKE ${`%${oldUrl}%`}
      `
    );

    const totalUpdated =
      secUpdated +
      draftUpdated +
      blocksUpdated +
      portfolioUpdated +
      articlesUpdated +
      seoUpdated +
      settingsUpdated +
      themeUpdated;

    await auditTx(tx, {
      actorId: actor.id,
      action: "media.replaced_globally",
      entity: "MediaAsset",
      entityId: sourceAssetId,
      metadata: {
        sourceAssetId,
        targetAssetId,
        oldUrl,
        newUrl,
        affected: {
          pageSections: secUpdated,
          pageDrafts: draftUpdated,
          globalBlocks: blocksUpdated,
          portfolioProjects: portfolioUpdated,
          articles: articlesUpdated,
          seoMetadata: seoUpdated,
          globalSettings: settingsUpdated,
          themeSettings: themeUpdated,
        },
        totalUpdated,
      },
    });

    return {
      sourceAssetId,
      targetAssetId,
      sourceUrl: oldUrl,
      targetUrl: newUrl,
      updates: {
        pageSections: secUpdated,
        pageDrafts: draftUpdated,
        globalBlocks: blocksUpdated,
        portfolioProjects: portfolioUpdated,
        articles: articlesUpdated,
        seoMetadata: seoUpdated,
        globalSettings: settingsUpdated,
        themeSettings: themeUpdated,
      },
      totalUpdated,
    };
  });
}
