import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";
import { ConsultationProvider } from "@/components/conversion/ConsultationContext";
import { FloatingContactButton } from "@/components/conversion/FloatingContactButton";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.websiteUrl),
  title: {
    default: `${SITE_CONFIG.companyName} — Product Engineering Studio`,
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description: "KASH Technologies is a product engineering studio building fintech, education and web3 platforms.",
  keywords: ["Product Engineering", "Fintech", "SaaS", "Blockchain", "Web3", "Software Development"],
  authors: [{ name: SITE_CONFIG.companyName }],
  creator: SITE_CONFIG.companyName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.websiteUrl,
    title: `${SITE_CONFIG.companyName} — Product Engineering Studio`,
    description: "KASH Technologies is a product engineering studio building fintech, education and web3 platforms.",
    siteName: SITE_CONFIG.companyName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.companyName} — Product Engineering Studio`,
    description: "KASH Technologies is a product engineering studio building fintech, education and web3 platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": SITE_CONFIG.companyName,
  "url": SITE_CONFIG.websiteUrl,
  "description": "KASH Technologies is a product engineering studio building fintech, education and web3 platforms.",
  "email": SITE_CONFIG.contactEmail,
  "sameAs": [
    SITE_CONFIG.social.github,
    SITE_CONFIG.social.linkedin,
    SITE_CONFIG.social.twitter
  ].filter(Boolean)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConsultationProvider>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold"
          >
            Skip to main content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
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
