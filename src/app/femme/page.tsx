import { Metadata } from "next";
import CategoryShowcase from "@/components/sections/CategoryShowcase";

export const metadata: Metadata = {
  title: "Parfums Femme - Décants 5ml & 10ml | Zakaria Fragrances",
  description: "Découvrez notre collection de fragrances féminines authentiques en formats nomades 5 ml et 10 ml. Jean Paul Gaultier, YSL, Chanel, MFK.",
};

export default function FemmePage() {
  return (
    <CategoryShowcase
      category="femme"
      title="Parfums Pour Femme"
      subtitle="Décants d'Exception • 5 ml & 10 ml"
      description="Des fragrances féminines d'exception, florales, orientales et gourmandes prélevées directement sur les flacons authentiques en contenants nomades de 5 ml et 10 ml."
      heroImage="/assets/images/scandal.jpg"
    />
  );
}
