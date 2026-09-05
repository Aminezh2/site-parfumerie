"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function BrandIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (textRef.current && imageRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 80%",
        }
      });

      tl.fromTo(textRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      )
        .fromTo(imageRef.current,
          { scale: 1.05, opacity: 0, filter: "blur(10px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
          "-=0.8"
        );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-32 bg-brand-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-24">

        {/* Text Content */}
        <div ref={textRef} className="w-full lg:w-1/2 flex flex-col justify-center">
          <span className="text-brand-gold text-[10px] tracking-[0.3em] uppercase mb-8 block font-medium">
            Notre Philosophie
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl leading-[1.1] mb-10 text-balance tracking-tight">
            Votre signature <span className="italic font-light text-brand-gold-light">olfactive</span> commence ici.
          </h2>
          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-lg font-light">
            Nous sélectionnons des fragrances authentiques pour vous offrir une expérience olfactive à la hauteur de vos goûts. Des créations originales pensées pour sublimer votre personnalité.
          </p>
        </div>

        {/* Image Content */}
        <div className="w-full lg:w-1/2 relative h-[350px] md:h-[500px] lg:h-[700px]">
          <div ref={imageRef} className="relative w-full h-full overflow-hidden opacity-0">
            <Image
              src="/assets/images/Brandinfo.jpg"
              alt="Premium Perfume Bottle"
              fill
              className="object-cover object-right"
              sizes="(max-width: 1000px) 100vw, 50vw"
              priority
            />
            {/* Elegant overlay to blend image into dark background */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-brand-black/50" />
          </div>
        </div>

      </div>
    </section>
  );
}
