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
    <footer className="bg-background text-foreground pt-16 pb-12 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">

            </Link>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xs mb-4">
              Des fragrances 100% originales sélectionnées avec rigueur en formats décants 5 ml &amp; 10 ml pour tester les plus grands parfums du monde.
            </p>

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
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-border hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-foreground shadow-md">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-brand-gold transition-colors block">
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
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-border hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground shadow-md">
                    <svg
                      className="w-4 h-4 fill-current text-foreground"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.16 8.16 0 0 0 5-1.68v-3.7a4.85 4.85 0 0 1-1.09-.98Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-brand-gold transition-colors block">
                      TikTok
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      @zakaria.fragrances
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-gold transition-colors" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-border hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-foreground shadow-md">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-brand-gold transition-colors block">
                      WhatsApp
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Contactez-nous
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-gold transition-colors" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white/[0.04] border border-border hover:border-brand-gold/60 rounded-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-foreground shadow-md">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-brand-gold transition-colors block">
                      Facebook
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Zakaria Fragrances
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-gold transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            onClick={handleSecretAdminTrigger}
            className="text-white/40 text-xs text-center sm:text-left cursor-default select-none"
            title=""
          >
            &copy; {new Date().getFullYear()} Fsahi Fragrances. Tous droits réservés.
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
