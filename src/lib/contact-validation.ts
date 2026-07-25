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

  if (values.phone && values.phone.trim().length > 20) {
    errors.phone = "Phone number is too long.";
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
  } else if (values.message.trim().length > 2000) {
    errors.message = "Project description is too long (max 2000 characters).";
  }

  return errors;
}

export function sanitizeContactForm(values: Partial<ContactFormValues>): Partial<ContactFormValues> {
  return {
    fullName: values.fullName?.trim() || "",
    email: values.email?.trim().toLowerCase() || "",
    phone: values.phone?.trim() || "",
    company: values.company?.trim() || "",
    projectType: values.projectType || "",
    estimatedBudget: values.estimatedBudget || "",
    message: values.message?.trim() || "",
    honeypot: values.honeypot || "",
  };
}
