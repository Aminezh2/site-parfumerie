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
  Sparkles,
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
    }, 2800);
  };

  const handleQuickOrder = () => {
    if (!isAvailable) return;
    onOrder(perfume, selectedSize);
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] bg-[#0c0c0c] border border-brand-gold/30 text-white rounded-t-3xl sm:rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        
        {/* Ambient Gold Glow Backdrops */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-gold/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Mobile Drag/Pull Indicator Bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 text-white/70 hover:text-white bg-black/75 hover:bg-white/20 rounded-full border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast Notification Capsule */}
        {addedToast && (
          <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-8 z-40 bg-gradient-to-r from-emerald-500 to-teal-400 text-black py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] animate-in fade-in slide-in-from-top-4 duration-300">
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
        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 md:p-8 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column: Grande Image avec Dégradé Studio Professionnel */}
          <div className="md:col-span-6 flex flex-col items-center justify-between">
            {/* Image Box avec Studio Lighting & Dégradé de Luxe */}
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-full min-h-[300px] md:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 group bg-[#080808]">
              
              {/* Studio Spotlight Halo Glow derrière le flacon */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.22)_0%,_rgba(0,0,0,0.4)_50%,_rgba(0,0,0,0.95)_100%)] z-[1] pointer-events-none" />

              {/* Photo HD du Parfum */}
              <Image
                src={perfume.image}
                alt={perfume.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 filter contrast-105"
                priority
              />

              {/* Dégradés cinématiques multicouches (Vignette & Ombrage pro) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/40 z-[2] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0c0c0c]/80 z-[2] pointer-events-none" />

              {/* Badge flottant en haut à gauche : Authenticité */}
              <div className="absolute top-3.5 left-3.5 z-[3] bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] text-brand-gold border border-brand-gold/40 font-mono flex items-center gap-1.5 shadow-xl">
                <Award className="w-3.5 h-3.5 text-brand-gold" />
                <span className="font-semibold tracking-wide">100% Jus Authentique</span>
              </div>

              {/* Badge flottant en bas : Info Contenance active */}
              <div className="absolute bottom-3.5 inset-x-3.5 z-[3] bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] sm:text-xs text-white/90 border border-white/20 font-mono flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-1.5 text-brand-gold">
                  <Droplets className="w-4 h-4" />
                  <span className="font-bold">{selectedSize}</span>
                </div>
                <span className="text-white/70 text-[10px] sm:text-[11px]">
                  {selectedSize === "5ml" ? "~75 pulvérisations" : "~150 pulvérisations"}
                </span>
              </div>
            </div>

            {/* Badges Olfactifs & Famille sous l'image */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono px-3 py-1 rounded-full bg-white/5 text-white/80 border border-white/10">
                {perfume.type || "Eau de Parfum"}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-semibold">
                Collection {perfume.category}
              </span>
              {perfume.family && (
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
                  {perfume.family}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Détails & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Brand & Stock Status Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-brand-gold text-xs sm:text-sm tracking-[0.25em] uppercase font-mono font-bold">
                  {perfume.brand}
                </span>

                {isAvailable ? (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En Stock
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/40 font-bold">
                    Rupture temporaire
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
                {perfume.name}
              </h2>

              {/* Olfactory Description */}
              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-4">
                {perfume.description}
              </p>

              {/* Format & Contenance Selection Section */}
              <div className="space-y-2 mb-4">
                <label className="text-[11px] sm:text-xs text-white/60 uppercase tracking-widest font-mono font-medium flex items-center justify-between">
                  <span>Sélectionnez votre contenance :</span>
                  <span className="text-brand-gold font-bold">{selectedSize}</span>
                </label>

                {/* 2 Interactive Luxe Cards for 5ml vs 10ml */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: 5 ml */}
                  <button
                    type="button"
                    onClick={() => setSelectedSize("5ml")}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-300 border cursor-pointer flex flex-col justify-between ${
                      selectedSize === "5ml"
                        ? "bg-gradient-to-br from-brand-gold/25 via-brand-gold/10 to-black/80 border-brand-gold shadow-[0_0_25px_rgba(212,175,55,0.28)] ring-1 ring-brand-gold scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06] text-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-base sm:text-lg font-bold text-white">
                        5 ml
                      </span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedSize === "5ml"
                          ? "border-brand-gold bg-brand-gold text-black"
                          : "border-white/30 bg-transparent"
                      }`}>
                        {selectedSize === "5ml" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/60 block font-mono">
                        ~75 pschitts (Découverte)
                      </span>
                      <div className="font-serif text-base sm:text-lg font-bold text-brand-gold">
                        {perfume.price5ml} <span className="text-[10px] font-sans font-normal text-white/70">DH</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: 10 ml */}
                  <button
                    type="button"
                    onClick={() => setSelectedSize("10ml")}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-300 border cursor-pointer flex flex-col justify-between ${
                      selectedSize === "10ml"
                        ? "bg-gradient-to-br from-brand-gold/25 via-brand-gold/10 to-black/80 border-brand-gold shadow-[0_0_25px_rgba(212,175,55,0.28)] ring-1 ring-brand-gold scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06] text-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-base sm:text-lg font-bold text-white">
                        10 ml
                      </span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedSize === "10ml"
                          ? "border-brand-gold bg-brand-gold text-black"
                          : "border-white/30 bg-transparent"
                      }`}>
                        {selectedSize === "10ml" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white/60 block font-mono">
                        ~150 pschitts (Voyage)
                      </span>
                      <div className="font-serif text-base sm:text-lg font-bold text-brand-gold">
                        {perfume.price10ml} <span className="text-[10px] font-sans font-normal text-white/70">DH</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quantity Selector & Live Total Price Card */}
              <div className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/70 font-medium">Quantité :</span>
                  <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/15 rounded-lg text-white/80 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-white font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/15 rounded-lg text-white/80 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">
                    Total
                  </span>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-brand-gold leading-none">
                    {totalPrice} <span className="text-xs font-sans font-normal text-white/80">DH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons & Guarantees */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Button 1: Panier */}
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={handleAddToCart}
                  className={`py-3.5 px-3 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                    isAvailable
                      ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-brand-gold/50 text-white active:scale-[0.98] shadow-lg"
                      : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Ajouter au Panier</span>
                </button>

                {/* Button 2: Commander Direct */}
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={handleQuickOrder}
                  className={`py-3.5 px-3 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] cursor-pointer ${
                    isAvailable
                      ? "bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-500 text-brand-black hover:brightness-110 active:scale-[0.98]"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current shrink-0" />
                  <span>Commander Direct</span>
                </button>
              </div>

              {/* Trust & Guarantee Badges Footer */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-white/60 font-light">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">100% Jus Original Authentique</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span className="truncate">Paiement Cash à la Livraison</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
