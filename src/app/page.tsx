import dynamic from "next/dynamic";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCinematic from "@/components/sections/HeroCinematic";
import BrandIntro from "@/components/sections/BrandIntro";

// Lazy loading for sections below the fold

const DecantSelectionSection = dynamic(() => import("@/components/sections/DecantSelectionSection"));
const FeaturedCollection = dynamic(() => import("@/components/sections/FeaturedCollection"));
const FragranceDiscovery = dynamic(() => import("@/components/sections/FragranceDiscovery"));
const TrustSection = dynamic(() => import("@/components/sections/TrustSection"));
const BrandStory = dynamic(() => import("@/components/sections/BrandStory"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black w-full overflow-x-hidden">
      <Navbar />
      <HeroCinematic />
      <BrandIntro />

      <DecantSelectionSection />
      <FeaturedCollection />
      <FragranceDiscovery />
      <TrustSection />
      <BrandStory />
      <FinalCTA />
      <Footer />
    </main>
  );
}
