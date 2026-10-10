import { NextResponse } from "next/server";
import { getSupportMessages, addSupportMessage } from "@/lib/db";
import { sanitizeInput } from "@/lib/security";

export async function GET() {
  try {
    const messages = await getSupportMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error("[Support API] Error fetching messages:", err);
    return NextResponse.json({ error: "Failed to fetch support messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, role } = await request.json();
    if (!content || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const sanitizedContent = sanitizeInput(content);
    const validRole = role === "admin" ? "admin" : "client";
    const newMsg = await addSupportMessage({ content: sanitizedContent, role: validRole });
    return NextResponse.json(newMsg, { status: 201 });
  } catch (err) {
    console.error("[Support API] Error creating message:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
