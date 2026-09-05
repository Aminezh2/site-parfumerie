"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, isCartOpen, closeCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Casablanca");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || cart.length === 0) return;

    setSubmitting(true);

    try {
      // 1. Save orders to database API
      for (const item of cart) {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerPhone,
            customerCity,
            customerAddress,
            perfumeId: item.perfumeId,
            perfumeName: item.name,
            brand: item.brand,
            category: item.category,
            format: item.format,
            price: item.price,
            quantity: item.quantity,
          }),
        });
      }

      // 2. Format WhatsApp Message for Store Owner
      let itemsListText = "";
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        itemsListText += `  ${index + 1}. *${item.name}* (${item.brand})\n` +
          `     • Contenance : *${item.format}* (${item.format === "5ml" ? "~75 pschitts" : "~150 pschitts"})\n` +
          `     • Quantité : ${item.quantity}\n` +
          `     • Prix unitaire : ${item.price} DH\n` +
          `     • Sous-total : ${itemTotal} DH\n\n`;
      });

      const message = `🚨 *NOUVELLE COMMANDE REÇUE (ZAKARIA FRAGRANCES)* 🚨\n\n` +
        `🛍️ *PRODUITS CHOISIS (${totalItems} article${totalItems > 1 ? "s" : ""}) :*\n` +
        `----------------------------------------\n` +
        itemsListText +
        `----------------------------------------\n` +
        `💰 *MONTANT TOTAL À ENCAISSER : ${totalPrice} DH*\n` +
        `💳 *Mode de paiement :* Paiement à la livraison (Cash on Delivery)\n\n` +
        `👤 *COORDONNÉES DU CLIENT :*\n` +
        `• *Nom & Prénom :* ${customerName}\n` +
        `• *Téléphone :* ${customerPhone}\n` +
        `• *Ville :* ${customerCity}\n` +
        `• *Adresse de livraison :* ${customerAddress || "Non spécifiée"}\n\n` +
        `Envoyé depuis le site web Zakaria Fragrances. Merci de valider la livraison !`;

      const whatsappUrl = getWhatsAppUrl(message);
      setGeneratedWhatsAppUrl(whatsappUrl);
      setOrderCompleted(true);
      clearCart();

      // 3. Launch WhatsApp URL
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);

    } catch (err) {
      console.error("Order dispatch error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      {/* Overlay backdrop */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0e0e0e] border-l border-white/10 text-white h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg text-white font-bold">Votre Panier</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-mono font-medium">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderCompleted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-serif text-2xl text-white">Commande Enregistrée !</h4>
              <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                Votre commande a bien été enregistrée en base de données. Redirection vers WhatsApp...
              </p>

              {/* Direct Fallback WhatsApp Button */}
              <a
                href={generatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all"
              >
                <span>Envoyer ma commande sur WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-white/60 font-light text-sm">Votre panier est actuellement vide.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-brand-gold text-brand-black text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-white transition-colors"
              >
                Découvrir nos parfums
              </button>
            </div>
          ) : !showCheckoutForm ? (
            /* Items List */
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl flex gap-3 items-center hover:border-brand-gold/30 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/5">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-brand-gold uppercase font-mono tracking-wider block">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-white truncate">{item.name}</h4>
                    <div className="text-xs text-white/60 flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] uppercase font-mono text-white/90">
                        {item.format}
                      </span>
                      <span>{item.price} DH / un.</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-white/30 hover:text-rose-400 p-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md p-1 text-xs">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded text-white/70"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded text-white/70"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="font-serif text-lg text-white">Informations de livraison</h4>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-brand-gold hover:underline"
                >
                  Modifier le panier
                </button>
              </div>

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
                  className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 06 61 23 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Casablanca, Rabat..."
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/80 uppercase tracking-wider block mb-1 font-medium">
                    Adresse
                  </label>
                  <input
                    type="text"
                    placeholder="Quartier, Rue..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg text-white px-3.5 py-2.5 text-xs placeholder:text-white/30 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg text-xs text-brand-gold flex items-center gap-2">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Paiement en espèces à la livraison. Validation rapide par WhatsApp.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-brand-gold to-amber-400 text-brand-black hover:brightness-110 font-bold uppercase tracking-[0.15em] text-xs transition-all rounded-lg shadow-lg shadow-brand-gold/10 mt-2 cursor-pointer"
              >
                {submitting ? "Enregistrement en cours..." : "Valider & Commander sur WhatsApp"}
              </button>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && !orderCompleted && (
          <div className="p-5 border-t border-white/10 bg-black/60 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total du panier :</span>
              <span className="font-serif text-2xl font-bold text-brand-gold">{totalPrice} DH</span>
            </div>

            {!showCheckoutForm ? (
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="w-full py-3.5 bg-brand-gold text-brand-black hover:bg-white font-bold uppercase tracking-[0.15em] text-xs transition-colors rounded-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Procéder à la commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCheckoutForm(false)}
                className="w-full py-2.5 bg-white/5 text-white/60 hover:text-white text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Retour au panier
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantie 100% Jus Original &amp; Atomiseur Verre</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
