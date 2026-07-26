import React from "react";
import { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_CONFIG.companyName}`,
  description: "Read the Terms of Service governing the use of KASH Technologies' portfolio, demos, and project inquiry tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 2026">
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-slate-300">
            Welcome to the website of {SITE_CONFIG.companyName} (“we”, “us”, or “our”). By accessing or using our website, portfolio, project enquiry forms, and interactive product demonstrations, you agree to comply with and be bound by the following Terms of Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">1. Website Purpose</h2>
          <p className="text-slate-300">
            This website is designed to showcase {SITE_CONFIG.companyName}’s digital product engineering capabilities, services, past client case studies, and interactive software prototypes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">2. Interactive Demonstration Functionality</h2>
          <p className="text-slate-300">
            Our portfolio features interactive software prototypes to showcase user experience (UX) and design execution. You explicitly acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Exora Interactions:</strong> All trading, wallet, biometric, and security actions are simulated mockups. No real orders are routed and no cryptocurrency transactions occur.</li>
            <li><strong>SchoolSync Records:</strong> All metrics, student lists, reports, grades, and parent-teacher details are simulated local fictional data. No real databases or schools are accessed.</li>
            <li><strong>Crypto Launchpad:</strong> The token generation, presale setups, and contract deployment modules do not connect to live blockchain mainnets or deploy active smart contracts. No real digital assets are minted.</li>
            <li><strong>Payments & Transactions:</strong> Any billing, invoice, subscription, or checkout interactions in the demos are purely local mockups and do not process real money or connect to payment gateways.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">3. No Professional or Financial Advice</h2>
          <p className="text-slate-300">
            The content, portfolio descriptions, and product demonstrations are provided for marketing, engineering showcase, and illustration purposes only. Nothing on this website constitutes financial, investment, legal, regulatory, or other professional advice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">4. Project Enquiries and Business Fit</h2>
          <p className="text-slate-300">
            Submitting a contact form, requesting a 30-minute consultation, or initiating correspondence through this website:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Does not create an active service agreement, contract, or partnership.</li>
            <li>Does not guarantee project acceptance or capacity availability.</li>
            <li>Does not constitute a fixed quotation or bid.</li>
          </ul>
          <p className="text-slate-300">
            Any project engagement, pricing structure, and delivery timeline will require a separate, mutually signed written scope of work, pricing agreement, and formal service contract.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">5. Intellectual Property</h2>
          <p className="text-slate-300">
            The design, layout, graphics, content, code demonstrations, branding, and original source files on this website are the intellectual property of {SITE_CONFIG.companyName} (or respective third-party licensors) and are protected by applicable intellectual property laws. You may not copy, reproduce, republish, or exploit any materials without our prior written consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">6. External Links and Portals</h2>
          <p className="text-slate-300">
            Links to external services, including the live project links for Exora, SchoolSync, and Crypto Launchpad, are provided for convenience and demonstration. {SITE_CONFIG.companyName} has no control over, and assumes no responsibility or liability for, the availability, content, policies, or practices of third-party platforms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">7. Website Availability and Modifications</h2>
          <p className="text-slate-300">
            We reserve the right to modify, update, suspend, or discontinue the website, case studies, or interactive demonstrations at any time, for any reason, without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">8. Disclaimer and Limitation of Liability</h2>
          <p className="text-slate-300">
            To the maximum extent permitted by applicable law, this website, its content, and all product demonstrations are provided on an “as is” and “as available” basis without warranties of any kind. {SITE_CONFIG.companyName} will not be liable for any direct, indirect, incidental, or consequential losses or damages arising out of your use of or reliance on the portfolio demonstrations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">9. Contact Information</h2>
          <p className="text-slate-300">
            If you have any questions or require clarification regarding these Terms of Service, please contact us at:
          </p>
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2 text-sm">
            <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-blue-400 hover:underline">{SITE_CONFIG.contactEmail}</a></p>
            <p><strong>Primary Phone:</strong> {SITE_CONFIG.contactPhonePrimary}</p>
            <p><strong>Alternate Phone:</strong> {SITE_CONFIG.contactPhoneAlternate}</p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
