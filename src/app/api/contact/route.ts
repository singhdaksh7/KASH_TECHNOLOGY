import { NextResponse } from "next/server";
import { contactFormSchema, sanitizeString } from "@/lib/contact-schema";
import { sendContactEmails } from "@/lib/email-service";

// In-memory rate limiting map (IP -> { count, expiresAt })
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many inquiries received. Please wait a few minutes before submitting again or email founder@kash-technology.com directly.",
        },
        { status: 429 }
      );
    }

    const rawBody = await request.json();

    // Sanitize input strings
    const sanitizedBody = {
      fullName: sanitizeString(rawBody.fullName),
      email: sanitizeString(rawBody.email),
      phone: sanitizeString(rawBody.phone),
      company: sanitizeString(rawBody.company),
      serviceInterested: sanitizeString(rawBody.serviceInterested),
      projectBudget: sanitizeString(rawBody.projectBudget),
      message: sanitizeString(rawBody.message),
      honeypot: sanitizeString(rawBody.honeypot),
    };

    // Bot trap: if honeypot is filled, return silent success
    if (sanitizedBody.honeypot) {
      return NextResponse.json({
        success: true,
        message: "Thank you! Your enquiry has been received. We'll get back to you shortly.",
      });
    }

    // Server-side Zod validation
    const parseResult = contactFormSchema.safeParse(sanitizedBody);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted errors.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // Send emails via abstraction
    const emailResult = await sendContactEmails(validData);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to deliver message automatically. Please contact founder@kash-technology.com directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. We'll get back to you shortly.",
    });
  } catch (error) {
    console.error("[Contact API] Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again or email founder@kash-technology.com.",
      },
      { status: 500 }
    );
  }
}
