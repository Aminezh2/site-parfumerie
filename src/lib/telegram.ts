/**
 * Telegram Bot Service — Fsahi Fragrances Order Notifications
 *
 * Architecture: This module is the SINGLE point of truth for all Telegram API
 * communication. It is server-side only and never imported in client components.
 *
 * Security:
 * - Credentials read exclusively from environment variables
 * - Authorized user ID check before processing any callback
 * - Webhook secret validation in the webhook route
 * - Never logs sensitive customer data
 */

import { OrderItem } from "@/lib/db";

// ─── Configuration ─────────────────────────────────────────────────────────

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";
const AUTHORIZED_USER_ID = process.env.TELEGRAM_AUTHORIZED_USER_ID ?? "";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ─── Status helpers ─────────────────────────────────────────────────────────

/** Map French status → emoji + label */
export const STATUS_LABELS: Record<OrderItem["status"], string> = {
  "En attente": "🟡 EN ATTENTE",
  Confirmée: "✅ CONFIRMÉE",
  "En cours de livraison": "🚚 EN LIVRAISON",
  Livrée: "📦 LIVRÉE",
  Annulée: "❌ ANNULÉE",
};

/** Valid status transitions (prevents illegal state changes) */
const ALLOWED_TRANSITIONS: Record<OrderItem["status"], OrderItem["status"][]> =
  {
    "En attente": ["Confirmée", "Annulée"],
    Confirmée: ["En cours de livraison", "Annulée"],
    "En cours de livraison": ["Livrée", "Annulée"],
    Livrée: [],
    Annulée: [],
  };

export function isTransitionAllowed(
  current: OrderItem["status"],
  next: OrderItem["status"]
): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}

// ─── Telegram API low-level calls ────────────────────────────────────────────

interface TelegramResponse {
  ok: boolean;
  result?: { message_id: number };
  description?: string;
}

async function callTelegramApi(
  method: string,
  payload: Record<string, unknown>
): Promise<TelegramResponse> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] Bot token or chat ID not configured. Skipping.");
    return { ok: false, description: "Not configured" };
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Next.js: don't cache API calls
      cache: "no-store",
    });

    const data = (await response.json()) as TelegramResponse;

    if (!data.ok) {
      console.error(`[Telegram] API error on ${method}:`, data.description);
    }

    return data;
  } catch (err) {
    console.error(`[Telegram] Network error on ${method}:`, err);
    return { ok: false, description: "Network error" };
  }
}

// ─── Message formatting ──────────────────────────────────────────────────────

function formatDate(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  const date = d.toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("fr-MA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

function buildOrderMessage(order: OrderItem): string {
  const { date, time } = formatDate(order.createdAt);
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const phone = order.customerPhone.replace(/\s/g, "");

  // Escape special Markdown V2 chars in user-provided data
  const esc = (s: string) =>
    s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

  return [
    "🔔 *NOUVELLE COMMANDE REÇUE*",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `🆔 Commande: *${esc(order.id)}*`,
    `📅 Date: ${esc(date)}`,
    `🕒 Heure: ${esc(time)}`,
    "",
    "👤 *INFORMATIONS CLIENT*",
    `Nom: ${esc(order.customerName)}`,
    `Tél: [${esc(order.customerPhone)}](tel:${phone})`,
    "",
    "📍 *ADRESSE DE LIVRAISON*",
    `Ville: ${esc(order.customerCity)}`,
    `Adresse: ${esc(order.customerAddress)}`,
    "",
    "🛍️ *DÉTAILS DE LA COMMANDE*",
    `• ${esc(order.perfumeName)} \\(${esc(order.brand)}\\) × ${order.quantity} — Format ${order.format} — ${order.price} DH/u`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `💰 *TOTAL: ${order.totalAmount} DH*`,
    `💳 Paiement: Paiement à la livraison \\(COD\\)`,
    `🏷️ Catégorie: ${esc(order.category.toUpperCase())}`,
    `📊 Statut: *${esc(statusLabel)}*`,
  ].join("\n");
}

function buildInlineKeyboard(order: OrderItem) {
  const id = order.id;
  const adminUrl = `${SITE_URL}/admin`;
  const phone = order.customerPhone.replace(/\s/g, "");

  type InlineButton = { text: string; callback_data: string } | { text: string; url: string };
  const actionButtons: InlineButton[][] = [];

  if (order.status === "En attente") {
    actionButtons.push([
      { text: "✅ Confirmer", callback_data: `confirm:${id}` },
      { text: "❌ Annuler", callback_data: `cancel:${id}` },
    ]);
  } else if (order.status === "Confirmée") {
    actionButtons.push([
      { text: "🚚 Expédier", callback_data: `ship:${id}` },
      { text: "❌ Annuler", callback_data: `cancel:${id}` },
    ]);
  } else if (order.status === "En cours de livraison") {
    actionButtons.push([
      { text: "📦 Marquer Livrée", callback_data: `deliver:${id}` },
    ]);
  }

  // Always show: contact + admin dashboard
  actionButtons.push([
    {
      text: "📞 Contacter Client",
      callback_data: `contact:${id}`,
    },
    {
      text: "🌐 Admin Dashboard",
      url: adminUrl,
    },
  ]);

  return { inline_keyboard: actionButtons };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Sends a new order notification to Telegram.
 * Returns the Telegram message_id so it can be stored for later editing.
 * Never throws — checkout must not fail because of Telegram.
 */
export async function sendOrderNotification(
  order: OrderItem
): Promise<number | null> {
  const text = buildOrderMessage(order);
  const reply_markup = buildInlineKeyboard(order);

  const result = await callTelegramApi("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "MarkdownV2",
    reply_markup,
  });

  if (result.ok && result.result?.message_id) {
    console.log(
      `[Telegram] Order ${order.id} notification sent (msg_id=${result.result.message_id})`
    );
    return result.result.message_id;
  }

  return null;
}

/**
 * Edits an existing Telegram message to reflect the new order status.
 * Used after admin actions via inline buttons.
 */
export async function updateOrderMessage(
  messageId: number,
  order: OrderItem
): Promise<boolean> {
  const text = buildOrderMessage(order);
  const reply_markup = buildInlineKeyboard(order);

  const result = await callTelegramApi("editMessageText", {
    chat_id: TELEGRAM_CHAT_ID,
    message_id: messageId,
    text,
    parse_mode: "MarkdownV2",
    reply_markup,
  });

  return result.ok;
}

/**
 * Answers a callback query (removes the loading spinner on the button).
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text: string,
  showAlert = false
): Promise<void> {
  await callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
}

/**
 * Sends a simple text message to the admin chat.
 */
export async function sendAdminMessage(text: string): Promise<void> {
  await callTelegramApi("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "MarkdownV2",
  });
}

/**
 * Validates that a Telegram callback originates from the authorized admin user.
 */
export function isAuthorizedUser(telegramUserId: number | string): boolean {
  if (!AUTHORIZED_USER_ID) return true; // If not configured, allow (dev mode)
  return String(telegramUserId) === String(AUTHORIZED_USER_ID);
}

/**
 * Verifies the Telegram webhook secret token header.
 */
export function verifyWebhookSecret(secretHeader: string | null): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true; // Not configured → allow (dev)
  return secretHeader === expected;
}
