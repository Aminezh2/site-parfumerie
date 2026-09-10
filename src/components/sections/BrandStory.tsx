"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Quote } from "lucide-react";

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".story-text-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 md:py-28 bg-brand-black text-white relative overflow-hidden border-t border-white/5"
    >
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Quote Icon */}
          <div className="story-text-reveal w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold shadow-lg shadow-brand-gold/5">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
          </div>

          {/* Heading / Quote */}
          <h2 className="story-text-reveal font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug sm:leading-tight mb-5 sm:mb-6 text-white tracking-wide">
            &laquo; Un parfum n&apos;est pas simplement une fragrance.{" "}
            <span className="italic text-brand-gold-light">C&apos;est une signature.</span> &raquo;
          </h2>

          {/* Gold Divider Line */}
          <div className="story-text-reveal w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-6 sm:mb-8" />

          {/* Paragraph */}
          <p className="story-text-reveal text-white/70 text-xs sm:text-base md:text-lg font-light leading-relaxed mb-6 sm:mb-8 max-w-2xl px-2 sm:px-0">
            L&apos;excellence réside dans le détail. Chez <strong className="text-white font-medium">Zakaria Fragrances</strong>, nous ne proposons pas de simples parfums, mais des œuvres d&apos;art olfactives. Chaque décant est la promesse d&apos;une émotion, d&apos;un souvenir persistant et d&apos;une aura inoubliable.
          </p>

          {/* Signature badge */}
          <div className="story-text-reveal inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-mono text-brand-gold/90 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Maison Zakaria Fragrances</span>
          </div>
        </div>
      </div>
    </section>
  );
}
