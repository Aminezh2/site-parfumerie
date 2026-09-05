import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Toute la Collection - Décants 5ml & 10ml | Zakaria Fragrances",
  description: "Explorez l'intégralité de nos parfums originaux pour Homme, Femme et Unisexe en décants 5 ml et 10 ml.",
};

export default function CollectionPage() {
  return (
    <CategoryShowcase
      category="all"
      title="Toute la Collection"
      subtitle="Décants d'Exception • 5 ml & 10 ml"
      description="Découvrez l'ensemble de notre catalogue de parfums 100% originaux disponibles en formats découverte 5 ml (~75 pschitts) et voyage 10 ml (~150 pschitts)."
      heroImage="/assets/images/collection.jpeg"
    />
  );
}
