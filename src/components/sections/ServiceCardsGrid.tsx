import React from "react";
import Link from "next/link";
import { 
  Code2, 
  Smartphone, 
  Laptop, 
  BrainCircuit, 
  Users2, 
  ShoppingCart, 
  PlugZap, 
  CloudSun, 
  ArrowRight 
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

export const ALL_SERVICES: ServiceItem[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Fast websites built for growth.",
    icon: Code2,
    href: "/services",
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    description: "Reliable apps for Android and iOS.",
    icon: Smartphone,
    href: "/services",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description: "Software built around your workflow.",
    icon: Laptop,
    href: "/services",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Automate repetitive business tasks.",
    icon: BrainCircuit,
    href: "/services",
  },
  {
    id: "erp-crm",
    title: "ERP / CRM Systems",
    description: "Manage operations and customers.",
    icon: Users2,
    href: "/services",
  },
  {
    id: "ecommerce",
    title: "E-commerce Solutions",
    description: "Scalable online selling platforms.",
    icon: ShoppingCart,
    href: "/services",
  },
  {
    id: "api-integrations",
    title: "API Integrations",
    description: "Connect your tools and systems.",
    icon: PlugZap,
    href: "/services",
  },
  {
    id: "cloud-deployment",
    title: "Cloud Deployment",
    description: "Scalable, reliable infrastructure.",
    icon: CloudSun,
    href: "/services",
  },
];

interface ServiceCardsGridProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  columns?: 3 | 4;
}

export function ServiceCardsGrid({
  badge = "WHAT WE DO",
  title = "Technology Services",
  subtitle,
  limit,
  columns,
}: ServiceCardsGridProps) {
  const items = limit ? ALL_SERVICES.slice(0, limit) : ALL_SERVICES;
  const colCount = columns || (limit === 6 ? 3 : 4);

  return (
    <section className="py-16 md:py-20 bg-[#fbf8f2] text-[#111827] relative overflow-hidden border-b border-black/5">
      {/* Subtle Circuit Pattern Overlay */}
      <div className="absolute inset-0 circuit-pattern-ivory opacity-35 pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          {badge && (
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#f36b21] uppercase block">
              {badge}
            </span>
          )}
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#111827]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#6b7280] max-w-xl mx-auto pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Grid Layout */}
        <div 
          className={
            colCount === 3
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          }
        >
          {items.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group bg-white rounded-2xl p-6 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(243,107,33,0.1)] hover:border-[#f36b21]/40 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  {/* Circular Orange Outline Icon */}
                  <div className="w-11 h-11 rounded-xl bg-[#f36b21]/10 border border-[#f36b21]/20 flex items-center justify-center text-[#f36b21] mb-4 group-hover:bg-[#f36b21] group-hover:text-white transition-all duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif-heading text-lg font-bold text-[#111827] mb-1.5 group-hover:text-[#f36b21] transition-colors duration-200">
                    {service.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-normal mb-4">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Arrow */}
                <div className="pt-1 flex items-center text-[#f36b21] group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
