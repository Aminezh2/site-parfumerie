"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PerfumeItem } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import {
  X,
  Droplets,
  ShoppingCart,
  Zap,
  Check,
  ShieldCheck,
  Plus,
  Minus,
  Truck,
  Award,
} from "lucide-react";

interface ProductDetailModalProps {
  perfume: PerfumeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder: (item: PerfumeItem, size: "5ml" | "10ml") => void;
}

export default function ProductDetailModal({
  perfume,
  isOpen,
  onClose,
  onOrder,
}: ProductDetailModalProps) {
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<"5ml" | "10ml">("5ml");
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Reset state when opening a new perfume
  useEffect(() => {
    if (isOpen) {
      setSelectedSize("5ml");
      setQuantity(1);
      setAddedToast(false);
    }
  }, [isOpen, perfume?.id]);

  if (!isOpen || !perfume) return null;

  const isAvailable = perfume.inStock !== false;
  const unitPrice = selectedSize === "5ml" ? perfume.price5ml : perfume.price10ml;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(perfume, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2500);
  };

  const handleQuickOrder = () => {
    if (!isAvailable) return;
    onOrder(perfume, selectedSize);
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Centered Modal Container (Not full-screen) */}
      <div className="relative w-full max-w-lg md:max-w-2xl max-h-[88vh] bg-[#0d0d0d] border border-brand-gold/40 text-white rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Ambient Gold Glow Backdrop */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-gold/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 text-white/70 hover:text-white bg-black/70 hover:bg-white/20 rounded-full border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast Notification Capsule */}
        {addedToast && (
          <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-8 z-40 bg-gradient-to-r from-emerald-500 to-teal-400 text-black py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3] bg-black text-emerald-400 rounded-full p-0.5" />
              <span>
                {quantity}x {perfume.name} ({selectedSize}) ajouté !
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="text-[11px] underline font-extrabold uppercase tracking-wider hover:opacity-80 ml-2"
            >
              Voir panier &rarr;
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5">
          
          {/* Top Section: Photo & Header in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Left: Compact Studio Image */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] max-w-[200px] sm:max-w-none rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-gradient-to-b from-white/5 via-black/40 to-black/80 group">
                {/* Halo behind bottle */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.25)_0%,_transparent_70%)] z-[1] pointer-events-none" />

                <Image
                  src={perfume.image}
                  alt={perfume.name}
                  fill
                  sizes="(max-width: 640px) 200px, 260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-[2] pointer-events-none" />

                {/* Badge 100% Original */}
                <div className="absolute top-2 left-2 z-[3] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] text-brand-gold border border-brand-gold/30 font-mono flex items-center gap-1">
                  <Award className="w-3 h-3 text-brand-gold" />
                  <span>100% Original</span>
                </div>

                {/* Badge Contenance */}
                <div className="absolute bottom-2 left-2 z-[3] bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] text-white/90 border border-white/20 font-mono flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-brand-gold" />
                  <span>{selectedSize}</span>
                </div>
              </div>
            </div>

            {/* Right: Brand, Name & Description */}
            <div className="sm:col-span-7 space-y-2 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-brand-gold text-xs tracking-[0.2em] uppercase font-mono font-bold">
                  {perfume.brand}
                </span>

                {isAvailable ? (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En Stock
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                    Épuisé
                  </span>
                )}
              </div>

              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-bold leading-snug">
                {perfume.name}
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                  {perfume.type || "Eau de Parfum"}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-semibold">
                  {perfume.category}
                </span>
              </div>

              <p className="text-white/70 text-xs font-light leading-relaxed pt-1 line-clamp-3">
                {perfume.description}
              </p>
            </div>
          </div>

          {/* Size Selector Box: 5ml vs 10ml */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 uppercase tracking-wider font-mono text-[10px] sm:text-xs">
                Contenance souhaitée :
              </span>
              <span className="text-brand-gold font-bold font-mono text-xs">
                {selectedSize === "5ml" ? "5 ml (~75 pschitts)" : "10 ml (~150 pschitts)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Option 5 ml */}
              <button
                type="button"
                onClick={() => setSelectedSize("5ml")}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  selectedSize === "5ml"
                    ? "bg-gradient-to-br from-brand-gold/20 via-brand-gold/10 to-black/80 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-brand-gold"
                    : "bg-white/[0.03] border-white/10 hover:border-white/30 text-white/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm sm:text-base font-bold text-white">5 ml</span>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    selectedSize === "5ml"
                      ? "border-brand-gold bg-brand-gold text-black"
                      : "border-white/30"
                  }`}>
                    {selectedSize === "5ml" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </div>
                <div className="font-serif text-sm sm:text-base font-bold text-brand-gold">
                  {perfume.price5ml} <span className="text-[10px] font-sans font-normal text-white/70">DH</span>
                </div>
              </button>

              {/* Option 10 ml */}
              <button
                type="button"
                onClick={() => setSelectedSize("10ml")}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  selectedSize === "10ml"
                    ? "bg-gradient-to-br from-brand-gold/20 via-brand-gold/10 to-black/80 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-brand-gold"
                    : "bg-white/[0.03] border-white/10 hover:border-white/30 text-white/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm sm:text-base font-bold text-white">10 ml</span>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    selectedSize === "10ml"
                      ? "border-brand-gold bg-brand-gold text-black"
                      : "border-white/30"
                  }`}>
                    {selectedSize === "10ml" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </div>
                <div className="font-serif text-sm sm:text-base font-bold text-brand-gold">
                  {perfume.price10ml} <span className="text-[10px] font-sans font-normal text-white/70">DH</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity & Live Total Price Row */}
          <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-white/70 font-medium">Quantité :</span>
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/15 rounded text-white/80 transition-colors cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold text-xs text-white font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/15 rounded text-white/80 transition-colors cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-white/50 uppercase tracking-widest block font-mono">
                Total
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-brand-gold leading-none">
                {totalPrice} <span className="text-xs font-sans font-normal text-white/80">DH</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              {/* Panier */}
              <button
                type="button"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className={`py-3 px-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border cursor-pointer ${
                  isAvailable
                    ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-brand-gold/50 text-white active:scale-[0.98]"
                    : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Panier</span>
              </button>

              {/* Commander direct */}
              <button
                type="button"
                disabled={!isAvailable}
                onClick={handleQuickOrder}
                className={`py-3 px-2 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(212,175,55,0.3)] cursor-pointer ${
                  isAvailable
                    ? "bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-500 text-brand-black hover:brightness-110 active:scale-[0.98]"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                <Zap className="w-4 h-4 fill-current shrink-0" />
                <span>Commander</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-white/50 pt-1">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Original</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
