/**
 * Telegram Webhook Handler — /api/telegram/webhook
 *
 * Receives POST requests from Telegram when admin clicks inline buttons.
 * Security:
 *  1. Verifies the X-Telegram-Bot-Api-Secret-Token header
 *  2. Checks that the acting user is the authorized admin
 *  3. Validates order ID and status transition before writing to DB
 *  4. Never trusts client-supplied data without DB verification
 */

import { NextResponse } from "next/server";
import {
  getOrderById,
  updateOrderStatus,
  getOrders,
  OrderItem,
} from "@/lib/db";
import {
  verifyWebhookSecret,
  isAuthorizedUser,
  isTransitionAllowed,
  answerCallbackQuery,
  updateOrderMessage,
  sendAdminMessage,
  STATUS_LABELS,
} from "@/lib/telegram";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: {
    message_id: number;
    chat: { id: number };
  };
  data?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: { id: number };
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  callback_query?: TelegramCallbackQuery;
  message?: TelegramMessage;
}

// ─── Status transition map (callback_data action → new status) ────────────────

const ACTION_TO_STATUS: Record<string, OrderItem["status"]> = {
  confirm: "Confirmée",
  ship: "En cours de livraison",
  deliver: "Livrée",
  cancel: "Annulée",
};

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Verify webhook secret token
  const secretHeader = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (!verifyWebhookSecret(secretHeader)) {
    console.warn("[Telegram Webhook] Invalid secret token");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // ── Handle inline button callbacks ──────────────────────────────────────────
  if (update.callback_query) {
    const query = update.callback_query;
    const userId = query.from.id;
    const callbackData = query.data ?? "";
    const messageId = query.message?.message_id;

    // 2. Authorization: only the configured admin user can trigger actions
    if (!isAuthorizedUser(userId)) {
      await answerCallbackQuery(
        query.id,
        "⛔ Accès non autorisé.",
        true
      );
      return NextResponse.json({ ok: true });
    }

    // Parse callback: "action:orderId"
    const colonIdx = callbackData.indexOf(":");
    if (colonIdx === -1) {
      await answerCallbackQuery(query.id, "❌ Données invalides.");
      return NextResponse.json({ ok: true });
    }

    const action = callbackData.substring(0, colonIdx);
    const orderId = callbackData.substring(colonIdx + 1);

    // 3. Handle "contact" action (no DB change, just send phone link)
    if (action === "contact") {
      const order = getOrderById(orderId);
      if (!order) {
        await answerCallbackQuery(query.id, "❌ Commande introuvable.", true);
        return NextResponse.json({ ok: true });
      }

      const phone = order.customerPhone.replace(/\s/g, "");
      await answerCallbackQuery(
        query.id,
        `📞 ${order.customerPhone}`,
        true
      );
      return NextResponse.json({ ok: true });
    }

    // 4. Determine target status
    const targetStatus = ACTION_TO_STATUS[action];
    if (!targetStatus) {
      await answerCallbackQuery(query.id, "❌ Action inconnue.");
      return NextResponse.json({ ok: true });
    }

    // 5. Fetch order from DB (never trust client-supplied status)
    const order = getOrderById(orderId);
    if (!order) {
      await answerCallbackQuery(query.id, "❌ Commande introuvable.", true);
      return NextResponse.json({ ok: true });
    }

    // 6. Validate transition
    if (!isTransitionAllowed(order.status, targetStatus)) {
      await answerCallbackQuery(
        query.id,
        `⚠️ Transition impossible: ${order.status} → ${targetStatus}`,
        true
      );
      return NextResponse.json({ ok: true });
    }

    // 7. Update DB via existing updateOrderStatus function
    const updated = updateOrderStatus(orderId, targetStatus);
    if (!updated) {
      await answerCallbackQuery(query.id, "❌ Erreur de mise à jour.", true);
      return NextResponse.json({ ok: true });
    }

    // 8. Confirm to admin via callback answer
    const newLabel = STATUS_LABELS[targetStatus];
    await answerCallbackQuery(
      query.id,
      `✅ Commande ${orderId} → ${newLabel}`,
      false
    );

    // 9. Edit the original Telegram message to reflect new status + updated buttons
    if (messageId) {
      await updateOrderMessage(messageId, updated);
    }

    return NextResponse.json({ ok: true });
  }

  // ── Handle text commands from authorized user ────────────────────────────────
  if (update.message?.text && update.message.from) {
    const userId = update.message.from.id;

    if (!isAuthorizedUser(userId)) {
      // Silently ignore unauthorized messages
      return NextResponse.json({ ok: true });
    }

    const text = update.message.text.trim();

    if (text === "/start") {
      await sendAdminMessage(
        "🤖 *Fsahi Fragrances Bot*\n\nBot de gestion des commandes actif\\.\n\n" +
        "Commandes disponibles:\n" +
        "/orders — Commandes récentes\n" +
        "/pending — Commandes en attente\n" +
        "/stats — Statistiques\n" +
        "/help — Aide"
      );
    } else if (text === "/orders") {
      await handleOrdersCommand();
    } else if (text === "/pending") {
      await handlePendingCommand();
    } else if (text === "/stats") {
      await handleStatsCommand();
    } else if (text === "/help") {
      await sendAdminMessage(
        "📋 *Commandes disponibles:*\n\n" +
        "/start \\- Démarrer le bot\n" +
        "/orders \\- 10 dernières commandes\n" +
        "/pending \\- Commandes en attente\n" +
        "/stats \\- Statistiques du jour\n" +
        "/help \\- Cette aide\n\n" +
        "Utilisez les boutons inline sur les notifications pour gérer les commandes\\."
      );
    }
  }

  return NextResponse.json({ ok: true });
}

// ─── Command handlers ─────────────────────────────────────────────────────────

async function handleOrdersCommand() {
  const orders = getOrders().slice(0, 10);
  if (orders.length === 0) {
    await sendAdminMessage("📭 Aucune commande trouvée\\.");
    return;
  }

  const esc = (s: string) =>
    s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

  const lines = orders.map((o) => {
    const label = STATUS_LABELS[o.status] ?? o.status;
    return `• *${esc(o.id)}* — ${esc(o.perfumeName)} — ${o.totalAmount} DH — ${esc(label)}`;
  });

  await sendAdminMessage(
    `🛍️ *10 DERNIÈRES COMMANDES*\n━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}`
  );
}

async function handlePendingCommand() {
  const pending = getOrders().filter((o) => o.status === "En attente");

  const esc = (s: string) =>
    s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

  if (pending.length === 0) {
    await sendAdminMessage("✅ Aucune commande en attente\\.");
    return;
  }

  const lines = pending.map(
    (o) =>
      `• *${esc(o.id)}* — ${esc(o.customerName)} — ${esc(o.perfumeName)} ${o.format} × ${o.quantity} — *${o.totalAmount} DH*`
  );

  await sendAdminMessage(
    `🟡 *COMMANDES EN ATTENTE \\(${pending.length}\\)*\n━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}`
  );
}

async function handleStatsCommand() {
  const orders = getOrders();
  const today = new Date().toDateString();

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );

  const total = orders.reduce((s, o) => s + o.totalAmount, 0);
  const todayTotal = todayOrders.reduce((s, o) => s + o.totalAmount, 0);

  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const esc = (s: string) =>
    s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

  const statusLines = Object.entries(byStatus).map(
    ([status, count]) =>
      `  ${STATUS_LABELS[status as OrderItem["status"]] ?? esc(status)}: ${count}`
  );

  await sendAdminMessage(
    `📊 *STATISTIQUES*\n━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 Total commandes: *${orders.length}*\n` +
    `📅 Aujourd'hui: *${todayOrders.length}* commandes — *${todayTotal} DH*\n` +
    `💰 CA Total: *${esc(String(total))} DH*\n\n` +
    `📋 *Par statut:*\n${statusLines.join("\n")}`
  );
}

// Telegram GET endpoint (for webhook verification / health check)
export async function GET() {
  return NextResponse.json({
    status: "Telegram webhook active",
    configured: Boolean(
      process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
    ),
  });
}
