import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-semibold tracking-tight">{SITE_CONFIG.companyName}</p>
          <p className="mt-2 text-sm text-muted">
            Engineering-led product studio building fintech, education and web3 platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-foreground">Navigate</p>
            <ul className="mt-3 space-y-2">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Work</p>
            <ul className="mt-3 space-y-2">
              {Object.values(SITE_CONFIG.products).map((product) => (
                <li key={product.caseStudyPath}>
                  <Link
                    href={product.caseStudyPath}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Contact</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE_CONFIG.companyName}. All rights reserved.
        </p>
        <p>Product demonstrations use local dummy data only.</p>
      </Container>
    </footer>
  );
}
