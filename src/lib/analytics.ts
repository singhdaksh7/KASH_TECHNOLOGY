import { track } from "@vercel/analytics";

type AnalyticsEvent =
  | "cta_click"
  | "consultation_click"
  | "live_project_click"
  | "case_study_click"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_failed";

export function trackEvent(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  // Check if we are in a browser environment to prevent SSR failures
  if (typeof window !== "undefined") {
    track(name, properties);
  }
}
