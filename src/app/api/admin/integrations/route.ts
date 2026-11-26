import { prisma } from "@/lib/db/prisma";
import { admin } from "@/lib/server/api";
import { ok } from "@/lib/server/http";
import { getEmailConfig } from "@/lib/email/provider";

export interface IntegrationStatus {
  id: string;
  name: string;
  category: "Email & Messaging" | "Analytics & Search" | "Storage & CDN" | "Security & Anti-Spam";
  description: string;
  configured: boolean;
  status: "HEALTHY" | "WARNING" | "NOT_CONFIGURED" | "COMING_SOON";
  nonSecretConfig: Record<string, string | number | boolean>;
  lastActivityAt?: string | null;
  lastFailure?: string | null;
  docsUrl?: string;
}

export const GET = admin("settings.view", async () => {
  // 1. Resend (Reads real production DB-backed EmailSettings + env fallback)
  const emailCfg = await getEmailConfig().catch(() => null);
  const [lastEmailSuccess, lastEmailFailure] = await Promise.all([
    prisma.emailDelivery.findFirst({
      where: { status: "SENT" },
      orderBy: { sentAt: "desc" },
      select: { sentAt: true },
    }),
    prisma.emailDelivery.findFirst({
      where: { status: "FAILED" },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, errorMessage: true },
    }),
  ]);

  const resendConfigured = !!emailCfg?.configured;
  const resendHealthy = resendConfigured && emailCfg.enabled && !lastEmailFailure;

  const resendStatus: IntegrationStatus = {
    id: "resend",
    name: "Resend",
    category: "Email & Messaging",
    description: "Transactional email delivery for customer enquiries, notifications, and auto-replies.",
    configured: resendConfigured,
    status: !resendConfigured ? "NOT_CONFIGURED" : resendHealthy ? "HEALTHY" : "WARNING",
    nonSecretConfig: {
      status: !resendConfigured ? "Not configured" : emailCfg.enabled ? "Active" : "Disabled in Settings",
      keySource: emailCfg?.apiKeySource ?? "none",
      keyLast4: emailCfg?.apiKeyLast4 ? `••••${emailCfg.apiKeyLast4}` : "none",
      from: emailCfg?.fromEmail ?? "not configured",
      fromName: emailCfg?.fromName ?? "KASH Technology",
      internalRecipient: emailCfg?.internalRecipient ?? "not configured",
    },
    lastActivityAt: lastEmailSuccess?.sentAt?.toISOString() ?? null,
    lastFailure: lastEmailFailure?.errorMessage ?? null,
    docsUrl: "https://resend.com/docs",
  };

  // 2. Google Analytics (GA4)
  const gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.GA_MEASUREMENT_ID;
  const gaStatus: IntegrationStatus = {
    id: "google_analytics",
    name: "Google Analytics 4",
    category: "Analytics & Search",
    description: "Web traffic measurement, event tracking, and attribution telemetry.",
    configured: !!gaId,
    status: gaId ? "HEALTHY" : "NOT_CONFIGURED",
    nonSecretConfig: {
      measurementId: gaId ? `${gaId.slice(0, 4)}••••${gaId.slice(-3)}` : "not set",
    },
    docsUrl: "https://developers.google.com/analytics",
  };

  // 3. Google Search Console
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const gscStatus: IntegrationStatus = {
    id: "google_search_console",
    name: "Google Search Console",
    category: "Analytics & Search",
    description: "Search indexing telemetry, sitemap discovery, and crawl verification.",
    configured: !!gscVerification,
    status: gscVerification ? "HEALTHY" : "NOT_CONFIGURED",
    nonSecretConfig: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.kash-technology.com",
      verificationTagConfigured: !!gscVerification,
    },
    docsUrl: "https://search.google.com/search-console",
  };

  // 4. Cloudflare R2 / Object Storage
  const r2Bucket = process.env.R2_BUCKET || process.env.STORAGE_BUCKET;
  const storageStatus: IntegrationStatus = {
    id: "storage_provider",
    name: "Media Storage",
    category: "Storage & CDN",
    description: "Asset storage engine for uploaded images, case study assets, and media.",
    configured: true,
    status: "HEALTHY",
    nonSecretConfig: {
      provider: r2Bucket ? "Cloudflare R2" : "Local File System",
      publicPrefix: "/uploads",
      bucket: r2Bucket ? `${r2Bucket}` : "local-disk",
    },
  };

  // 5. Cloudflare Turnstile
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileStatus: IntegrationStatus = {
    id: "turnstile",
    name: "Cloudflare Turnstile",
    category: "Security & Anti-Spam",
    description: "Privacy-preserving CAPTCHA replacement for high-converting contact forms.",
    configured: !!turnstileKey,
    status: turnstileKey ? "HEALTHY" : "NOT_CONFIGURED",
    nonSecretConfig: {
      siteKey: turnstileKey ? `${turnstileKey.slice(0, 6)}••••` : "not configured",
      botProtection: turnstileKey ? "Active" : "Standard Rate Limiting",
    },
    docsUrl: "https://developers.cloudflare.com/turnstile/",
  };

  // 6. Meta Pixel & Google Ads (Planned / Optional)
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const metaStatus: IntegrationStatus = {
    id: "meta_pixel",
    name: "Meta Pixel",
    category: "Analytics & Search",
    description: "Conversion tracking for Meta ad campaigns and audience building.",
    configured: !!metaPixelId,
    status: metaPixelId ? "HEALTHY" : "COMING_SOON",
    nonSecretConfig: {
      pixelId: metaPixelId ? `${metaPixelId.slice(0, 4)}••••` : "not configured",
    },
  };

  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const googleAdsStatus: IntegrationStatus = {
    id: "google_ads",
    name: "Google Ads Tag",
    category: "Analytics & Search",
    description: "Tag for Google conversion tracking and remarketing lists.",
    configured: !!googleAdsId,
    status: googleAdsId ? "HEALTHY" : "COMING_SOON",
    nonSecretConfig: {
      tagId: googleAdsId ? `${googleAdsId.slice(0, 4)}••••` : "not configured",
    },
  };

  return ok({
    items: [
      resendStatus,
      gaStatus,
      gscStatus,
      storageStatus,
      turnstileStatus,
      metaStatus,
      googleAdsStatus,
    ],
  });
});
