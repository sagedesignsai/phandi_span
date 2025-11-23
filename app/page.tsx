import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { CTASection } from "@/components/marketing/cta-section";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function Home() {
  return (
    <>
      <MarketingHeader />
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}
