import { NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, brand, category, type, family, image, description, price5ml, price10ml, inStock, badge } = body;

    // For packs, price5ml is the pack price (required), price10ml is optional
    if (!name || !category || !price5ml) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // For regular perfumes (not packs), price10ml is also required
    if (category !== "pack" && !price10ml) {
      return NextResponse.json({ error: "Le prix 10ml est obligatoire pour les parfums" }, { status: 400 });
    }

    const newProduct = addProduct({
      name,
      brand: brand || "Zakaria Fragrances",
      category: category as "homme" | "femme" | "unisexe" | "pack",
      type: type || (category === "pack" ? "Pack Découverte" : "Eau de Parfum"),
      family: family || (category === "pack" ? "Sélection Exclusive" : "Boisé / Floral"),
      image: image || "/assets/images/dior.jpg",
      description: description || (category === "pack" ? "Pack exclusif de décants sélectionnés par nos experts." : "Parfum original authentique prélevé directement du flacon fabricant."),
      price5ml: Number(price5ml),
      price10ml: category === "pack" ? Number(price5ml) : Number(price10ml),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      badge: badge || (category === "pack" ? "Pack Exclusif" : ""),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
