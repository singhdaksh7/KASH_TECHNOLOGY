import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURATED_LOCAL_SERVICES } from "@/lib/curated-local-services";
import { HeroDiagonal } from "@/components/sections/HeroDiagonal";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { CircuitBackground } from "@/components/branding/CircuitBackground";
import { CheckCircle2, Layers } from "lucide-react";

interface Props {
  params: Promise<{
    location: string;
    service: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { location: "baghpat", service: "website-development" },
    { location: "noida", service: "custom-software-development" },
    { location: "meerut", service: "erp-development" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location, service } = await params;
  const key = `${location}/${service}`;
  const data = CURATED_LOCAL_SERVICES[key];
  if (!data) return {};

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `/${location}/${service}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://kash-technology.com/${location}/${service}`,
    },
  };
}

export default async function CuratedLocalServicePage({ params }: Props) {
  const { location, service } = await params;
  const key = `${location}/${service}`;
  const data = CURATED_LOCAL_SERVICES[key];

  if (!data) {
    notFound();
  }

  return (
    <>
      {/* 1. Hero with Breadcrumbs & Context */}
      <HeroDiagonal
        badge={data.badge}
        titlePrimary={data.h1Primary}
        titleAccent={data.h1Accent}
        description={data.intro}
        primaryCtaText="Book a Consultation"
        primaryCtaHref="/contact"
        secondaryCtaText="View Portfolio"
        secondaryCtaHref="/portfolio"
        breadcrumbs={[
          { label: "Areas We Serve" },
          { label: data.locationName, href: `/${data.locationSlug}` },
          { label: data.serviceName },
        ]}
        quickLinks={[
          { label: `All ${data.locationName} Services`, href: `/${data.locationSlug}` },
          { label: "Custom Software", href: "/custom-software-development" },
          { label: "Website Development", href: "/website-development" },
        ]}
      />

      {/* 2. Key Deliverables on Ivory */}
      <section className="py-20 md:py-28 bg-[#f7f4ee] text-[#111827] relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 circuit-pattern-ivory opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              TECHNICAL DELIVERABLES
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827]">
              Engineered for {data.locationName} Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {data.deliverables.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:border-[#e86024]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#e86024]/10 border border-[#e86024]/20 flex items-center justify-center text-[#e86024] mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#111827] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-black/5 text-[10px] font-mono text-[#e86024] font-semibold">
                  DELIVERY SPECIFICATION
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Local Industrial Context on Dark */}
      <section className="py-20 md:py-28 bg-[#080808] text-white relative overflow-hidden border-b border-white/10">
        <CircuitBackground variant="dark" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#e86024] uppercase block">
              LOCAL INDUSTRY FIT
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Built for {data.locationName} Workflows
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {data.localContext.map((c) => (
              <div
                key={c.title}
                className="bg-[#0e0e12] rounded-2xl p-8 border border-white/5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a880] mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mb-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-white/5 text-[10px] font-mono text-[#c5a880]">
                  CUSTOM ARCHITECTURE
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Localized FAQs */}
      <FaqAccordion
        variant="ivory"
        faqs={data.faqs}
        title={`FAQs: ${data.serviceName} in ${data.locationName}`}
        badge="FREQUENTLY ASKED QUESTIONS"
      />

      {/* 5. Bottom CTA */}
      <CtaBanner
        variant="dark"
        title={`Ready to Build Your ${data.serviceName} in ${data.locationName}?`}
        subtitle="Direct technical consultation with our engineering team. Transparent timelines and clear deliverables."
        buttonText="Discuss Your Project"
        buttonHref="/contact"
      />
    </>
  );
}
