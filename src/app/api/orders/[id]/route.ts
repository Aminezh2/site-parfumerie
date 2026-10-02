import { NextResponse } from "next/server";
import { updateOrderStatus, deleteOrder, getOrderById } from "@/lib/db";
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

    const updated = updateOrderStatus(id, status);

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── Sync Telegram message (best-effort, non-blocking) ──────────────────
    // If the order has a linked Telegram message, update it to reflect new status
    if (updated.telegramMessageId) {
      updateOrderMessage(updated.telegramMessageId, updated).catch((err) => {
        console.error("[Telegram] Failed to sync message on status update:", err);
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteOrder(id);

    if (!success) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
