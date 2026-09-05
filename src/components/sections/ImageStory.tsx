"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function ImageStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax effect for images
    const images = gsap.utils.toArray<HTMLElement>(".story-image-inner");
    images.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#080808] text-white relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Visual Showcase */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 group shadow-2xl">
            <div className="story-image-inner relative w-full h-[120%] -top-[10%]">
              <Image
                src="/assets/images/Brandinfo.jpeg"
                alt="L'art du Décant Zakaria Fragrances"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
              <span className="text-brand-gold text-[10px] tracking-widest uppercase block mb-1 font-mono">
                Prélèvement manuel à la seringue
              </span>
              <p className="text-white text-xs font-light">
                Chaque flacon est rempli au millilitre près avec soin et hygiène stérile.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Savoir-Faire & Précision</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              L'Art du Décant : <br />
              <span className="italic text-brand-gold">Le Luxe Accessible.</span>
            </h2>

            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
              Nous réinventons la façon de consommer la haute parfumerie. Grâce à nos formats nomades <strong className="text-brand-gold font-normal">5 ml (~75 pschitts)</strong> et <strong className="text-brand-gold font-normal">10 ml (~150 pschitts)</strong>, portez les plus grandes fragrances de niche sans acheter le flacon entier.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-brand-gold mb-2" />
                <h4 className="font-serif text-white text-sm mb-1 font-semibold">100% Authentique</h4>
                <p className="text-white/50 text-xs font-light">Directement prélevé du flacon original du créateur.</p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <Sparkles className="w-5 h-5 text-brand-gold mb-2" />
                <h4 className="font-serif text-white text-sm mb-1 font-semibold">Flacon Verre Premium</h4>
                <p className="text-white/50 text-xs font-light">Spray atomiseur haute diffusion anti-fuites.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
