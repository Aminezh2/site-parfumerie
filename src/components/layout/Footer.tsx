"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  // Hidden secret trigger: clicking 4 times on the copyright text redirects to /login
  const handleSecretAdminTrigger = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 4) {
      setClickCount(0);
      router.push("/login");
    }
  };

  return (
    <footer className="bg-[#040404] text-white pt-16 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl text-white tracking-wider block">
                Zakaria Fragrances
              </span>
              <span className="text-[0.65rem] text-brand-gold tracking-[0.2em] uppercase mt-0.5 block font-mono">
                Perfumes &amp; Decants
              </span>
            </Link>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xs mb-4">
              Des fragrances 100% originales sélectionnées avec rigueur en formats décants 5 ml &amp; 10 ml pour tester les plus grands parfums du monde.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jus authentiques certifiés</span>
            </div>
          </div>

          {/* Col 2: Boutique */}
          <div>
            <h3 className="font-serif text-base mb-4 text-brand-gold uppercase tracking-wider font-semibold">
              Boutique
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/collection" className="hover:text-brand-gold transition-colors">
                  Toute la Collection
                </Link>
              </li>
              <li>
                <Link href="/homme" className="hover:text-brand-gold transition-colors">
                  Parfums Homme
                </Link>
              </li>
              <li>
                <Link href="/femme" className="hover:text-brand-gold transition-colors">
                  Parfums Femme
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Maison & Services */}
          <div>
            <h3 className="font-serif text-base mb-4 text-brand-gold uppercase tracking-wider font-semibold">
              Services &amp; Engagement
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/70">
              <li>
                <Link href="/#decants" className="hover:text-brand-gold transition-colors">
                  Le concept des Décants
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-brand-gold transition-colors">
                  Support &amp; Service Client
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-brand-gold transition-colors">
                  Conseils Olfactifs Sur-Mesure
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Garanties */}
          <div>
            <h3 className="font-serif text-base mb-4 text-brand-gold uppercase tracking-wider font-semibold">
              Nos Garanties
            </h3>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% Jus Original prélevé directement du flacon fabricant.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Livraison rapide partout au Maroc avec paiement en espèces (COD).</span>
              </div>
              <div className="flex items-start gap-2">
                <Headphones className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Assistance directe et suivi WhatsApp 7j/7.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            onClick={handleSecretAdminTrigger}
            className="text-white/40 text-xs text-center sm:text-left cursor-default select-none"
            title=""
          >
            &copy; {new Date().getFullYear()} Zakaria Fragrances. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-white/50 text-xs">
            <span>Paiement à la livraison (COD)</span>
            <span>&bull;</span>
            <span>Flacons Atomiseurs Verre</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
