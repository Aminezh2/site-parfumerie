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
}

export default function PerfumeCard({ item, onOrder }: PerfumeCardProps) {
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
        className={`group bg-[#121212]/95 backdrop-blur-md border rounded-2xl p-3 sm:p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-xl hover:shadow-2xl text-left select-none ${
          isAvailable
            ? "border-white/10 hover:border-brand-gold/60 hover:shadow-brand-gold/10 hover:-translate-y-1.5 active:scale-[0.98]"
            : "border-rose-500/20 opacity-80"
        }`}
      >
        {/* Top Badges: Brand & Availability */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="text-brand-gold text-[10px] sm:text-xs tracking-[0.18em] uppercase font-mono font-bold truncate max-w-[65%]">
            {item.brand}
          </span>

          {isAvailable ? (
            <span className="text-[8px] sm:text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Stock
            </span>
          ) : (
            <span className="text-[8px] sm:text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold shrink-0">
              Épuisé
            </span>
          )}
        </div>

        {/* Product Photo */}
        <div className="relative aspect-[4/5] w-full mb-3 overflow-hidden bg-gradient-to-b from-white/5 to-black/80 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-colors">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-95 group-hover:opacity-100"
          />

          {/* Formats indicator badge overlay */}
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] text-white/90 border border-white/15 flex items-center gap-1 font-mono">
            <Droplets className="w-3 h-3 text-brand-gold shrink-0" />
            <span>5 ml &amp; 10 ml</span>
          </div>

          {/* Quick view icon on hover */}
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-brand-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Product Text & Price Details */}
        <div className="flex-1 flex flex-col justify-between pt-1">
          {/* Perfume Name */}
          <h3 className="font-serif text-sm sm:text-base md:text-lg text-white font-bold mb-2 group-hover:text-brand-gold transition-colors leading-snug line-clamp-1">
            {item.name}
          </h3>

          {/* Price & Action Section */}
          <div className="pt-2 border-t border-white/10 flex items-end justify-between gap-1">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider font-mono">
                À partir de
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-base sm:text-xl font-bold text-brand-gold leading-none">
                  {item.price5ml}
                </span>
                <span className="text-[10px] sm:text-xs text-brand-gold font-normal">DH</span>
              </div>
            </div>

            {/* Tap indicator button */}
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-lg bg-white/5 group-hover:bg-brand-gold group-hover:text-brand-black text-white/70 border border-white/10 group-hover:border-brand-gold transition-all shrink-0 flex items-center gap-1">
              <span>Choisir</span>
              <Sparkles className="w-2.5 h-2.5" />
            </span>
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
