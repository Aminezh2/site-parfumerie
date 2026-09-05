import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Parfums Unisexe & Niche - Décants 5ml & 10ml | Zakaria Fragrances",
  description: "Découvrez nos jus de niche et fragrances unisexes d'exception en décants 5ml et 10ml. Tom Ford, Le Labo, MFK.",
};

export default function UnisexePage() {
  return (
    <CategoryShowcase
      category="unisexe"
      title="Collection Unisexe &amp; Niche"
      subtitle="Décants d'Exception • 5 ml & 10 ml"
      description="Des signatures olfactives rares et envoûtantes conçues pour transcender les genres. Flacons nomades de 5 ml et 10 ml remplis à partir de bouteilles originales."
      heroImage="/assets/images/Perfume_bottle_on_black_pedestal_202609010307.jpeg"
    />
  );
}
