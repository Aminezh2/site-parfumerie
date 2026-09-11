"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/collection", label: "Collection" },
  { href: "/homme", label: "Homme" },
  { href: "/femme", label: "Femme" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Invisible secret keyboard combination for admin access: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "bg-[#090909]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-xl"
          : "bg-transparent py-5 sm:py-6"
          }`}
      >
        <div className="container mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Mobile: Menu (Left) */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white hover:text-brand-gold transition-colors p-1 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Links (Left) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest text-white/90">
            <Link href="/collection" className="hover:text-brand-gold transition-colors font-medium">
              Collection
            </Link>
            <Link href="/homme" className="hover:text-brand-gold transition-colors font-medium">
              Homme
            </Link>
            <Link href="/femme" className="hover:text-brand-gold transition-colors font-medium">
              Femme
            </Link>
          </nav>

          {/* Logo (Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-serif text-lg sm:text-2xl md:text-3xl text-white tracking-wider group-hover:text-brand-gold-light transition-colors">
                FSAHI FRAGRANCES
              </span>
              <span className="text-[0.55rem] sm:text-[0.65rem] text-brand-gold tracking-[0.25em] uppercase mt-0.5 font-mono">
                Perfumes &amp; Decants
              </span>
            </Link>
          </div>

          {/* Desktop Links (Right) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest text-white/90">
            <Link href="/support" className="hover:text-brand-gold transition-colors font-medium">
              Support
            </Link>
            <div className="flex items-center gap-4 ml-3">
              <Link
                href="/collection"
                aria-label="Recherche"
                className="hover:text-brand-gold text-white/80 transition-colors p-1"
                title="Rechercher un parfum"
              >
                <Search className="w-4 h-4" />
              </Link>
              <button
                aria-label="Panier"
                onClick={openCart}
                className="hover:text-brand-gold text-white/90 transition-colors relative p-1.5 cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-brand-gold text-brand-black font-extrabold text-[9px] rounded-full flex items-center justify-center border border-brand-black shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile: Cart & Search (Right) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <Link
              href="/collection"
              aria-label="Recherche"
              className="text-white hover:text-brand-gold transition-colors p-1"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              aria-label="Panier"
              onClick={openCart}
              className="text-white hover:text-brand-gold transition-colors relative p-1 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-black font-extrabold text-[9px] rounded-full flex items-center justify-center border border-brand-black shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a] transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col">
            <span className="font-serif text-xl text-white tracking-wider">Zakaria Fragrances</span>
            <span className="text-[0.6rem] text-brand-gold tracking-[0.2em] uppercase mt-0.5 font-mono">
              Perfumes &amp; Decants
            </span>
          </Link>
          <button
            aria-label="Fermer le menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:text-brand-gold transition-colors p-2 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center px-8">
          <div className="space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block group"
              >
                <span
                  className={`block font-serif text-3xl sm:text-4xl text-white group-hover:text-brand-gold transition-all duration-300 py-3.5 border-b border-white/5 group-hover:pl-3 ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 60 + 80}ms` : "0ms",
                    transitionProperty: "transform, opacity, padding, color",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="px-8 pb-10 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            aria-label="Cart"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openCart();
            }}
            className="text-white hover:text-brand-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <span>Votre Panier ({totalItems})</span>
          </button>

          <Link
            href="/support"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs uppercase tracking-widest text-brand-gold hover:underline"
          >
            Besoin d&apos;aide ?
          </Link>
        </div>

        {/* Decorative bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>
    </>
  );
}
