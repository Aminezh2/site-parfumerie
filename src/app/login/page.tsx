"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Appel à l'API pour vérifier le mot de passe
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-brand-black border border-white/10 p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-serif text-white mb-6 text-center">Accès Administrateur</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-white/70 text-sm mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-gold text-brand-black font-semibold py-3 rounded-lg hover:bg-white transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
