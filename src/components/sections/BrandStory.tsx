"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current) {
      gsap.fromTo(
        ".story-text-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-32 bg-brand-black text-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="story-text-reveal font-serif text-3xl md:text-5xl lg:text-7xl leading-tight mb-8">
            "UN PARFUM N'EST PAS SIMPLEMENT UNE FRAGRANCE. C'EST UNE SIGNATURE."
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8 story-text-reveal" />
          <p className="story-text-reveal text-white/60 text-lg md:text-xl font-light leading-relaxed mb-16">
            L'excellence réside dans le détail. Chez Zakaria Fragrances, nous ne proposons pas de simples parfums, mais des œuvres d'art olfactives. Chaque flacon est la promesse d'une émotion, d'un souvenir persistant, d'une aura inoubliable.
          </p>
        </div>

        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden story-text-reveal">
          <Image
            src="/assets/images/footer_pic.jpeg"
            alt="La philosophie Zakaria"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black" />
        </div>
      </div>
    </section>
  );
}
