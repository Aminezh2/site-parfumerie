"use client";

import { useState } from "react";
import Image from "next/image";
import { PerfumeItem } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import { Droplets, ShoppingCart, Check, Zap } from "lucide-react";

interface PerfumeCardProps {
  item: PerfumeItem;
  onOrder: (item: PerfumeItem, size: "5ml" | "10ml") => void;
  onAddToCart?: (item: PerfumeItem, size: "5ml" | "10ml") => void;
}

export default function PerfumeCard({ item, onOrder, onAddToCart }: PerfumeCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<"5ml" | "10ml">("10ml");
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const isAvailable = item.inStock !== false;
  const currentPrice = selectedSize === "5ml" ? item.price5ml : item.price10ml;

  const handleAddToCart = () => {
    addToCart(item, selectedSize, 1);
    setAddedToCartToast(true);
    if (onAddToCart) {
      onAddToCart(item, selectedSize);
    }
    setTimeout(() => {
      setAddedToCartToast(false);
    }, 2500);
  };

  return (
    <div
      className={`group bg-[#121212]/95 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl relative overflow-hidden shadow-2xl w-full ${
        isAvailable
          ? "border-white/12 hover:border-brand-gold/60 hover:shadow-brand-gold/10 hover:-translate-y-1"
          : "border-rose-500/20 opacity-80"
      }`}
    >
      {/* Toast Notification */}
      {addedToCartToast && (
        <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-3 z-30 bg-emerald-500 text-black py-2 px-2.5 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-3.5 h-3.5 font-extrabold stroke-[3]" />
          <span>Ajouté ({selectedSize}) !</span>
        </div>
      )}

      {/* Top Header / Badges */}
      <div className="flex items-center justify-between gap-1 mb-2.5">
        <span className="text-[9px] sm:text-[11px] tracking-[0.12em] uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 text-white/80 border border-white/10 font-mono font-medium truncate max-w-[65%]">
          {item.badge || item.family || item.type || "Décant"}
        </span>

        {isAvailable ? (
          <span className="text-[8px] sm:text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Stock
          </span>
        ) : (
          <span className="text-[8px] sm:text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold shrink-0">
            Épuisé
          </span>
        )}
      </div>

      {/* Product Photo Container */}
      <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-gradient-to-b from-black/30 via-black/50 to-black/90 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-colors">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-108 opacity-95 group-hover:opacity-100"
        />

        {/* Format Indicator Float Pill */}
        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] text-brand-gold border border-white/15 flex items-center gap-1 shadow-lg font-mono">
          <Droplets className="w-3 h-3 text-brand-gold shrink-0" />
          <span className="font-semibold">{selectedSize} ({selectedSize === "5ml" ? "~75 pschitts" : "~150 pschitts"})</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-3">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-brand-gold text-[10px] sm:text-xs tracking-[0.15em] uppercase font-mono font-bold truncate">
              {item.brand}
            </span>
            <span className="text-[9px] sm:text-[11px] text-white/50 truncate hidden sm:inline">{item.type}</span>
          </div>

          <h3 className="font-serif text-base sm:text-xl text-white font-bold mb-1 group-hover:text-brand-gold transition-colors leading-snug truncate">
            {item.name}
          </h3>

          <p className="text-white/70 text-[10px] sm:text-xs font-light line-clamp-2 leading-tight">
            {item.description}
          </p>
        </div>

        {/* Clear & Simple 5ml vs 10ml Format Selector */}
        <div className="pt-2.5 border-t border-white/10 space-y-2.5">
          <div className="text-[10px] text-white/50 uppercase tracking-wider font-mono font-medium flex items-center justify-between">
            <span>Contenance :</span>
            <span className="text-brand-gold font-bold">{selectedSize}</span>
          </div>

          {/* Large, Clear 5ml & 10ml Toggle Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSize("5ml")}
              className={`py-2 px-1.5 rounded-xl text-xs transition-all flex flex-col items-center justify-center cursor-pointer border ${
                selectedSize === "5ml"
                  ? "bg-brand-gold text-brand-black border-brand-gold shadow-lg shadow-brand-gold/15 font-extrabold scale-[1.02]"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30"
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm">5 ml</span>
              <span className={`text-[10px] ${selectedSize === "5ml" ? "text-brand-black/90 font-extrabold" : "text-brand-gold font-semibold"}`}>
                {item.price5ml} DH
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSize("10ml")}
              className={`py-2 px-1.5 rounded-xl text-xs transition-all flex flex-col items-center justify-center cursor-pointer border ${
                selectedSize === "10ml"
                  ? "bg-brand-gold text-brand-black border-brand-gold shadow-lg shadow-brand-gold/15 font-extrabold scale-[1.02]"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30"
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm">10 ml</span>
              <span className={`text-[10px] ${selectedSize === "10ml" ? "text-brand-black/90 font-extrabold" : "text-brand-gold font-semibold"}`}>
                {item.price10ml} DH
              </span>
            </button>
          </div>

          {/* Price Header */}
          <div className="flex items-center justify-between px-0.5 py-0.5">
            <span className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-wider font-mono">Prix total</span>
            <span className="font-serif text-lg sm:text-2xl font-bold text-brand-gold leading-none">
              {currentPrice} <span className="text-[10px] sm:text-xs font-sans font-normal">DH</span>
            </span>
          </div>

          {/* Dual Action Buttons: Panier & Commander */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {/* Button 1: Panier */}
            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`py-2.5 sm:py-3 px-1 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1 border cursor-pointer ${
                isAvailable
                  ? "bg-white/8 border-white/20 text-white hover:bg-white/20 hover:border-white/40 active:scale-[0.97]"
                  : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Panier</span>
            </button>

            {/* Button 2: Commander */}
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => onOrder(item, selectedSize)}
              className={`py-2.5 sm:py-3 px-1 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1 shadow-lg cursor-pointer ${
                isAvailable
                  ? "bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-500 text-brand-black hover:brightness-110 shadow-brand-gold/15 active:scale-[0.97]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Commander</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
