import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PublicSiteChrome } from "@/components/layout/PublicSiteChrome";
import { SITE_CONFIG } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";
import { ThemeStyle } from "@/components/cms/ThemeStyle";
import { getFooterConfig, getHeaderConfig, getSettings } from "@/lib/cms";
import { serializeJsonLd, siteGraph } from "@/lib/seo/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.websiteUrl),
  title: {
    default: "KASH Technology | Web, Software, Social Media & Digital Marketing Agency",
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description: "KASH Technology helps businesses build websites, apps and custom software, create video and social content, and grow through digital marketing, SEO, lead generation and automation. Serving Delhi NCR and Western Uttar Pradesh.",
  keywords: [
    "KASH Technology",
    "Full-Service Digital Agency",
    "Custom Software Development",
    "Web Development",
    "Mobile Apps",
    "Social Media Management",
    "Content Creation",
    "Video Editing",
    "Digital Marketing",
    "Performance Marketing",
    "Lead Generation",
    "SEO Services",
    "AI Automation",
    "ERP Systems",
    "CRM Systems"
  ],
  authors: [{ name: SITE_CONFIG.companyName }],
  creator: SITE_CONFIG.companyName,
  verification: gscVerification ? { google: gscVerification } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.websiteUrl,
    title: "KASH Technology | Web, Software, Social Media & Digital Marketing Agency",
    description: "KASH Technology helps businesses build websites, apps and custom software, create video and social content, and grow through digital marketing, SEO, lead generation and automation.",
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
    title: "KASH Technology | Web, Software, Social Media & Digital Marketing Agency",
    description: "Custom software, high-speed websites, video content, social media management, and automated lead generation.",
    images: [`${SITE_CONFIG.websiteUrl}/images/logo/kash-logo-emblem.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [header, footer, settings] = await Promise.all([getHeaderConfig(), getFooterConfig(), getSettings()]);
  const jsonLd = siteGraph(settings, "Build. Create. Grow. with KASH Technology");
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeStyle />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFF9F4] text-[#0B0B0F]">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#FF5A00] text-white px-4 py-2 rounded-lg font-bold"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
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
        <PublicSiteChrome header={header} footer={footer}>
          {children}
        </PublicSiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
