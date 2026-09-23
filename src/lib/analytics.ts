import { track } from "@vercel/analytics";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | "contact_form_submit"
  | "contact_form_submitted"
  | "contact_form_started"
  | "contact_form_failed"
  | "book_consultation_click"
  | "book_call_click"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "portfolio_view"
  | "service_cta_click"
  | "cta_click"
  | "consultation_click"
  | "live_project_click"
  | "case_study_click"
  | (string & {});

export function trackEvent(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  // Check if we are in a browser environment to prevent SSR failures
  if (typeof window !== "undefined") {
    // 1. Vercel Web Analytics
    try {
      track(name, properties);
    } catch {
      // Best-effort
    }

    // 2. Google Analytics 4 (if configured via NEXT_PUBLIC_GA_ID)
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, properties);
      }
    } catch {
      // Best-effort
    }
  }
}
