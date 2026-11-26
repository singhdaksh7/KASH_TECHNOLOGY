"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConsultationProvider } from "@/components/conversion/ConsultationContext";
import { FloatingContactButton } from "@/components/conversion/FloatingContactButton";
import { LeadTracker } from "@/components/conversion/LeadTracker";
import type { FooterConfig, HeaderConfig } from "@/lib/cms/types";

interface PublicSiteChromeProps {
  header: HeaderConfig;
  footer: FooterConfig;
  children: React.ReactNode;
}

/**
 * PublicSiteChrome renders the public website chrome (Navbar, Footer, FloatingContactButton, LeadTracker, ConsultationProvider).
 * It unconditionally excludes all /admin, /preview, and /api routes.
 *
 * For /admin/**:
 * - NO public Navbar
 * - NO public Footer
 * - NO FloatingContactButton
 * - NO LeadTracker
 * - Directly renders children so Admin begins immediately at the KASH CMS shell.
 */
export function PublicSiteChrome({ header, footer, children }: PublicSiteChromeProps) {
  const pathname = usePathname();

  const isAdminOrPreview =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/preview" ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/api/");

  if (isAdminOrPreview) {
    return <>{children}</>;
  }

  return (
    <ConsultationProvider>
      <Suspense fallback={null}>
        <LeadTracker />
      </Suspense>
      <Navbar config={header} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer config={footer} />
      <FloatingContactButton />
    </ConsultationProvider>
  );
}
