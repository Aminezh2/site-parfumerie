import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Parfums Homme - Décants 5ml & 10ml | Zakaria Fragrances",
  description: "Découvrez notre collection d'élixirs masculins authentiques en flacons décants de 5 ml et 10 ml. Dior, Creed, Paco Rabanne, Jean Paul Gaultier.",
};

export default function HommePage() {
  return (
    <CategoryShowcase
      category="homme"
      title="Parfums Pour Homme"
      subtitle="Décants d'Exception • 5 ml & 10 ml"
      description="Une sélection d'essences masculines de prestige conditionnées à la main depuis des flacons d'origine certifiés. Testez la puissance des plus grands créateurs en formats nomades 5 ml et 10 ml."
      heroImage="/assets/images/sauvage.jpg"
    />
  );
}
