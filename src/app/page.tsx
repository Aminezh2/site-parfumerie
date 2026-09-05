import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCinematic from "@/components/sections/HeroCinematic";
import BrandIntro from "@/components/sections/BrandIntro";
import ImageStory from "@/components/sections/ImageStory";
import DecantSelectionSection from "@/components/sections/DecantSelectionSection";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import FragranceDiscovery from "@/components/sections/FragranceDiscovery";
import TrustSection from "@/components/sections/TrustSection";
import BrandStory from "@/components/sections/BrandStory";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black w-full overflow-x-hidden">
      <Navbar />
      <HeroCinematic />
      <BrandIntro />
      <ImageStory />
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
