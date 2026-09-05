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

    if (!name || !category || !price5ml || !price10ml) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const newProduct = addProduct({
      name,
      brand: brand || "Parfum Original",
      category: category as "homme" | "femme" | "unisexe",
      type: type || "Eau de Parfum",
      family: family || "Boisé / Floral",
      image: image || "/assets/images/dior.jpg",
      description: description || "Parfum original authentique prélevé directement du flacon fabricant.",
      price5ml: Number(price5ml),
      price10ml: Number(price10ml),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      badge: badge || "",
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
