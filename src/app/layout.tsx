import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";
import { ConsultationProvider } from "@/components/conversion/ConsultationContext";
import { FloatingContactButton } from "@/components/conversion/FloatingContactButton";
import { LeadTracker } from "@/components/conversion/LeadTracker";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.websiteUrl),
  title: {
    default: `${SITE_CONFIG.companyName} | Custom Software, Web, Mobile, ERP & AI Solutions`,
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description: "KASH Technology is a custom software development agency building websites, custom web apps, mobile apps, SaaS, ERP, CRM, and AI automation tailored to your business.",
  keywords: [
    "KASH Technology",
    "Custom Software Development",
    "Web Development",
    "Mobile Apps",
    "AI Automation",
    "ERP Systems",
    "CRM Systems",
    "SaaS Platforms",
    "E-commerce Solutions"
  ],
  authors: [{ name: SITE_CONFIG.companyName }],
  creator: SITE_CONFIG.companyName,
  verification: gscVerification ? { google: gscVerification } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.websiteUrl,
    title: `${SITE_CONFIG.companyName} | ${SITE_CONFIG.tagline}`,
    description: "Tailored, Affordable & Scalable custom software, mobile apps, AI automation, and digital platforms.",
    siteName: SITE_CONFIG.companyName,
    images: [
      {
        url: `${SITE_CONFIG.websiteUrl}/images/logo/kash-logo-emblem.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.companyName} — ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.companyName} | ${SITE_CONFIG.tagline}`,
    description: "Custom software development agency building websites, mobile apps, and business solutions that scale.",
    images: [`${SITE_CONFIG.websiteUrl}/images/logo/kash-logo-emblem.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.websiteUrl}/#organization`,
      "name": SITE_CONFIG.companyName,
      "url": SITE_CONFIG.websiteUrl,
      "logo": `${SITE_CONFIG.websiteUrl}/images/logo/kash-logo-emblem.jpg`,
      "email": SITE_CONFIG.contactEmail,
      "telephone": SITE_CONFIG.contactPhonePrimary,
      "slogan": SITE_CONFIG.tagline,
      "description": "Custom software development agency delivering tailored, affordable, and scalable web platforms, mobile apps, ERP/CRM systems, and AI automation.",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": SITE_CONFIG.contactPhonePrimary,
          "contactType": "sales",
          "email": SITE_CONFIG.contactEmail,
          "areaServed": ["IN", "Worldwide"],
          "availableLanguage": ["English", "Hindi"]
        }
      ],
      "sameAs": [
        SITE_CONFIG.social.github,
        SITE_CONFIG.social.linkedin
      ].filter(Boolean)
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.websiteUrl}/#website`,
      "url": SITE_CONFIG.websiteUrl,
      "name": SITE_CONFIG.companyName,
      "description": "Custom Apps, Websites & Business Solutions That Scale",
      "publisher": {
        "@id": `${SITE_CONFIG.websiteUrl}/#organization`
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] text-white">
        <ConsultationProvider>
          <Suspense fallback={null}>
            <LeadTracker />
          </Suspense>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#e86024] text-white px-4 py-2 rounded-lg font-bold"
          >
            Skip to main content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <FloatingContactButton />
          <Analytics />
        </ConsultationProvider>
      </body>
    </html>
  );
}
