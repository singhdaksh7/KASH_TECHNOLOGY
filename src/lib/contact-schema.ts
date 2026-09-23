import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  serviceInterested: z
    .string()
    .trim()
    .min(1, "Please select a service"),
  projectBudget: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Project details must be at least 10 characters")
    .max(3000, "Project details must be less than 3000 characters"),
  honeypot: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function sanitizeString(val: unknown): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/[<>]/g, "") // basic tag strip
    .trim();
}
