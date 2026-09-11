"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { PerfumeItem } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PerfumeCard from "@/components/ui/PerfumeCard";
import OrderModal from "@/components/ui/OrderModal";
import { Sparkles, ShieldCheck, Filter, Search, ArrowLeft } from "lucide-react";

interface CategoryShowcaseProps {
  category: "homme" | "femme" | "unisexe" | "pack" | "all";
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
}

export default function CategoryShowcase({
  category,
  title,
  subtitle,
  description,
  heroImage,
}: CategoryShowcaseProps) {
  const [productsList, setProductsList] = useState<PerfumeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Order Modal State
  const [orderModalPerfume, setOrderModalPerfume] = useState<PerfumeItem | null>(null);
  const [orderFormat, setOrderFormat] = useState<"5ml" | "10ml">("5ml");

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductsList(data);
            return;
          }
        }
      } catch (err) {
        console.error("API error, using default products:", err);
      } finally {
        setLoading(false);
      }
      // Fallback
      setProductsList(PRODUCTS as unknown as PerfumeItem[]);
    }
    fetchProducts();
  }, []);

  // Filter products by category
  const categoryProducts = productsList.filter((item) => {
    if (category === "all") return true;
    return item.category === category;
  });

  // Unique olfactory families
  const families = ["all", ...Array.from(new Set(categoryProducts.map((p) => p.family || "Boisé")))];

  // Filtered by search and family
  const filteredProducts = categoryProducts.filter((item) => {
    const matchesFamily = selectedFamily === "all" || item.family === selectedFamily;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.family && item.family.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFamily && matchesSearch;
  });

  const openOrderModal = (item: PerfumeItem, size: "5ml" | "10ml") => {
    setOrderModalPerfume(item);
    setOrderFormat(size);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            className="object-cover opacity-25 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/85 to-transparent" />
        </div>

        <div className="container mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          <span className="text-brand-gold text-xs uppercase tracking-[0.2em] font-mono block mb-2">
            {subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-white/70 font-light max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-white/70 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>100% Jus Original Garanti</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Flacons Spray Verre Hermétiques</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters Sticky Bar */}
      <section className="py-4 sm:py-5 bg-[#0a0a0a]/90 border-b border-white/10 sticky top-[68px] sm:top-[76px] z-40 backdrop-blur-md">
        <div className="container mx-auto px-5 sm:px-8 md:px-12 flex flex-col md:flex-row gap-3.5 items-center justify-between">
          {/* Family Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-brand-gold shrink-0 mr-1 hidden sm:block" />
            {families.map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  selectedFamily === fam
                    ? "bg-brand-gold text-brand-black font-bold shadow-md shadow-brand-gold/20"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {fam === "all" ? "Toutes les Familles" : fam}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher un parfum, marque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/15 text-white rounded-full pl-10 pr-4 py-2 text-xs placeholder:text-white/40 focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-14 sm:py-20 md:py-24 bg-brand-black">
        <div className="container mx-auto px-5 sm:px-8 md:px-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <p className="text-white/50 text-xs tracking-widest uppercase font-mono">
              {filteredProducts.length} Fragrance{filteredProducts.length > 1 ? "s" : ""} disponible{filteredProducts.length > 1 ? "s" : ""}
            </p>
            <span className="text-brand-gold text-xs tracking-widest uppercase font-mono hidden sm:inline-block">
              Formats Décant 5ml &amp; 10ml Verre Premium
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <span className="text-brand-gold text-sm uppercase tracking-widest font-mono">
                Chargement des fragrances...
              </span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <p className="text-white/60 font-light mb-4">Aucun parfum ne correspond à votre recherche.</p>
              <button
                onClick={() => {
                  setSelectedFamily("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-brand-gold text-brand-black text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-white transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
              {filteredProducts.map((item) => (
                <PerfumeCard
                  key={item.id}
                  item={item}
                  onOrder={(perfume, size) => openOrderModal(perfume, size)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instant Order Modal */}
      <OrderModal
        perfume={orderModalPerfume}
        initialFormat={orderFormat}
        onClose={() => setOrderModalPerfume(null)}
      />

      <Footer />
    </div>
  );
}
