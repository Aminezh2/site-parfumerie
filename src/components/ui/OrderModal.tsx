"use client";

import { useState } from "react";
import Image from "next/image";
import { PerfumeItem } from "@/lib/db";
import { MOROCCAN_CITIES } from "@/lib/cities";
import { X, CheckCircle2, ShoppingBag, ShieldCheck, Truck, ExternalLink, Droplets } from "lucide-react";

interface OrderModalProps {
  perfume: PerfumeItem | null;
  initialFormat?: "5ml" | "10ml";
  initialQuantity?: number;
  onClose: () => void;
}

export default function OrderModal({ perfume, initialFormat = "5ml", initialQuantity = 1, onClose }: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Casablanca");
  const [customerAddress, setCustomerAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!perfume) return null;

  const is5mlAvailable = (perfume.price5ml || 0) > 0;
  const is10mlAvailable = (perfume.price10ml || 0) > 0;
  const orderFormat = (initialFormat === "5ml" && is5mlAvailable) ? "5ml" : (is10mlAvailable ? "10ml" : "5ml");
  const unitPrice = orderFormat === "5ml" ? (perfume.price5ml || 0) : (perfume.price10ml || 0);
  const quantity = initialQuantity > 0 ? initialQuantity : 1;
  const currentPrice = Math.round(unitPrice * quantity * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || currentPrice <= 0) return;

    setSubmitting(true);
    try {
      // 1. Save order to backend database API
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerCity,
          customerAddress,
          perfumeId: perfume.id,
          perfumeName: perfume.name,
          brand: perfume.brand,
          category: perfume.category,
          format: orderFormat,
          price: unitPrice,
          quantity: quantity,
        }),
      });

      setSuccess(true);
      // Wait a moment then close
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Order submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[230] bg-background/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Centered Modal Container */}
      <div className="bg-background border border-brand-gold/40 p-5 sm:p-7 max-w-md w-full relative shadow-2xl rounded-2xl my-auto z-10 animate-in zoom-in-95 duration-200 text-foreground">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-white/50 hover:text-foreground hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Commande Enregistrée !</h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto font-light">
              Merci <strong className="text-foreground">{customerName}</strong>. Votre commande a été enregistrée avec succès. Notre équipe vous contactera bientôt pour la confirmation.
            </p>

            <div className="p-2.5 bg-white/5 border border-border rounded-lg text-xs text-brand-gold flex items-center justify-center gap-2 font-mono">
              <Truck className="w-4 h-4" />
              <span>Paiement en espèces à la livraison (COD)</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-1.5 text-brand-gold text-[11px] tracking-widest uppercase mb-1 font-mono font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Finaliser ma commande</span>
            </div>

            {/* Perfume Recap Banner (No 5ml/10ml toggle buttons!) */}
            <div className="p-3 bg-white/[0.04] border border-brand-gold/30 rounded-xl mb-4 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-background/60 shrink-0 border border-border">
                <Image
                  src={perfume.image}
                  alt={perfume.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-brand-gold font-mono uppercase tracking-wider block truncate">
                  {perfume.brand}
                </span>
                <h4 className="font-serif text-sm sm:text-base font-bold text-foreground truncate">
                  {perfume.name}
                </h4>
                <div className="flex items-center justify-between text-xs mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/80 font-mono bg-white/10 px-2 py-0.5 rounded">
                    <Droplets className="w-3 h-3 text-brand-gold" />
                    {perfume.category === "pack" ? `${quantity > 1 ? `${quantity}x ` : ""}Pack Exclusif` : `${quantity > 1 ? `${quantity}x ` : ""}Format ${orderFormat}`}
                  </span>
                  <span className="font-serif font-bold text-brand-gold text-sm sm:text-base">
                    {currentPrice % 1 === 0 ? currentPrice : currentPrice.toFixed(2)} DH
                    {quantity > 1 && <span className="text-[10px] text-brand-gold/60 font-normal ml-1">({unitPrice} DH × {quantity})</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-white/80 uppercase tracking-wider block mb-1 font-medium font-mono">
                  Nom &amp; Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Amine Bennani"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl text-foreground px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/80 uppercase tracking-wider block mb-1 font-medium font-mono">
                  Téléphone (pour la livraison) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 06 61 23 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl text-foreground px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-white/80 uppercase tracking-wider block mb-1 font-medium font-mono">
                    Ville
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-white/5 border border-border rounded-xl text-foreground px-3 py-2 text-xs focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-background text-white/50">Sélectionnez une ville</option>
                    {MOROCCAN_CITIES.map((city) => (
                      <option key={city} value={city} className="bg-background text-foreground">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-white/80 uppercase tracking-wider block mb-1 font-medium font-mono">
                    Adresse
                  </label>
                  <input
                    type="text"
                    placeholder="Quartier, Rue..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white/5 border border-border rounded-xl text-foreground px-3 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5 text-[10px] text-white/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Paiement en espèces à la livraison</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-amber-400 text-brand-black hover:brightness-110 font-bold uppercase tracking-[0.15em] text-xs transition-all duration-200 rounded-xl shadow-lg shadow-brand-gold/15 mt-1 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Enregistrement en cours..." : `Confirmer ma commande (${currentPrice % 1 === 0 ? currentPrice : currentPrice.toFixed(2)} DH)`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
