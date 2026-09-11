import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Packs & Coffrets Découverte - Décants | Zakaria Fragrances",
  description: "Découvrez nos packs exclusifs et coffrets de décants 5 ml et 10 ml combinant les plus grands chefs-d'œuvre de la parfumerie à prix préférentiel.",
};

export default function PacksPage() {
  return (
    <CategoryShowcase
      category="pack"
      title="Packs &amp; Coffrets Découverte"
      subtitle="Sélections Thématiques &bull; Tarifs Avantageux"
      description="Explorez nos assortiments exclusifs de plusieurs décants 5 ml et 10 ml sélectionnés par nos experts pour voyager à travers les plus belles signatures olfactives."
      heroImage="/assets/images/1.jpeg"
    />
  );
}
