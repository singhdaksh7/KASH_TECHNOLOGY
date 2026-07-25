import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { ExoraShowcase } from "@/components/sections/ExoraShowcase";
import { SchoolSyncShowcase } from "@/components/sections/SchoolSyncShowcase";
import { LaunchpadShowcase } from "@/components/sections/LaunchpadShowcase";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <ExoraShowcase />
      <SchoolSyncShowcase />
      <LaunchpadShowcase />
      <ContactCTA />
    </>
  );
}
