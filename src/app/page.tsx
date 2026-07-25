import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <Container as="section" className="py-24 sm:py-32">
      <Reveal>
        <p className="text-sm font-medium text-primary">Phase 1 — Foundation</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {SITE_CONFIG.companyName} design foundation is live.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
          Typography, colour tokens, spacing, navigation, footer and motion primitives are
          in place. The full homepage, product showrooms and case studies build on top of
          this in the phases that follow.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="primary">Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
          <Button variant="outline">Outline action</Button>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <Card variant="elevated">
          <p className="text-sm font-medium text-accent-exora">Exora</p>
          <p className="mt-2 text-sm text-muted">Cryptocurrency exchange showroom — Phase 3.</p>
        </Card>
        <Card variant="elevated">
          <p className="text-sm font-medium text-accent-schoolsync">SchoolSync</p>
          <p className="mt-2 text-sm text-muted">
            Multi-tenant school ERP showroom — Phase 4.
          </p>
        </Card>
        <Card variant="elevated">
          <p className="text-sm font-medium text-accent-launchpad">BSC Launchpad</p>
          <p className="mt-2 text-sm text-muted">Crypto launchpad showroom — Phase 5.</p>
        </Card>
      </div>
    </Container>
  );
}
