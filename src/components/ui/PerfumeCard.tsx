"use client";

import { useState } from "react";
import Image from "next/image";
import { PerfumeItem } from "@/lib/db";
import ProductDetailModal from "@/components/ui/ProductDetailModal";
import { ArrowUpRight } from "lucide-react";

interface PerfumeCardProps {
  item: PerfumeItem;
  onOrder: (item: PerfumeItem, size: "5ml" | "10ml", quantity: number) => void;
  onAddToCart?: (item: PerfumeItem, size: "5ml" | "10ml") => void;
  priority?: boolean;
}

export default function PerfumeCard({ item, onOrder, priority = false }: PerfumeCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const validPrices = [item.price5ml, item.price10ml].filter((p) => typeof p === "number" && p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const isAvailable = (item.inStock !== false) && validPrices.length > 0;

  // Determine promo state and matching old price
  const isPromo = Boolean(
    item.isPromo ||
    (item.oldPrice5ml && item.oldPrice5ml > item.price5ml) ||
    (item.oldPrice10ml && item.oldPrice10ml > item.price10ml) ||
    (item.badge && item.badge.toLowerCase().includes("promo"))
  );

  let oldMinPrice: number | undefined;
  if (minPrice === item.price5ml && item.oldPrice5ml) {
    oldMinPrice = item.oldPrice5ml;
  } else if (minPrice === item.price10ml && item.oldPrice10ml) {
    oldMinPrice = item.oldPrice10ml;
  } else {
    oldMinPrice = item.oldPrice5ml || item.oldPrice10ml;
  }

  const discountPercent = oldMinPrice && oldMinPrice > minPrice ? Math.round(((oldMinPrice - minPrice) / oldMinPrice) * 100) : 0;
  const savingsDH = oldMinPrice && oldMinPrice > minPrice ? oldMinPrice - minPrice : 0;

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
        className={`group flex flex-col relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1 bg-background/40 backdrop-blur-sm border select-none h-full ${
          isAvailable
            ? "border-border hover:border-brand-gold/50"
            : "border-rose-500/30 opacity-85"
        }`}
      >
        {/* Perfume Image */}
        <div className="relative w-full aspect-[4/5] bg-background/20 overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Top Badges */}
          <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-brand-gold text-[9px] sm:text-xs tracking-widest uppercase font-mono font-bold bg-background/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md border border-brand-gold/40 shadow-sm">
                {item.brand}
              </span>
              {isPromo && (
                <span className="text-white text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 shadow-[0_4px_20px_rgba(225,29,72,0.6)] border border-red-300/60 flex items-center gap-1.5 animate-pulse">
                  🔥 {discountPercent > 0 ? `-${discountPercent}% PROMO` : "EN PROMO"}
                </span>
              )}
            </div>

            {isAvailable ? (
              <span className="text-[9px] sm:text-xs tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/80 text-foreground font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Stock
              </span>
            ) : (
              <span className="text-[9px] sm:text-xs tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-rose-500/80 text-foreground font-bold backdrop-blur-md shadow-sm">
                Épuisé
              </span>
            )}
          </div>
        </div>

        {/* Bottom Card Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-5 bg-gradient-to-b from-transparent via-background/60 to-background">
          {/* Perfume Name */}
          <div className="mb-2">
            <h3 className="font-serif text-sm sm:text-lg md:text-xl text-foreground font-bold leading-tight group-hover:text-brand-gold transition-colors">
              {item.name}
            </h3>
          </div>

          {/* Spacer to push price to bottom if names are different heights */}
          <div className="mt-auto" />

          {/* Price & Action Button */}
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-widest font-mono font-semibold">
                  {item.category === "pack" ? "Prix du Pack" : (minPrice > 0 ? (isPromo ? "🔥 Offre Spéciale Promo" : "À partir de") : "Disponibilité")}
                </span>
                {isPromo && savingsDH > 0 && (
                  <span className="text-[9px] sm:text-[10px] font-black text-emerald-300 uppercase px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/50 rounded shadow-sm">
                    Économisez {savingsDH} DH
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                {isPromo && oldMinPrice && oldMinPrice > minPrice && (
                  <span className="line-through text-red-400/80 decoration-red-500 decoration-2 text-xs sm:text-sm md:text-base font-bold tracking-tight">
                    {oldMinPrice} DH
                  </span>
                )}
                {minPrice > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`font-serif text-xl sm:text-2xl md:text-3xl font-black ${isPromo ? "text-amber-300 drop-shadow-[0_2px_10px_rgba(252,211,77,0.5)]" : "text-brand-gold"} leading-none`}>
                      {minPrice}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-extrabold uppercase ${isPromo ? "text-amber-300" : "text-brand-gold/80"}`}>DH</span>
                  </div>
                ) : (
                  <span className="text-rose-400 font-sans text-xs uppercase font-bold tracking-wider">
                    Hors commande
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
              className="w-full sm:w-auto py-2 px-4 bg-brand-gold hover:bg-brand-gold-light text-brand-black text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-brand-gold/30 active:scale-95 cursor-pointer"
            >
              <span>{item.category === "pack" ? "Commander Pack" : "Commander"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        perfume={item}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOrder={(perfume, size, qty) => {
          setIsDetailOpen(false);
          onOrder(perfume, size, qty);
        }}
      />
    </>
  );
}
