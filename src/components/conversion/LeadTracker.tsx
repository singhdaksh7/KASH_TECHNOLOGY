"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export interface LeadAttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  firstVisitAt?: string;
}

const STORAGE_KEY = "kash_lead_attribution";

export function getStoredLeadAttribution(): LeadAttributionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function LeadTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const existing = getStoredLeadAttribution();
      const utmSource = searchParams.get("utm_source") || existing.utmSource || undefined;
      const utmMedium = searchParams.get("utm_medium") || existing.utmMedium || undefined;
      const utmCampaign = searchParams.get("utm_campaign") || existing.utmCampaign || undefined;
      const utmTerm = searchParams.get("utm_term") || existing.utmTerm || undefined;
      const utmContent = searchParams.get("utm_content") || existing.utmContent || undefined;
      
      let referrer = existing.referrer;
      if (!referrer && document.referrer && !document.referrer.includes(window.location.hostname)) {
        referrer = document.referrer;
      }

      const landingPage = existing.landingPage || pathname;

      const data: LeadAttributionData = {
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        landingPage,
        firstVisitAt: existing.firstVisitAt || new Date().toISOString(),
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Best-effort tracking, ignore storage restrictions
    }
  }, [searchParams, pathname]);

  return null;
}
