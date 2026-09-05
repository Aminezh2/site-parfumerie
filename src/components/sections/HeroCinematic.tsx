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

      // Fade out text as we scroll down
      tl.to(text, {
        opacity: 0,
        y: -50,
        ease: "power2.inOut",
        duration: 0.5
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
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20"
      >
        <span className="text-brand-gold text-xs md:text-sm tracking-[0.3em] uppercase mb-4 opacity-90">
          La Collection Signature
        </span>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg tracking-wide">
          L'ART DE LA<br/>
          <span className="italic font-light">Fragrance</span>
        </h1>
        
        <p className="text-white/80 max-w-lg text-sm md:text-base font-light tracking-wide mb-10">
          Des parfums originaux, choisis selon vos envies. Une expérience olfactive à la hauteur de votre exigence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/collection"
            className="px-8 py-4 bg-brand-gold/90 backdrop-blur-md text-brand-black hover:bg-brand-gold transition-all duration-500 uppercase tracking-widest text-xs font-medium hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] text-center"
          >
            Découvrir la collection
          </Link>
          <Link
            href="/collection"
            className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-500 uppercase tracking-widest text-xs font-medium hover:border-white/40 text-center"
          >
            Explorer
          </Link>
        </div>
      </div>
    </section>
  );
}
