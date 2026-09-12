"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ExternalLink } from "lucide-react";

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
              <li>
                <Link href="/packs" className="hover:text-brand-gold transition-colors">
                  Packs &amp; Coffrets
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

          {/* Col 4: Réseaux Sociaux (Instagram & TikTok) */}
          <div>
            <h3 className="font-serif text-base mb-4 text-brand-gold uppercase tracking-wider font-semibold">
              Suivez-nous
            </h3>
            <p className="text-white/60 text-xs mb-4">
              Rejoignez notre communauté sur les réseaux pour découvrir nos nouveautés et arrivages exclusifs.
            </p>

            <div className="space-y-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/fsahi__fragrances?stkn=cGc0cDg5Y2IwYzlh&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-white/10 hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors block">
                      Instagram
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      @zakaria.fragrances
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-gold transition-colors" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@zakaria_fragrances"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-white/10 hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white shadow-md">
                    <svg
                      className="w-4 h-4 fill-current text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.16 8.16 0 0 0 5-1.68v-3.7a4.85 4.85 0 0 1-1.09-.98Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors block">
                      TikTok
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      @zakaria.fragrances
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-gold transition-colors" />
              </a>
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
