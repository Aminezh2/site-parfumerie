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
            <span className="text-brand-gold text-[9px] sm:text-xs tracking-widest uppercase font-mono font-bold bg-background/70 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md border border-brand-gold/30 shadow-sm">
              {item.brand}
            </span>

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
        <div className="flex flex-col flex-1 p-3 sm:p-5 bg-gradient-to-b from-transparent to-background/40">
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
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest font-mono mb-0.5">
                {item.category === "pack" ? "Prix du Pack" : (minPrice > 0 ? "À partir de" : "Disponibilité")}
              </span>
              <div className="flex items-baseline gap-1">
                {minPrice > 0 ? (
                  <>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-brand-gold leading-none">
                      {minPrice}
                    </span>
                    <span className="text-[10px] sm:text-xs text-brand-gold/80 font-semibold uppercase">DH</span>
                  </>
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
