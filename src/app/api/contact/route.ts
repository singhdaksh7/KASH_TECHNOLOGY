import { NextResponse } from "next/server";
import { ContactFormValues, ContactResponse } from "@/types/contact";
import { validateContactForm, sanitizeContactForm } from "@/lib/contact-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeContactForm(body) as ContactFormValues;
    const errors = validateContactForm(sanitizedData);

    if (Object.keys(errors).length > 0) {
      if (errors.honeypot) {
        // Silently accept honeypot hits to deter bots
        return NextResponse.json<ContactResponse>({ success: true, message: "Thank you for your inquiry." });
      }
      return NextResponse.json<ContactResponse>({ success: false, message: "Validation failed", errors }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "founder@kash-technology.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "KASH Technologies <website@kash-technology.com>";

    if (!resendApiKey) {
      // Fake success or 503 depending on preference. The spec says:
      // "Return a clear 503 configuration response. Show an honest message such as: Online inquiry delivery is not configured yet. Please contact us by email."
      return NextResponse.json<ContactResponse>({ 
        success: false, 
        message: "Online inquiry delivery is not configured yet. Please contact us by email at " + contactEmail,
      }, { status: 503 });
    }

    // In a real environment, we would use Resend SDK:
    // await resend.emails.send({ ... })
    // For now, simulate the fetch if configured.
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: contactEmail,
        reply_to: sanitizedData.email,
        subject: `New Project Inquiry: ${sanitizedData.projectType}`,
        text: `
Name: ${sanitizedData.fullName}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone || 'N/A'}
Company: ${sanitizedData.company || 'N/A'}
Project Type: ${sanitizedData.projectType}
Estimated Budget: ${sanitizedData.estimatedBudget}

Project Description:
${sanitizedData.message}
        `,
      }),
    });

    if (!res.ok) {
      throw new Error("Email delivery failed");
    }

    return NextResponse.json<ContactResponse>({ 
      success: true, 
      message: "Thank you for your inquiry. We will get back to you shortly." 
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json<ContactResponse>({ 
      success: false, 
      message: "An unexpected server error occurred. Please try again later." 
    }, { status: 500 });
  }
}
