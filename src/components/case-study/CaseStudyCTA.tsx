import { LinkButton } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { Mail } from "lucide-react";

export function CaseStudyCTA() {
  return (
    <section className="py-24 px-8 max-w-[1280px] mx-auto border-t border-white/10 text-center">
      <div className="max-w-2xl mx-auto bg-primary/10 border border-primary/20 rounded-3xl p-12">
        <h2 className="text-4xl font-black mb-4 text-foreground">Planning a similar product?</h2>
        <p className="text-lg text-muted mb-8 max-w-lg mx-auto">
          {SITE_CONFIG.companyName} can help design, engineer and deploy a secure, scalable digital platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/#contact" variant="primary">
            Start a Project
          </LinkButton>
          <LinkButton href={`mailto:${SITE_CONFIG.contactEmail}`} variant="outline">
            <Mail className="w-4 h-4 mr-2 inline-block" />
            Contact {SITE_CONFIG.companyName}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
