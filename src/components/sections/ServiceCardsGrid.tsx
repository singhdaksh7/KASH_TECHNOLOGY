import React from "react";
import Link from "next/link";
import { 
  Code2, 
  Smartphone, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
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
    title: "Website Development",
    description: "Modern, fast and conversion-focused websites.",
    icon: Code2,
    href: "/website-development",
  },
  {
    id: "software-crm",
    title: "Software & CRM",
    description: "Custom software, CRM and ERP solutions tailored for your workflow.",
    icon: Layers,
    href: "/custom-software-development",
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    description: "Android and iOS apps that solve real business needs.",
    icon: Smartphone,
    href: "/mobile-app-development",
  },
  {
    id: "content-creative",
    title: "Content & Creative",
    description: "Reels, videos, graphics and brand creative that connect.",
    icon: Sparkles,
    href: "/content-creation",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "SEO, social media and performance marketing for measurable ROI.",
    icon: TrendingUp,
    href: "/digital-marketing",
  },
  {
    id: "business-growth",
    title: "Business Growth",
    description: "Lead generation, automation and end-to-end digital support.",
    icon: Cpu,
    href: "/ai-automation",
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
  badge = "OUR SERVICES",
  title = "End-to-End Digital Solutions",
  subtitle = "From technology and branding to marketing and growth, we provide everything you need to take your business online.",
  limit,
  columns,
}: ServiceCardsGridProps) {
  const items = limit ? ALL_SERVICES.slice(0, limit) : ALL_SERVICES;
  const colCount = columns || (items.length <= 6 ? 3 : 4);

  return (
    <section className="py-16 md:py-20 bg-[#FFF9F4] text-[#0B0B0F] relative overflow-hidden border-b border-[#E8E5E2]">
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-2">
          {badge && (
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#FF5A00] bg-[#FFF3E9] px-3 py-1 rounded-md uppercase">
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0F]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto pt-1">
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
                className="group bg-white rounded-2xl p-6 border border-[#E8E5E2] hover:border-[#FF5A00]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Circular Orange Outline Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3E9] flex items-center justify-center text-[#FF5A00] group-hover:bg-[#FF5A00] group-hover:text-white transition-all duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold text-[#0B0B0F] group-hover:text-[#FF5A00] transition-colors duration-200">
                    {service.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Arrow */}
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#FF5A00] group-hover:translate-x-1 transition-transform duration-200">
                  <span>Learn More</span>
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
