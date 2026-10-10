import { NextResponse } from "next/server";
import { getOrders, addOrder, saveTelegramMessageId } from "@/lib/db";
import { sanitizeInput, sanitizePhone, sanitizeNumber } from "@/lib/security";
import { sendOrderNotification } from "@/lib/telegram";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("[Orders API] Failed to fetch orders:", err);
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

    const cleanPrice = sanitizeNumber(price, 0);
    const cleanQty = Math.max(1, Math.floor(sanitizeNumber(quantity, 1)));
    const totalAmount = cleanPrice * cleanQty;

    const newOrder = await addOrder({
      customerName: sanitizeInput(customerName),
      customerPhone: sanitizePhone(customerPhone),
      customerCity: sanitizeInput(customerCity) || "Non spécifiée",
      customerAddress: sanitizeInput(customerAddress) || "Non spécifiée",
      perfumeId: sanitizeInput(perfumeId) || "unknown",
      perfumeName: sanitizeInput(perfumeName),
      brand: sanitizeInput(brand) || "Parfum Original",
      category: (["homme", "femme", "unisexe", "pack"].includes(category) ? category : "homme") as "homme" | "femme" | "unisexe" | "pack",
      format: (format === "10ml" ? "10ml" : "5ml") as "5ml" | "10ml",
      price: cleanPrice,
      quantity: cleanQty,
      totalAmount,
      status: "En attente",
    });

    // ── Send Telegram notification (Awaited with try/catch for Vercel serverless) ──
    try {
      const messageId = await sendOrderNotification(newOrder);
      if (messageId) {
        newOrder.telegramMessageId = messageId;
        await saveTelegramMessageId(newOrder.id, messageId);
      }
    } catch (telegramErr) {
      console.error("[Telegram] Error during order notification dispatch:", telegramErr);
      // Checkout succeeds even if Telegram experiences network issues
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("[Orders API] Failed to create order:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
