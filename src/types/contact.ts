export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  estimatedBudget: string;
  message: string;
  honeypot: string; // Anti-spam
  
  // Hidden attribution metadata
  leadSource?: string;
  landingPage?: string;
  trafficSource?: string;
  browser?: string;
  device?: string;
  referenceId?: string;
}

export interface LeadMetadata {
  referenceId: string;
  leadSource: string;
  trafficSource: string;
  landingPage: string;
  browser: string;
  device: string;
  consultation: boolean;
  projectType: string;
  timestamp: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export const PROJECT_TYPES = [
  "Free Consultation",
  "Web Application",
  "Mobile Application",
  "SaaS Platform",
  "ERP System",
  "Fintech Platform",
  "Blockchain Application",
  "Business Automation",
  "API and Backend Engineering",
  "Other"
] as const;

export const ESTIMATED_BUDGETS = [
  "Exploring options",
  "Under ₹50,000",
  "₹50,000–₹1,50,000",
  "₹1,50,000–₹5,00,000",
  "Above ₹5,00,000"
] as const;
