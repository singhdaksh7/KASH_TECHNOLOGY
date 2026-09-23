import { ContactFormValues, PROJECT_TYPES, ESTIMATED_BUDGETS } from "@/types/contact";

export function validateContactForm(values: Partial<ContactFormValues>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (values.honeypot) {
    errors.honeypot = "Spam detected";
  }

  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  } else if (values.fullName.trim().length > 100) {
    errors.fullName = "Name must be under 100 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email || !emailRegex.test(values.email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  if (values.phone && values.phone.trim().length > 0) {
    const phoneTrimmed = values.phone.trim();
    if (phoneTrimmed.length > 25) {
      errors.phone = "Phone number is too long.";
    } else if (!/^[+0-9\s\-()]{7,25}$/.test(phoneTrimmed)) {
      errors.phone = "Please provide a valid phone number.";
    }
  }

  if (values.company && values.company.trim().length > 100) {
    errors.company = "Company name is too long.";
  }

  if (!values.projectType || !PROJECT_TYPES.includes(values.projectType as typeof PROJECT_TYPES[number])) {
    errors.projectType = "Please select a valid project type.";
  }

  if (!values.estimatedBudget || !ESTIMATED_BUDGETS.includes(values.estimatedBudget as typeof ESTIMATED_BUDGETS[number])) {
    errors.estimatedBudget = "Please select a valid estimated budget.";
  }

  if (!values.message || values.message.trim().length < 10) {
    errors.message = "Project description must be at least 10 characters.";
  } else if (values.message.trim().length > 3000) {
    errors.message = "Project description is too long (max 3000 characters).";
  }

  return errors;
}

function stripHtml(str?: string): string {
  if (!str) return "";
  return str.replace(/[<>]/g, "").trim();
}

export function sanitizeContactForm(values: Partial<ContactFormValues>): Partial<ContactFormValues> {
  return {
    fullName: stripHtml(values.fullName),
    email: values.email?.trim().toLowerCase().slice(0, 100) || "",
    phone: stripHtml(values.phone),
    company: stripHtml(values.company),
    projectType: values.projectType || "",
    estimatedBudget: values.estimatedBudget || "",
    message: stripHtml(values.message),
    honeypot: values.honeypot || "",
    leadSource: stripHtml(values.leadSource) || "Unknown",
    landingPage: stripHtml(values.landingPage) || "/",
    trafficSource: stripHtml(values.trafficSource) || "Direct",
    utmSource: stripHtml(values.utmSource) || "",
    utmMedium: stripHtml(values.utmMedium) || "",
    utmCampaign: stripHtml(values.utmCampaign) || "",
    utmTerm: stripHtml(values.utmTerm) || "",
    utmContent: stripHtml(values.utmContent) || "",
    referrer: stripHtml(values.referrer) || "",
    browser: stripHtml(values.browser) || "Other",
    device: stripHtml(values.device) || "Desktop",
    referenceId: stripHtml(values.referenceId) || "",
  };
}
