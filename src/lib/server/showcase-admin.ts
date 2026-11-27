import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { refreshPublicSite } from "@/lib/server/api";

export const clientSchema = z.object({
  name: z.string().min(1, "Client or company name is required").max(100),
  contactName: z.string().max(100).optional().nullable(),
  logoUrl: z.string().max(500).optional().nullable(),
  photoUrl: z.string().max(500).optional().nullable(),
  country: z.string().min(1).max(60).default("India"),
  countryCode: z.string().min(2).max(4).default("IN"),
  websiteUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
  showInMarquee: z.boolean().default(true),
  showInTicker: z.boolean().default(true),
  isApproved: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const reviewSchema = z.object({
  clientId: z.string().optional().nullable(),
  clientName: z.string().min(1, "Client name is required").max(100),
  companyName: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  country: z.string().min(1).max(60).default("India"),
  countryCode: z.string().min(2).max(4).default("IN"),
  photoUrl: z.string().max(500).optional().nullable(),
  fullReview: z.string().min(5, "Review must be at least 5 characters").max(2000),
  shortReview: z.string().max(150).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable().default(5),
  source: z.string().max(80).default("Verified Delivery"),
  reviewDate: z.string().or(z.date()).optional().nullable(),
  isApproved: z.boolean().default(true),
  isPublished: z.boolean().default(true),
  showInTicker: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const showcaseSettingsSchema = z.object({
  tickerEnabled: z.boolean().default(true),
  tickerSpeed: z.number().int().min(10).max(100).default(30),
  tickerDirection: z.enum(["rtl", "ltr"]).default("rtl"),
  tickerPauseHover: z.boolean().default(true),
  showCountryFlags: z.boolean().default(true),
  showStarRatings: z.boolean().default(true),
  showPhotographs: z.boolean().default(true),
  marqueeEnabled: z.boolean().default(true),
  marqueeSpeed: z.number().int().min(10).max(100).default(25),
  marqueeHeading: z.string().min(1).max(200).default("Trusted by businesses we work with."),
  marqueeGrayscale: z.boolean().default(true),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ShowcaseSettingsInput = z.infer<typeof showcaseSettingsSchema>;

export async function getShowcaseSettings() {
  const settings = await prisma.showcaseSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    return prisma.showcaseSettings.create({
      data: {
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
  }
  return settings;
}

export async function updateShowcaseSettings(data: ShowcaseSettingsInput) {
  const row = await prisma.showcaseSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  refreshPublicSite();
  return row;
}
