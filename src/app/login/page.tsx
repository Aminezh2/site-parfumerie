"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-brand-gold transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Boutique</span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto mb-4 text-brand-gold shadow-[0_0_25px_rgba(212,175,55,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold mb-1">
            Espace Administrateur
          </h1>
          <p className="text-xs text-white/50 font-mono tracking-widest uppercase">
            Zakaria Fragrances &bull; Accès Sécurisé
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-[#0e0e0e]/90 backdrop-blur-xl border border-brand-gold/30 p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5"
        >
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 p-3 rounded-xl text-xs text-center font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-xs uppercase tracking-widest text-white/70 font-mono mb-2"
              htmlFor="password"
            >
              Mot de passe gestionnaire
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-brand-gold text-white rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none transition-colors pr-10 font-mono"
                placeholder="Entrez votre mot de passe"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                aria-label="Afficher le mot de passe"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-500 text-brand-black hover:brightness-110 font-bold uppercase tracking-[0.15em] text-xs transition-all rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Vérification en cours..." : "Connexion au Portail"}
          </button>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-white/40 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session sécurisée par jeton HttpOnly crypté</span>
          </div>
        </form>
      </div>
    </div>
  );
}
