import React from "react";
import { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_CONFIG.companyName}`,
  description: "Learn how KASH Technologies collects, uses, processes, and protects your information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 2026">
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-slate-300">
            At {SITE_CONFIG.companyName}, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, process, and protect your information when you visit our website and use our contact tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">1. Information Submitted by Users</h2>
          <p className="text-slate-300">
            When you interact with our inquiry forms, request a consultation, or reach out to us directly, we may collect the following personal information that you choose to provide:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Name:</strong> To identify you and personalize our communications.</li>
            <li><strong>Email Address:</strong> To respond to your inquiry and send automated project confirmations.</li>
            <li><strong>Phone Number:</strong> For voice or messaging communication regarding your project.</li>
            <li><strong>Company Name:</strong> To understand your business context and organization scale.</li>
            <li><strong>Project Requirements & Message:</strong> Details about the software or digital product you wish to build.</li>
            <li><strong>Project Type & Estimated Budget Range:</strong> To qualify project fit and allocate resources.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">2. How Information is Used</h2>
          <p className="text-slate-300">
            We use the information we collect solely for business purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Responding to your project enquiries and answering questions.</li>
            <li>Understanding your technical requirements to prepare initial designs or scopes.</li>
            <li>Arranging and scheduling the requested 30-minute introductory consultations.</li>
            <li>Communicating with you regarding the requested services, updates, or direct technical support.</li>
            <li>Preventing misuse, fraud, and spam through anti-spam filters (such as honeypot checks).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">3. Email Processing and Infrastructure</h2>
          <p className="text-slate-300">
            Our contact form submissions and automated client acknowledgement emails are delivered and processed using **Resend**, a third-party transactional email service. All transmissions between our servers and Resend are encrypted using secure protocols.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">4. Website Analytics</h2>
          <p className="text-slate-300">
            We use **Vercel Web Analytics** to analyze traffic trends, visitor interactions, and overall website usability. This service measures:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Page visits and time spent on routes.</li>
            <li>General traffic source referrers.</li>
            <li>Anonymized website interactions (such as clicking demo links or starting the contact form).</li>
            <li>Conversion events (such as successful form submissions or consultation clicks).</li>
          </ul>
          <p className="text-slate-300">
            <strong>Important:</strong> Our analytics configuration strictly enforces that no personal or identifying information (such as your name, email, phone number, company, or message contents) is sent to, or stored by, Vercel Web Analytics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">5. Data Sharing and Service Providers</h2>
          <p className="text-slate-300">
            {SITE_CONFIG.companyName} does not sell, lease, or trade your personal information to third parties. We may share information only with trusted service providers necessary to operate our website and services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Vercel:</strong> For hosting, cloud computing infrastructure, and anonymized web analytics.</li>
            <li><strong>Resend:</strong> For processing transactional project emails.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">6. Data Retention</h2>
          <p className="text-slate-300">
            We retain your project enquiries and personal data only for as long as reasonably required to fulfill the purposes outlined in this policy, maintain accurate business records, resolve disputes, prevent system abuse, and comply with necessary legal obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">7. Security Precautions</h2>
          <p className="text-slate-300">
            We implement reasonable technical and organizational precautions to secure your data. However, please be aware that no transmission of information over the internet can be guaranteed as 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">8. User Requests and Rights</h2>
          <p className="text-slate-300">
            You may request access to, correction of, or permanent deletion of your personal data held by us. To submit a request, please contact our founder directly at:
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
