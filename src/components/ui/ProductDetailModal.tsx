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

  // Dynamic image: use size-specific photo if uploaded, otherwise fall back to cover
  const currentImage =
    selectedSize === "5ml"
      ? perfume.image5ml || perfume.image
      : perfume.image10ml || perfume.image;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(perfume, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleQuickOrder = () => {
    if (!isAvailable) return;
    onOrder(perfume, selectedSize);
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md md:max-w-xl z-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto">

        {/* ── HERO BACKGROUND IMAGE ── */}
        <div className="relative w-full h-[52vw] max-h-[320px] min-h-[220px] overflow-hidden">
          <Image
            key={currentImage}
            src={currentImage}
            alt={perfume.name}
            fill
            sizes="(max-width: 640px) 100vw, 560px"
            className="object-cover object-center scale-105 transition-opacity duration-500"
            priority
          />
          {/* Top dark fade for readability of close btn */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-[1] pointer-events-none" />
          {/* Bottom fade into content card */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-transparent z-[2] pointer-events-none" />

          {/* Ambient gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.18)_0%,_transparent_65%)] z-[1] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 rounded-full border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 100% Original Badge */}
          <div className="absolute top-3 left-3 z-30 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] text-brand-gold border border-brand-gold/30 font-mono flex items-center gap-1.5">
            <Award className="w-3 h-3 text-brand-gold" />
            <span>100% Original</span>
          </div>

          {/* Stock Badge */}
          <div className="absolute bottom-4 right-3 z-30">
            {isAvailable ? (
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En Stock
              </span>
            ) : (
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold backdrop-blur-md">
                Épuisé
              </span>
            )}
          </div>

          {/* Toast */}
          {addedToast && (
            <div className="absolute top-3 inset-x-3 z-40 bg-gradient-to-r from-emerald-500 to-teal-400 text-black py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{quantity}x {perfume.name} ({selectedSize}) ajouté !</span>
              </div>
              <button
                onClick={() => { onClose(); openCart(); }}
                className="text-[10px] underline font-extrabold uppercase tracking-wider hover:opacity-80 ml-2"
              >
                Voir panier →
              </button>
            </div>
          )}
        </div>

        {/* ── CONTENT PANEL (sits below image, connected) ── */}
        <div className="bg-[#0d0d0d] border-x border-b border-brand-gold/20 rounded-b-3xl px-5 sm:px-7 pt-3 pb-6 space-y-4">

          {/* Brand & Name */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-brand-gold text-[10px] tracking-[0.22em] uppercase font-mono font-bold">
                {perfume.brand}
              </span>
              <span className="h-px flex-1 bg-brand-gold/20" />
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-brand-gold" />
                <span className="text-brand-gold text-[10px] font-mono">{selectedSize}</span>
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold leading-tight">
              {perfume.name}
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
                {perfume.type || "Eau de Parfum"}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/25">
                {perfume.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 text-xs font-light leading-relaxed line-clamp-2">
            {perfume.description}
          </p>

          {/* ── Size Selector ── */}
          <div className="space-y-2">
            <span className="text-white/50 uppercase tracking-wider font-mono text-[9px]">Contenance</span>
            <div className="grid grid-cols-2 gap-2">
              {(["5ml", "10ml"] as const).map((size) => {
                const price = size === "5ml" ? perfume.price5ml : perfume.price10ml;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-brand-gold/15 border-brand-gold ring-1 ring-brand-gold/50 shadow-[0_0_14px_rgba(212,175,55,0.2)]"
                        : "bg-white/[0.04] border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div>
                      <div className="font-serif text-sm font-bold text-white">{size}</div>
                      <div className="font-mono text-brand-gold font-bold text-xs mt-0.5">
                        {price} <span className="text-[9px] font-sans font-normal text-white/60">DH</span>
                      </div>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-brand-gold bg-brand-gold text-black" : "border-white/25"
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quantity & Total ── */}
          <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 font-medium">Quantité</span>
              <div className="flex items-center gap-0 bg-black/60 border border-white/15 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
                  aria-label="Diminuer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-white font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
                  aria-label="Augmenter"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block font-mono">Total</span>
              <div className="font-serif text-xl font-bold text-brand-gold leading-none">
                {totalPrice} <span className="text-xs font-sans font-normal text-white/70">DH</span>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`py-3.5 px-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer ${
                isAvailable
                  ? "bg-white/8 hover:bg-white/15 border-white/20 hover:border-brand-gold/40 text-white active:scale-[0.97]"
                  : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Panier</span>
            </button>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleQuickOrder}
              className={`py-3.5 px-3 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isAvailable
                  ? "bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-500 text-brand-black shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-[0.97]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>Commander</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-5 text-[10px] text-white/40 pt-0.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Paiement à la livraison</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
