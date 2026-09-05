"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/collection", label: "Collection" },
  { href: "/homme", label: "Homme" },
  { href: "/femme", label: "Femme" },
  { href: "/unisexe", label: "Unisexe" },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-brand-black/80 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile: Menu (Left) */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white hover:text-brand-gold transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Links (Left) */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-white">
            <Link href="/collection" className="hover:text-brand-gold transition-colors">Collection</Link>
            <Link href="/homme" className="hover:text-brand-gold transition-colors">Homme</Link>
            <Link href="/femme" className="hover:text-brand-gold transition-colors">Femme</Link>
          </nav>

          {/* Logo (Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link href="/" className="flex flex-col items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-serif text-xl md:text-3xl text-white tracking-wider">
                Zakaria Fragrances
              </span>
              <span className="text-[0.6rem] md:text-xs text-brand-gold tracking-[0.2em] uppercase mt-1">
                Perfumes &amp; Decants
              </span>
            </Link>
          </div>

          {/* Desktop Links (Right) */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-white">
            <Link href="/unisexe" className="hover:text-brand-gold transition-colors">Unisexe</Link>
            <div className="flex items-center gap-5 ml-4">
              <button aria-label="Search" className="hover:text-brand-gold transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button aria-label="Wishlist" className="hover:text-brand-gold transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button
                aria-label="Cart"
                onClick={openCart}
                className="hover:text-brand-gold transition-colors relative p-1 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-5 h-5 bg-brand-gold text-brand-black font-extrabold text-[10px] rounded-full flex items-center justify-center border border-brand-black shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile: Cart & Search (Right) */}
          <div className="flex items-center gap-3 md:hidden">
            <button aria-label="Search" className="text-white hover:text-brand-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              aria-label="Cart"
              onClick={openCart}
              className="text-white hover:text-brand-gold transition-colors relative p-1 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-gold text-brand-black font-extrabold text-[9px] rounded-full flex items-center justify-center border border-brand-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col bg-brand-black transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col">
            <span className="font-serif text-xl text-white tracking-wider">Zakaria Fragrances</span>
            <span className="text-[0.6rem] text-brand-gold tracking-[0.2em] uppercase mt-1">Perfumes &amp; Decants</span>
          </Link>
          <button
            aria-label="Fermer le menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:text-brand-gold transition-colors p-2"
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
                  className={`block font-serif text-4xl text-white group-hover:text-brand-gold transition-all duration-300 py-3 border-b border-white/5 group-hover:pl-3 ${
                    isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 70 + 100}ms` : "0ms", transitionProperty: "transform, opacity, padding, color" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="px-8 pb-12 flex items-center gap-6 border-t border-white/5 pt-6">
          <button aria-label="Wishlist" className="text-white/60 hover:text-brand-gold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
            <Heart className="w-5 h-5" />
            <span>Favoris</span>
          </button>
          <span className="text-white/20">|</span>
          <button
            aria-label="Cart"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openCart();
            }}
            className="text-white/60 hover:text-brand-gold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Panier ({totalItems})</span>
          </button>
        </div>

        {/* Decorative bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>
    </>
  );
}
