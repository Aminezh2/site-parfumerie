import { NextResponse } from "next/server";
import { updateOrderStatus, deleteOrder } from "@/lib/db";
import { updateOrderMessage } from "@/lib/telegram";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status);

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── Sync Telegram message (awaited with try/catch for Vercel serverless) ──
    if (updated.telegramMessageId) {
      try {
        await updateOrderMessage(updated.telegramMessageId, updated);
      } catch (err) {
        console.error("[Telegram] Failed to sync message on status update:", err);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[Orders API] Failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteOrder(id);

    if (!success) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("[Orders API] Failed to delete order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
