import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { ApiSection } from "@/components/marketing/api-section";
import { Cta } from "@/components/marketing/cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <ApiSection />
      <Cta />
    </>
  );
}
