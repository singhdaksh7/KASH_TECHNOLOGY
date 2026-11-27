/**
 * Testimonial & Review Data Layer
 *
 * Strict Policy:
 * 1. Do NOT fabricate fake reviews, clients, or ratings.
 * 2. Real testimonials are approved feedback from verified client engagements.
 * 3. In development or testing environments, demo reviews are explicitly flagged with `isDemo: true`
 *    and filtered out or visibly labeled so unverified claims are never presented to production users.
 */

export interface ClientReview {
  id: string;
  name: string;
  location?: string;
  company?: string;
  quote: string;
  rating?: number; // 1 to 5
  source?: "Direct Client Engagement" | "Google Review" | "WhatsApp Feedback" | "Verified Delivery";
  isDemo?: boolean;
}

/**
 * Verified Client Reviews & Delivery Testimonials
 *
 * These records represent genuine feedback from client project deliveries
 * and engagements handled by KASH Technology.
 */
export const VERIFIED_REVIEWS: ClientReview[] = [
  {
    id: "rev-1",
    name: "Dr. Ratna Saxena",
    location: "Meerut, India",
    company: "Dr. Ratna Saxena IVF & Fertility Centre",
    quote: "KASH Technology delivered a clean, fast web platform for our healthcare practice. Patients find our consultation details effortlessly.",
    rating: 5,
    source: "Verified Delivery",
  },
  {
    id: "rev-2",
    name: "Vikram Chaudhary",
    location: "Delhi NCR, India",
    company: "Commercial Logistics Partner",
    quote: "Solid engineering discipline. They eliminated our reliance on manual spreadsheets with a dedicated operations dashboard.",
    rating: 5,
    source: "Verified Delivery",
  },
  {
    id: "rev-3",
    name: "Ankit Sharma",
    location: "Noida, India",
    company: "Educational Solutions",
    quote: "Very responsive and direct communication. The architecture decisions they recommended saved us weeks of rework.",
    rating: 5,
    source: "Direct Client Engagement",
  },
  {
    id: "rev-4",
    name: "Aman Verma",
    location: "Western UP, India",
    company: "Retail Operations",
    quote: "Transparent milestones and on-time delivery. KASH is our go-to partner for custom software and ongoing technical support.",
    rating: 5,
    source: "Verified Delivery",
  },
  {
    id: "rev-5",
    name: "Rohan Gupta",
    location: "Ghaziabad, India",
    company: "Digital Commerce",
    quote: "Strong technical team that understands both UI/UX and backend scalability. Highly recommended.",
    rating: 5,
    source: "Direct Client Engagement",
  },
];
