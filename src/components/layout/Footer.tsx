import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {

  return (
    <footer className="py-16 border-t border-border bg-black">
      <Container className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-6">
          <div className="text-3xl font-black tracking-tighter">{SITE_CONFIG.companyName}</div>
          <p className="text-muted max-w-sm text-lg">
            Precision Engineering for Modern Product Teams. We build the future of digital assets and enterprise software.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h2 className="text-primary font-black uppercase tracking-widest text-sm">Navigate</h2>
            <ul className="space-y-4 font-medium">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-primary font-black uppercase tracking-widest text-sm">Work</h2>
            <ul className="space-y-4 font-medium">
              {Object.values(SITE_CONFIG.products).map((product) => (
                <li key={product.caseStudyPath}>
                  <Link
                    href={product.caseStudyPath}
                    className="text-muted transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-primary font-black uppercase tracking-widest text-sm">Contact</h2>
            <ul className="space-y-4 font-medium">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="text-muted transition-colors hover:text-primary"
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.contactPhonePrimary?.replace(/\s+/g, '')}`}
                  className="text-muted transition-colors hover:text-primary"
                >
                  +91 97609 42003
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.contactPhoneAlternate?.replace(/\s+/g, '')}`}
                  className="text-muted transition-colors hover:text-primary"
                >
                  +91 97606 58804 (Alternate contact)
                </a>
              </li>
              <li>
                <a href="#" className="text-muted transition-colors hover:text-primary">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="pt-16 text-muted/40 text-sm font-medium flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <p>
            © 2026 {SITE_CONFIG.companyName}. All rights reserved.
          </p>
          <p className="text-xs opacity-75">Product demonstrations use local dummy data only.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  );
}
