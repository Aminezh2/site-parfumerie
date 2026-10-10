import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface PerfumeItem {
  id: string;
  name: string;
  brand: string;
  category: "homme" | "femme" | "unisexe" | "pack";
  type: string;
  family: string;
  image: string;        // Photo de couverture (affichée sur les cartes)
  image5ml?: string;    // Photo spécifique au flacon 5ml (optionnelle)
  image10ml?: string;   // Photo spécifique au flacon 10ml (optionnelle)
  badge?: string;
  description: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  price5ml: number;
  price10ml: number;
  oldPrice5ml?: number;  // Ancien prix 5ml (pour affichage PROMO barré)
  oldPrice10ml?: number; // Ancien prix 10ml (pour affichage PROMO barré)
  isPromo?: boolean;     // Indicateur de promotion
  inStock: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  perfumeId: string;
  perfumeName: string;
  brand: string;
  category: "homme" | "femme" | "unisexe" | "pack";
  format: "5ml" | "10ml";
  price: number;
  quantity: number;
  totalAmount: number;
  status: "En attente" | "Confirmée" | "En cours de livraison" | "Livrée" | "Annulée";
  createdAt: string;
  /** Telegram message ID for the notification — used to edit the message on status change */
  telegramMessageId?: number;
}

export interface SupportMessage {
  id: string;
  content: string;
  role: "client" | "admin";
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SUPPORT_FILE = path.join(DATA_DIR, "support_messages.json");

// In-memory fallback cache when filesystem is read-only (e.g. Vercel serverless without Supabase)
let inMemoryOrders: OrderItem[] = [];
let inMemorySupport: SupportMessage[] = [];

// Safe file helpers (handles read-only Vercel environment)
function readJsonFileSafe<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[DB] Could not read ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFileSafe(filePath: string, data: unknown): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.warn(`[DB] Filesystem write ignored (expected in read-only serverless):`, err);
    return false;
  }
}

// ─── SUPABASE ROW MAPPERS ───────────────────────────────────────────────────

function toProductRow(p: PerfumeItem) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    type: p.type,
    family: p.family,
    image: p.image,
    image_5ml: p.image5ml ?? null,
    image_10ml: p.image10ml ?? null,
    badge: p.badge ?? "",
    description: p.description ?? "",
    top_notes: p.topNotes ?? null,
    heart_notes: p.heartNotes ?? null,
    base_notes: p.baseNotes ?? null,
    price_5ml: p.price5ml,
    price_10ml: p.price10ml,
    old_price_5ml: p.oldPrice5ml ?? null,
    old_price_10ml: p.oldPrice10ml ?? null,
    is_promo: Boolean(p.isPromo),
    in_stock: Boolean(p.inStock),
    created_at: p.createdAt || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromProductRow(row: any): PerfumeItem {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    brand: String(row.brand || "Fsahi Fragrances"),
    category: (row.category || "homme") as PerfumeItem["category"],
    type: String(row.type || "Eau de Parfum"),
    family: String(row.family || "Parfum Original"),
    image: String(row.image || ""),
    image5ml: row.image_5ml || row.image5ml || undefined,
    image10ml: row.image_10ml || row.image10ml || undefined,
    badge: row.badge || undefined,
    description: String(row.description || ""),
    topNotes: row.top_notes || row.topNotes || undefined,
    heartNotes: row.heart_notes || row.heartNotes || undefined,
    baseNotes: row.base_notes || row.baseNotes || undefined,
    price5ml: Number(row.price_5ml ?? row.price5ml ?? 0),
    price10ml: Number(row.price_10ml ?? row.price10ml ?? 0),
    oldPrice5ml: row.old_price_5ml != null ? Number(row.old_price_5ml) : (row.oldPrice5ml != null ? Number(row.oldPrice5ml) : undefined),
    oldPrice10ml: row.old_price_10ml != null ? Number(row.old_price_10ml) : (row.oldPrice10ml != null ? Number(row.oldPrice10ml) : undefined),
    isPromo: Boolean(row.is_promo ?? row.isPromo),
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : Boolean(row.inStock ?? true),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function toOrderRow(o: OrderItem) {
  return {
    id: o.id,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_city: o.customerCity,
    customer_address: o.customerAddress,
    perfume_id: o.perfumeId,
    perfume_name: o.perfumeName,
    brand: o.brand,
    category: o.category,
    format: o.format,
    price: o.price,
    quantity: o.quantity,
    total_amount: o.totalAmount,
    status: o.status,
    created_at: o.createdAt || new Date().toISOString(),
    telegram_message_id: o.telegramMessageId ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromOrderRow(row: any): OrderItem {
  return {
    id: String(row.id),
    customerName: String(row.customer_name ?? row.customerName ?? ""),
    customerPhone: String(row.customer_phone ?? row.customerPhone ?? ""),
    customerCity: String(row.customer_city ?? row.customerCity ?? ""),
    customerAddress: String(row.customer_address ?? row.customerAddress ?? ""),
    perfumeId: String(row.perfume_id ?? row.perfumeId ?? ""),
    perfumeName: String(row.perfume_name ?? row.perfumeName ?? ""),
    brand: String(row.brand || "Fsahi Fragrances"),
    category: (row.category || "homme") as OrderItem["category"],
    format: (row.format === "10ml" ? "10ml" : "5ml"),
    price: Number(row.price || 0),
    quantity: Number(row.quantity || 1),
    totalAmount: Number(row.total_amount ?? row.totalAmount ?? 0),
    status: (row.status || "En attente") as OrderItem["status"],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    telegramMessageId: row.telegram_message_id ? Number(row.telegram_message_id) : (row.telegramMessageId ? Number(row.telegramMessageId) : undefined),
  };
}

// ─── PRODUCTS API ───────────────────────────────────────────────────────────

export async function getProducts(): Promise<PerfumeItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(fromProductRow);
      }
      if (error) {
        console.warn("[Supabase] Products query notice:", error.message);
      }
    } catch (e) {
      console.warn("[Supabase] Failed to fetch products, falling back to local file:", e);
    }
  }

  // Fallback to local products.json
  const fileProducts = readJsonFileSafe<PerfumeItem[]>(PRODUCTS_FILE, []);
  return fileProducts;
}

export async function addProduct(
  productData: Omit<PerfumeItem, "id" | "createdAt">
): Promise<PerfumeItem> {
  const newProduct: PerfumeItem = {
    ...productData,
    id: `perfume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const row = toProductRow(newProduct);
      const { error } = await supabase.from("products").insert(row);
      if (!error) return newProduct;
      console.error("[Supabase] Error adding product:", error);
    } catch (err) {
      console.error("[Supabase] Exception adding product:", err);
    }
  }

  const products = readJsonFileSafe<PerfumeItem[]>(PRODUCTS_FILE, []);
  products.unshift(newProduct);
  writeJsonFileSafe(PRODUCTS_FILE, products);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<PerfumeItem>
): Promise<PerfumeItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const patch: Record<string, unknown> = {};
      if (updates.name !== undefined) patch.name = updates.name;
      if (updates.brand !== undefined) patch.brand = updates.brand;
      if (updates.category !== undefined) patch.category = updates.category;
      if (updates.type !== undefined) patch.type = updates.type;
      if (updates.family !== undefined) patch.family = updates.family;
      if (updates.image !== undefined) patch.image = updates.image;
      if (updates.image5ml !== undefined) patch.image_5ml = updates.image5ml;
      if (updates.image10ml !== undefined) patch.image_10ml = updates.image10ml;
      if (updates.badge !== undefined) patch.badge = updates.badge;
      if (updates.description !== undefined) patch.description = updates.description;
      if (updates.price5ml !== undefined) patch.price_5ml = updates.price5ml;
      if (updates.price10ml !== undefined) patch.price_10ml = updates.price10ml;
      if (updates.oldPrice5ml !== undefined) patch.old_price_5ml = updates.oldPrice5ml;
      if (updates.oldPrice10ml !== undefined) patch.old_price_10ml = updates.oldPrice10ml;
      if (updates.isPromo !== undefined) patch.is_promo = updates.isPromo;
      if (updates.inStock !== undefined) patch.in_stock = updates.inStock;

      const { data, error } = await supabase
        .from("products")
        .update(patch)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return fromProductRow(data);
      }
    } catch (err) {
      console.error("[Supabase] Error updating product:", err);
    }
  }

  const products = readJsonFileSafe<PerfumeItem[]>(PRODUCTS_FILE, []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  writeJsonFileSafe(PRODUCTS_FILE, products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Error deleting product:", err);
    }
  }

  const products = readJsonFileSafe<PerfumeItem[]>(PRODUCTS_FILE, []);
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  return writeJsonFileSafe(PRODUCTS_FILE, filtered);
}

/** Seeds all items from data/products.json into Supabase products table */
export async function seedProductsToSupabase(): Promise<{ count: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { count: 0, error: "Supabase n'est pas configuré" };
  }

  try {
    const fileProducts = readJsonFileSafe<PerfumeItem[]>(PRODUCTS_FILE, []);
    if (!fileProducts || fileProducts.length === 0) {
      return { count: 0, error: "Fichier products.json vide ou introuvable" };
    }

    const rows = fileProducts.map(toProductRow);
    const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });

    if (error) {
      return { count: 0, error: error.message };
    }

    return { count: rows.length };
  } catch (err) {
    return { count: 0, error: String(err) };
  }
}

// ─── ORDERS API ─────────────────────────────────────────────────────────────

export async function getOrders(): Promise<OrderItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map(fromOrderRow);
      }
      if (error) {
        console.warn("[Supabase] Orders query notice:", error.message);
      }
    } catch (e) {
      console.warn("[Supabase] Failed to fetch orders:", e);
    }
  }

  const fileOrders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, []);
  if (fileOrders.length > 0) return fileOrders;
  return inMemoryOrders;
}

export async function addOrder(
  orderData: Omit<OrderItem, "id" | "createdAt">
): Promise<OrderItem> {
  const newOrder: OrderItem = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const row = toOrderRow(newOrder);
      const { error } = await supabase.from("orders").insert(row);
      if (!error) {
        return newOrder;
      }
      console.error("[Supabase] Error inserting order:", error);
    } catch (err) {
      console.error("[Supabase] Exception inserting order:", err);
    }
  }

  // Fallback to local / in-memory
  const orders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, inMemoryOrders);
  orders.unshift(newOrder);
  inMemoryOrders = orders;
  writeJsonFileSafe(ORDERS_FILE, orders);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderItem["status"]
): Promise<OrderItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return fromOrderRow(data);
      }
    } catch (err) {
      console.error("[Supabase] Error updating order status:", err);
    }
  }

  const orders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, inMemoryOrders);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = status;
  inMemoryOrders = orders;
  writeJsonFileSafe(ORDERS_FILE, orders);
  return orders[index];
}

export async function saveTelegramMessageId(id: string, messageId: number): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ telegram_message_id: messageId })
        .eq("id", id);

      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Error saving telegram message id:", err);
    }
  }

  const orders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, inMemoryOrders);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return false;

  orders[index].telegramMessageId = messageId;
  inMemoryOrders = orders;
  return writeJsonFileSafe(ORDERS_FILE, orders);
}

export async function getOrderById(id: string): Promise<OrderItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return fromOrderRow(data);
      }
    } catch (err) {
      console.error("[Supabase] Error finding order by id:", err);
    }
  }

  const orders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, inMemoryOrders);
  return orders.find((o) => o.id === id) ?? null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Error deleting order:", err);
    }
  }

  const orders = readJsonFileSafe<OrderItem[]>(ORDERS_FILE, inMemoryOrders);
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  inMemoryOrders = filtered;
  return writeJsonFileSafe(ORDERS_FILE, filtered);
}

// ─── SUPPORT MESSAGES API ───────────────────────────────────────────────────

export async function getSupportMessages(): Promise<SupportMessage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        return data.map((d) => ({
          id: String(d.id),
          content: String(d.content),
          role: (d.role || "client") as SupportMessage["role"],
          created_at: d.created_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Error fetching support messages:", err);
    }
  }

  const fileMsg = readJsonFileSafe<SupportMessage[]>(SUPPORT_FILE, []);
  if (fileMsg.length > 0) return fileMsg;
  return inMemorySupport;
}

export async function addSupportMessage(
  msg: Omit<SupportMessage, "id" | "created_at">
): Promise<SupportMessage> {
  const newMsg: SupportMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("support_messages").insert({
        id: newMsg.id,
        content: newMsg.content,
        role: newMsg.role,
        created_at: newMsg.created_at,
      });
      if (!error) return newMsg;
    } catch (err) {
      console.error("[Supabase] Error adding support message:", err);
    }
  }

  const messages = readJsonFileSafe<SupportMessage[]>(SUPPORT_FILE, inMemorySupport);
  messages.push(newMsg);
  inMemorySupport = messages;
  writeJsonFileSafe(SUPPORT_FILE, messages);
  return newMsg;
}

export async function replySupportMessage(
  id: string,
  reply: string
): Promise<SupportMessage | null> {
  const adminMsg: SupportMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    content: reply,
    role: "admin",
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("support_messages").insert({
        id: adminMsg.id,
        content: adminMsg.content,
        role: adminMsg.role,
        created_at: adminMsg.created_at,
      });
      if (!error) return adminMsg;
    } catch (err) {
      console.error("[Supabase] Error replying support message:", err);
    }
  }

  const messages = readJsonFileSafe<SupportMessage[]>(SUPPORT_FILE, inMemorySupport);
  const index = messages.findIndex((m) => m.id === id && m.role === "client");
  if (index === -1) return null;

  messages.splice(index + 1, 0, adminMsg);
  inMemorySupport = messages;
  writeJsonFileSafe(SUPPORT_FILE, messages);
  return adminMsg;
}

export async function deleteSupportMessage(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("support_messages").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("[Supabase] Error deleting support message:", err);
    }
  }

  const messages = readJsonFileSafe<SupportMessage[]>(SUPPORT_FILE, inMemorySupport);
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  inMemorySupport = filtered;
  writeJsonFileSafe(SUPPORT_FILE, filtered);
  return true;
}
