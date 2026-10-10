import { NextResponse } from "next/server";
import { replySupportMessage, deleteSupportMessage } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }
    const reply = await replySupportMessage(id, content);
    if (!reply) {
      return NextResponse.json(
        { error: "Message not found or not a client message" },
        { status: 404 }
      );
    }
    return NextResponse.json(reply, { status: 200 });
  } catch (err) {
    console.error("[Support API] Error replying to message:", err);
    return NextResponse.json({ error: "Failed to reply" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteSupportMessage(id);
    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Support API] Error deleting message:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
