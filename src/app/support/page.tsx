"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Send, 
  MessageSquare, 
  Headphones, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  RefreshCw,
  ShieldCheck
} from "lucide-react";

interface SupportMessage {
  id: string;
  content: string;
  role: "client" | "admin";
  created_at: string;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/support", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch & Polling every 3.5s so client sees admin replies in real time
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;

    const messageText = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageText,
          role: "client"
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => {
          // Avoid duplicate if polling also picked it up
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      } else {
        alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur envoi message:", err);
      alert("Erreur de connexion. Veuillez vérifier votre connexion.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold/80 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Support en direct disponible</span>
          </div>
        </div>

        {/* Support Header Card */}
        <div className="bg-gradient-to-r from-brand-gold/10 via-white/[0.03] to-transparent border border-brand-gold/20 p-6 sm:p-8 rounded-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[11px] uppercase tracking-widest rounded-full mb-3">
              <Headphones className="w-3.5 h-3.5" />
              Service Client Prestige
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide">
              Conseils & Assistance
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-xl">
              Une question sur une fragrance, nos décants de 5ml & 10ml, ou votre commande ? Notre équipe vous répond rapidement.
            </p>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end gap-3 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>Réponse sous 24h max</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Authenticité 100% Garantie</span>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden flex flex-col h-[560px] shadow-2xl backdrop-blur-sm">
          {/* Chat Header Bar */}
          <div className="px-6 py-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-white">Discussion avec un Conseiller</h2>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Conseillers disponibles
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchMessages()}
              title="Rafraîchir les messages"
              className="p-2 text-white/50 hover:text-brand-gold hover:bg-white/5 rounded-full transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-brand-gold" : ""}`} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Welcome Message from System */}
            <div className="flex gap-3 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex-shrink-0 flex items-center justify-center text-brand-gold text-xs font-serif">
                P
              </div>
              <div className="bg-white/[0.04] border border-white/10 p-4 rounded-2xl rounded-tl-sm text-sm text-white/80 leading-relaxed shadow-sm">
                <p className="font-serif text-brand-gold text-xs uppercase tracking-wider mb-1">
                  Équipe Parfumerie
                </p>
                Bonjour et bienvenue dans notre espace support. Posez-nous votre question ou demandez conseil pour choisir votre parfum signature. Notre équipe vous répondra directement ici !
              </div>
            </div>

            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-white/40 text-sm gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                Chargement de la conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 text-white/40 text-xs tracking-wider">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-brand-gold/40" />
                Aucun message précédent. Écrivez votre premier message ci-dessous.
              </div>
            ) : (
              messages.map((msg) => {
                const isClient = msg.role === "client";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isClient ? "justify-end" : "justify-start"}`}
                  >
                    {!isClient && (
                      <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex-shrink-0 flex items-center justify-center text-brand-gold text-xs font-serif">
                        P
                      </div>
                    )}

                    <div
                      className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                        isClient
                          ? "bg-brand-gold text-brand-black font-medium rounded-tr-sm"
                          : "bg-white/[0.06] border border-brand-gold/20 text-white rounded-tl-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            isClient ? "text-brand-black/70" : "text-brand-gold"
                          }`}
                        >
                          {isClient ? "Vous" : "Équipe Support"}
                        </span>
                        {msg.created_at && (
                          <span
                            className={`text-[10px] ${
                              isClient ? "text-brand-black/60" : "text-white/40"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {isClient && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex-shrink-0 flex items-center justify-center text-white text-xs font-mono">
                        👤
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white/[0.03] border-t border-white/10 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Écrivez votre message à notre équipe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/60 border border-white/15 focus:border-brand-gold px-4 py-3 text-sm text-white placeholder:text-white/40 rounded-sm focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="px-5 py-3 bg-brand-gold text-brand-black hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs uppercase tracking-widest flex items-center gap-2 rounded-sm transition-all"
            >
              {sending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Envoyer</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Help Hints */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
            <h3 className="text-xs uppercase font-serif text-brand-gold mb-1">Authenticité</h3>
            <p className="text-xs text-white/50">Tous nos décants sont prélevés avec précision depuis les flacons originaux scellés.</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
            <h3 className="text-xs uppercase font-serif text-brand-gold mb-1">Livraison Rapide</h3>
            <p className="text-xs text-white/50">Expédition soignée et sécurisée dans tout le Maroc avec suivi en temps réel.</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
            <h3 className="text-xs uppercase font-serif text-brand-gold mb-1">Conseil Personnalisé</h3>
            <p className="text-xs text-white/50">Indiquez-nous vos préférences olfactives pour une recommandation sur-mesure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
