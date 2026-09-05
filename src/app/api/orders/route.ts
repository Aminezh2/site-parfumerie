import { NextResponse } from "next/server";
import { getOrders, addOrder } from "@/lib/db";

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      perfumeId,
      perfumeName,
      brand,
      category,
      format,
      price,
      quantity,
    } = body;

    if (!customerName || !customerPhone || !perfumeName || !price || !format) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const qty = quantity || 1;
    const totalAmount = Number(price) * qty;

    const newOrder = addOrder({
      customerName,
      customerPhone,
      customerCity: customerCity || "Non spécifiée",
      customerAddress: customerAddress || "Non spécifiée",
      perfumeId: perfumeId || "unknown",
      perfumeName,
      brand: brand || "Parfum Original",
      category: category || "homme",
      format: format as "5ml" | "10ml",
      price: Number(price),
      quantity: qty,
      totalAmount,
      status: "En attente",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
