"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const video = videoRef.current;
    const text = textRef.current;

    if (!container || !video || !text) return;

    // Make sure the video is loaded enough to know its duration
    video.onloadedmetadata = () => {
      // Pin the container
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=250%", // Scroll distance
          pin: true,
          scrub: 1, // Smooth scrubbing
        }
      });

      // Animate video progress
      tl.to(video, {
        currentTime: video.duration || 1, // Provide fallback for duration if missing
        ease: "none"
      }, 0);

      // Fade out text smoothly as we scroll down
      tl.to(text, {
        opacity: 0,
        y: -60,
        ease: "power2.inOut",
        duration: 0.45
      }, 0);
    };

    // Fallback if video takes too long to load or metadata is already loaded
    if (video.readyState >= 1) {
      video.onloadedmetadata(new Event('loadedmetadata'));
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-brand-black"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        src="/assets/video/Perfume_bottle_rotating_on_pedestal_202609011326.mp4"
        muted
        playsInline
        preload="metadata"
      // poster="/assets/images/perfume1.jpg" // We could use a poster
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/20 to-brand-black/80" />

      {/* Text Content */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16 z-10"
      >


        {/* Brand Title with Gold Shimmer */}
        <div className="relative inline-block mb-3 px-4">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider animate-shimmer-gold drop-shadow-[0_4px_35px_rgba(212,175,55,0.35)]">
            FSAHI FRAGRANCES
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-brand-gold text-xs sm:text-base md:text-lg tracking-[0.35em] uppercase font-mono font-semibold drop-shadow-md mb-6 sm:mb-8">
          PARFUMS ET DÉCANTS
        </p>

        {/* Description */}
        <p className="text-white/85 max-w-lg text-xs sm:text-sm md:text-base font-light tracking-wide mb-8 sm:mb-10 leading-relaxed px-4">
          Des parfums originaux, choisis selon vos envies. Une expérience olfactive à la hauteur de votre exigence.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link
            href="/collection"
            className="px-8 py-4 bg-brand-gold/90 backdrop-blur-md text-brand-black hover:bg-brand-gold transition-all duration-500 uppercase tracking-widest text-xs font-semibold hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] text-center rounded-sm"
          >
            Découvrir la collection
          </Link>

        </div>
      </div>
    </section>
  );
}
