"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { PerfumeItem } from "@/lib/db";
import PerfumeCard from "@/components/ui/PerfumeCard";
import OrderModal from "@/components/ui/OrderModal";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedCollection() {
  const [productsList, setProductsList] = useState<PerfumeItem[]>(PRODUCTS as unknown as PerfumeItem[]);
  const [orderModalPerfume, setOrderModalPerfume] = useState<PerfumeItem | null>(null);
  const [orderFormat, setOrderFormat] = useState<"5ml" | "10ml">("5ml");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductsList(data);
          }
        }
      } catch (err) {
        console.error("Featured products fetch error:", err);
      }
    }
    loadProducts();
  }, []);

  // Show top 6 featured products (balanced 2x3 or 3x2 grid)
  const featuredProducts = productsList.slice(0, 6);

  const openOrderModal = (item: PerfumeItem, size: "5ml" | "10ml") => {
    setOrderModalPerfume(item);
    setOrderFormat(size);
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-brand-black text-white relative">
      <div className="container mx-auto px-5 sm:px-8 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-5">
          <div>
            <span className="text-brand-gold text-xs uppercase tracking-[0.2em] font-mono mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sélection Exclusive
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Nos fragrances vedettes
            </h2>
            <p className="text-white/60 font-light max-w-md text-xs sm:text-sm md:text-base leading-relaxed">
              Des décants d&apos;exception issus des plus grands jus originaux. Formats nomades 5 ml (~75 pschitts) et 10 ml (~150 pschitts).
            </p>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-brand-gold text-xs tracking-widest uppercase hover:text-white transition-colors pb-1 border-b border-brand-gold hover:border-white font-medium shrink-0"
          >
            <span>Voir toute la collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <PerfumeCard
              key={product.id}
              item={product}
              onOrder={(perfume, size) => openOrderModal(perfume, size)}
            />
          ))}
        </div>
      </div>

      <OrderModal
        perfume={orderModalPerfume}
        initialFormat={orderFormat}
        onClose={() => setOrderModalPerfume(null)}
      />
    </section>
  );
}
