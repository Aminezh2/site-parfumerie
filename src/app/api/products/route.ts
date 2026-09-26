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
    const { name, brand, category, type, family, image, image5ml, image10ml, description, price5ml, price10ml, inStock, badge } = body;

    // Require name, category, and at least one valid price (> 0) for 5ml or 10ml
    const p5 = price5ml ? Number(price5ml) : 0;
    const p10 = price10ml ? Number(price10ml) : 0;

    if (!name || !category || (p5 <= 0 && p10 <= 0)) {
      return NextResponse.json({ error: "Veuillez indiquer au moins le prix d'un format (5ml ou 10ml)" }, { status: 400 });
    }

    const newProduct = addProduct({
      name,
      brand: brand || "Zakaria Fragrances",
      category: category as "homme" | "femme" | "unisexe" | "pack",
      type: type || (category === "pack" ? "Pack Découverte" : "Eau de Parfum"),
      family: family || (category === "pack" ? "Sélection Exclusive" : "Boisé / Floral"),
      image: image || "/assets/images/dior.jpg",
      image5ml: image5ml || undefined,
      image10ml: image10ml || undefined,
      description: description || (category === "pack" ? "Pack exclusif de décants sélectionnés par nos experts." : "Parfum original authentique prélevé directement du flacon fabricant."),
      price5ml: p5,
      price10ml: category === "pack" ? (p5 || p10) : p10,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      badge: badge || (category === "pack" ? "Pack Exclusif" : ""),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
