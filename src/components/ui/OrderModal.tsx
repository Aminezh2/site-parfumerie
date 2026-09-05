"use client";

import { useState } from "react";
import { PerfumeItem } from "@/lib/db";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { X, CheckCircle2, ShoppingBag, ShieldCheck, Truck, ExternalLink } from "lucide-react";

interface OrderModalProps {
  perfume: PerfumeItem | null;
  initialFormat?: "5ml" | "10ml";
  onClose: () => void;
}

export default function OrderModal({ perfume, initialFormat = "10ml", onClose }: OrderModalProps) {
  const [orderFormat, setOrderFormat] = useState<"5ml" | "10ml">(initialFormat);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Casablanca");
  const [customerAddress, setCustomerAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");

  if (!perfume) return null;

  const currentPrice = orderFormat === "5ml" ? perfume.price5ml : perfume.price10ml;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

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
          price: currentPrice,
          quantity: 1,
        }),
      });

      // 2. Build WhatsApp order message for Store Owner
      const message = `🚨 *COMMANDE DIRECTE REÇUE (ZAKARIA FRAGRANCES)* 🚨\n\n` +
        `🛍️ *PRODUIT CHOISI :*\n` +
        `----------------------------------------\n` +
        `• *Parfum :* ${perfume.name}\n` +
        `• *Marque :* ${perfume.brand}\n` +
        `• *Catégorie :* ${perfume.type || "Eau de Parfum"}\n` +
        `• *Format sélectionné :* *${orderFormat}* (${orderFormat === "5ml" ? "~75 pschitts" : "~150 pschitts"})\n` +
        `• *Prix :* ${currentPrice} DH\n` +
        `----------------------------------------\n\n` +
        `💰 *MONTANT TOTAL À ENCAISSER : ${currentPrice} DH*\n` +
        `💳 *Mode de paiement :* Paiement en espèces à la livraison (COD)\n\n` +
        `👤 *COORDONNÉES DU CLIENT :*\n` +
        `• *Nom & Prénom :* ${customerName}\n` +
        `• *Téléphone :* ${customerPhone}\n` +
        `• *Ville :* ${customerCity}\n` +
        `• *Adresse de livraison :* ${customerAddress || "Non spécifiée"}\n\n` +
        `Envoyé depuis le site web Zakaria Fragrances. Merci de valider la livraison !`;

      const whatsappUrl = getWhatsAppUrl(message);
      setGeneratedWhatsAppUrl(whatsappUrl);
      setSuccess(true);

      // 3. Launch WhatsApp link
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);

    } catch (err) {
      console.error("Order submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e0e0e] border border-brand-gold/40 p-6 md:p-8 max-w-lg w-full relative shadow-2xl rounded-xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="font-serif text-3xl text-white">Commande Enregistrée !</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto font-light">
              Merci <strong className="text-white">{customerName}</strong>. Votre commande a été enregistrée en base. Redirection vers WhatsApp...
            </p>

            {/* Direct Link fallback if popup is blocked */}
            <a
              href={generatedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all"
            >
              <span>Envoyer ma commande sur WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-brand-gold flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Paiement en espèces à la livraison • Flacon Verre Original</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-brand-gold text-xs tracking-widest uppercase mb-1 font-mono">
              <ShoppingBag className="w-4 h-4" />
              <span>Commander Maintenant</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">
              {perfume.name}
            </h3>
            <p className="text-white/50 text-xs font-light mb-5">
              Par {perfume.brand} • {perfume.type || "Eau de Parfum"}
            </p>

            {/* Format Toggle Pill */}
            <div className="bg-white/[0.04] p-3 border border-white/10 rounded-lg mb-6">
              <div className="text-xs text-white/60 uppercase tracking-wider mb-2 font-medium">
                Choisir la contenance :
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderFormat("5ml")}
                  className={`py-2.5 px-3 rounded-md text-xs transition-all border flex flex-col items-center justify-center cursor-pointer ${
                    orderFormat === "5ml"
                      ? "bg-brand-gold text-brand-black border-brand-gold font-bold shadow-md"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="font-semibold text-sm">Format 5 ml</span>
                  <span className="text-[11px] opacity-80">~75 pschitts • {perfume.price5ml} DH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFormat("10ml")}
                  className={`py-2.5 px-3 rounded-md text-xs transition-all border flex flex-col items-center justify-center cursor-pointer ${
                    orderFormat === "10ml"
                      ? "bg-brand-gold text-brand-black border-brand-gold font-bold shadow-md"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="font-semibold text-sm">Format 10 ml</span>
                  <span className="text-[11px] opacity-80">~150 pschitts • {perfume.price10ml} DH</span>
                </button>
              </div>

              {/* Price summary badge */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Total à payer à la livraison :</span>
                <span className="text-brand-gold font-serif text-xl font-bold">
                  {currentPrice} DH
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                  Nom &amp; Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Amine Bennani"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                  Téléphone (pour la livraison) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 06 61 23 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Casablanca, Rabat..."
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    placeholder="Quartier, Rue, N°..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-white/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paiement en espèces à la livraison • Transmis via WhatsApp</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-brand-gold to-amber-400 text-brand-black hover:brightness-110 font-bold uppercase tracking-[0.15em] text-xs transition-all duration-300 rounded-lg shadow-lg shadow-brand-gold/10 mt-2 cursor-pointer"
              >
                {submitting ? "Enregistrement en cours..." : "Confirmer ma commande sur WhatsApp"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
