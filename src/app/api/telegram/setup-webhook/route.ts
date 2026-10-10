import { NextResponse } from "next/server";
import {
  setTelegramWebhook,
  getTelegramWebhookInfo,
  sendAdminMessage,
  getSiteUrl,
} from "@/lib/telegram";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 1. Return current webhook info
    if (action === "info") {
      const info = await getTelegramWebhookInfo();
      return NextResponse.json({
        siteUrl: getSiteUrl(),
        telegramWebhookInfo: info,
      });
    }

    // 2. Test message
    if (action === "test") {
      await sendAdminMessage(
        "✅ *Test de notification Telegram réussi\\!*\n\n" +
        "Votre bot Telegram est parfaitement connecté avec votre site Fsahi Fragrances\\."
      );
      return NextResponse.json({
        ok: true,
        message: "Message de test envoyé sur Telegram !",
      });
    }

    // 3. Set webhook
    const customUrl = searchParams.get("url") || undefined;
    const result = await setTelegramWebhook(customUrl);
    const info = await getTelegramWebhookInfo();

    return NextResponse.json({
      success: result.ok,
      result,
      currentWebhook: info,
    });
  } catch (err) {
    console.error("[Telegram Setup] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customUrl = body.url || undefined;
    const result = await setTelegramWebhook(customUrl);
    const info = await getTelegramWebhookInfo();

    return NextResponse.json({
      success: result.ok,
      result,
      currentWebhook: info,
    });
  } catch (err) {
    console.error("[Telegram Setup] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
