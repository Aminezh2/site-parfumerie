"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, PackageOpen, Layers } from "lucide-react";

export default function DecantSelectionSection() {
  return (
    <section id="decants" className="py-20 md:py-32 bg-brand-black text-white relative overflow-hidden border-t border-white/5">
      {/* Subtle Glowing Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">


          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight">
            Parfums d&apos;Origine en <br className="hidden sm:block" />
            <span className="italic text-brand-gold-light">Formats 5 ml &amp; 10 ml</span>
          </h2>

          <p className="text-white/70 font-light text-sm md:text-base leading-relaxed">
            Profitez de véritables parfums de grands créateurs prélevés directement sur les flacons originaux.
            Choisissez entre notre format découverte <strong className="text-brand-gold font-normal">5 ml (~75 pschitts)</strong> et notre format itinérant <strong className="text-brand-gold font-normal">10 ml (~150 pschitts)</strong>.
          </p>
        </div>

        {/* 4 Collection Cards: Homme, Femme, Unisexe, Packs & Coffrets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* Card 1: Homme */}
          <Link
            href="/homme"
            className="relative border cursor-pointer overflow-hidden group bg-black border-white/10 hover:border-brand-gold/70 transition-colors duration-500 rounded-2xl min-h-[420px] md:min-h-[480px]"
          >
            <Image
              src="/assets/images/man_category.jpeg"
              alt="Collection Homme"
              fill
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[1]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent z-[3] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

            <div className="absolute inset-0 z-[2] flex flex-col justify-end p-7 md:p-9">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-flex items-center gap-1.5 text-brand-gold text-[11px] tracking-[0.25em] uppercase font-mono font-semibold mb-2.5 opacity-90">
                  <span className="w-4 h-[1px] bg-brand-gold inline-block" />
                  Pour Lui
                </span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight drop-shadow-lg">
                  Collection<br />Homme 5ml &amp; 10ml
                </h3>
                <p className="text-white/75 font-light text-xs sm:text-sm md:text-base mb-5 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Boisés, épicés, aquatiques — les grands jus masculins en format décant 5 ml &amp; 10 ml.
                </p>
                <div className="flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase font-semibold text-brand-gold group-hover:text-white transition-colors duration-300">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Femme */}
          <Link
            href="/femme"
            className="relative border cursor-pointer overflow-hidden group bg-black border-white/10 hover:border-brand-gold/70 transition-colors duration-500 rounded-2xl min-h-[420px] md:min-h-[480px]"
          >
            <Image
              src="/assets/images/women_category.jpeg"
              alt="Collection Femme"
              fill
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[1]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent z-[3] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

            <div className="absolute inset-0 z-[2] flex flex-col justify-end p-7 md:p-9">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-flex items-center gap-1.5 text-brand-gold text-[11px] tracking-[0.25em] uppercase font-mono font-semibold mb-2.5 opacity-90">
                  <span className="w-4 h-[1px] bg-brand-gold inline-block" />
                  Pour Elle
                </span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight drop-shadow-lg">
                  Collection<br />Femme 5ml &amp; 10 ml
                </h3>
                <p className="text-white/75 font-light text-xs sm:text-sm md:text-base mb-5 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Floraux, orientaux, ambrés — les élixirs féminins d&apos;exception en décant 5 ml &amp; 10 ml.
                </p>
                <div className="flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase font-semibold text-brand-gold group-hover:text-white transition-colors duration-300">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Unisexe */}
          <Link
            href="/unisexe"
            className="relative border cursor-pointer overflow-hidden group bg-black border-white/10 hover:border-brand-gold/70 transition-colors duration-500 rounded-2xl min-h-[420px] md:min-h-[480px]"
          >
            <Image
              src="/assets/images/2.jpeg"
              alt="Collection Unisexe & Niche"
              fill
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[1]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent z-[3] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

            <div className="absolute inset-0 z-[2] flex flex-col justify-end p-7 md:p-9">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-flex items-center gap-1.5 text-brand-gold text-[11px] tracking-[0.25em] uppercase font-mono font-semibold mb-2.5 opacity-90">
                  <span className="w-4 h-[1px] bg-brand-gold inline-block" />
                  Pour Tous • Niche
                </span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight drop-shadow-lg">
                  Collection<br />Unisexe
                </h3>
                <p className="text-white/75 font-light text-xs sm:text-sm md:text-base mb-5 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Fragrances d&apos;auteurs et jus rares qui transcendent les codes avec audace et distinction.
                </p>
                <div className="flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase font-semibold text-brand-gold group-hover:text-white transition-colors duration-300">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 4: Packs & Coffrets */}
          <Link
            href="/packs"
            className="relative border cursor-pointer overflow-hidden group bg-black border-white/10 hover:border-brand-gold/70 transition-colors duration-500 rounded-2xl min-h-[420px] md:min-h-[480px]"
          >
            <Image
              src="/assets/images/1.jpeg"
              alt="Packs Découverte & Coffrets"
              fill
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[1]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent z-[3] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

            <div className="absolute inset-0 z-[2] flex flex-col justify-end p-7 md:p-9">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-flex items-center gap-1.5 text-brand-gold text-[11px] tracking-[0.25em] uppercase font-mono font-semibold mb-2.5 opacity-90">
                  <span className="w-4 h-[1px] bg-brand-gold inline-block" />
                  Assortiments &amp; Coffrets
                </span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight drop-shadow-lg">
                  Packs
                </h3>
                <p className="text-white/75 font-light text-xs sm:text-sm md:text-base mb-5 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Sélections thématiques de décants 5 ml &amp; 10 ml pour tester plusieurs créations d&apos;exception.
                </p>
                <div className="flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase font-semibold text-brand-gold group-hover:text-white transition-colors duration-300">
                  <span>Explorer les packs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Guarantees Footer Banner */}
        <div className="mt-12 p-6 md:p-8 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="font-serif text-lg text-white mb-1">Garantie 100% Parfum Original</h4>
            <p className="text-white/60 text-xs font-light max-w-xl">
              Chaque décant est soigneusement prélevé à la seringue stérile directement depuis le flacon authentique du fabricant. Aucun ajustement ni dilution.
            </p>
          </div>
          <Link
            href="/support"
            className="whitespace-nowrap px-6 py-3 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors text-xs uppercase tracking-widest font-medium rounded-xl cursor-pointer"
          >
            Besoin de conseil ?
          </Link>
        </div>

      </div>
    </section>
  );
}
