import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Parfums Unisexe - Décants 5ml & 10ml | Zakaria Fragrances",
  description: "Découvrez notre collection de parfums mixtes et de niche en formats nomades 5 ml et 10 ml.",
};

export default function UnisexePage() {
  return (
    <CategoryShowcase
      category="unisexe"
      title="Parfums Unisexe"
      subtitle="Décants d'Exception • 5 ml & 10 ml"
      description="Une collection de fragrances mixtes et de niche rares et captivantes conçues pour sublimer chaque personnalité sans distinction."
      heroImage="/assets/images/collection.jpeg"
    />
  );
}
