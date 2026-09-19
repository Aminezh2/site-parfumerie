"use client";

import { useState } from "react";
import Image from "next/image";
import { PerfumeItem } from "@/lib/db";
import ProductDetailModal from "@/components/ui/ProductDetailModal";
import { Droplets, Sparkles, ArrowUpRight } from "lucide-react";

interface PerfumeCardProps {
  item: PerfumeItem;
  onOrder: (item: PerfumeItem, size: "5ml" | "10ml") => void;
  onAddToCart?: (item: PerfumeItem, size: "5ml" | "10ml") => void;
  priority?: boolean;
}

export default function PerfumeCard({ item, onOrder, priority = false }: PerfumeCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isAvailable = item.inStock !== false;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDetailOpen(true);
          }
        }}
        className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between border select-none min-h-[440px] sm:min-h-[480px] md:min-h-[520px] ${
          isAvailable
            ? "border-white/15 hover:border-brand-gold/70 hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)]"
            : "border-rose-500/30 opacity-85"
        }`}
      >
        {/* Large, Bright & Vibrant Perfume Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 opacity-100 brightness-[1.05] contrast-[1.02]"
          />

          {/* Smooth Gradient Overlay (Dégradation) focused on the bottom text area */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 card-gradient-overlay" />
        </div>

        {/* Top Badges: Brand & Stock Status */}
        <div className="relative z-10 p-4 flex items-center justify-between gap-2">
          <span className="text-brand-gold text-xs tracking-[0.2em] uppercase font-mono font-bold bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-gold/30 shadow-md">
            {item.brand}
          </span>

          {isAvailable ? (
            <span className="text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stock
            </span>
          ) : (
            <span className="text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold backdrop-blur-md">
              Épuisé
            </span>
          )}
        </div>

        {/* Bottom Card Pill Box: Name, Family, Price & Action */}
        <div className="relative z-10 m-3 sm:m-4 p-4 sm:p-5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-brand-gold/40 transition-all duration-300 flex flex-col gap-3 shadow-lg">
          {/* Perfume Name */}
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-bold leading-snug group-hover:text-brand-gold-light transition-colors line-clamp-1 drop-shadow-sm">
              {item.name}
            </h3>
            {item.family && (
              <p className="text-white/75 text-xs font-light tracking-wide line-clamp-1 mt-0.5">
                {item.family}
              </p>
            )}
          </div>

          {/* Price & Action Button */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-mono">
                Décants dès
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-none">
                  {item.price5ml}
                </span>
                <span className="text-xs text-brand-gold font-semibold">DH</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
              className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-brand-gold/40 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Commander</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        perfume={item}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOrder={(perfume, size) => {
          setIsDetailOpen(false);
          onOrder(perfume, size);
        }}
      />
    </>
  );
}
