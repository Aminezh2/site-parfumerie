import fs from "fs";
import path from "path";

export interface PerfumeItem {
  id: string;
  name: string;
  brand: string;
  category: "homme" | "femme" | "unisexe";
  type: string;
  family: string;
  image: string;
  badge?: string;
  description: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  price5ml: number;
  price10ml: number;
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
  category: "homme" | "femme" | "unisexe";
  format: "5ml" | "10ml";
  price: number;
  quantity: number;
  totalAmount: number;
  status: "En attente" | "Confirmée" | "En cours de livraison" | "Livrée" | "Annulée";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory and files exist
function ensureFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    const initialProducts: PerfumeItem[] = [
      {
        id: "sauvage-dior",
        name: "Sauvage",
        brand: "Dior",
        category: "homme",
        type: "Eau de Parfum",
        family: "Boisé Épicé",
        image: "/assets/images/sauvage.jpg",
        badge: "Incontournable",
        description: "Une fraîcheur succulente et épicée enrichie d'un absolu de vanille enveloppant.",
        topNotes: "Bergamote de Calabre, Poivre de Sichuan",
        heartNotes: "Star Anis, Lavande",
        baseNotes: "Vanille de Papouasie, Ambroxan",
        price5ml: 130,
        price10ml: 230,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "phantom-rabanne",
        name: "Phantom",
        brand: "Paco Rabanne",
        category: "homme",
        type: "Extrait de Parfum",
        family: "Aromatique Futuriste",
        image: "/assets/images/phantom.jpeg",
        badge: "Populaire",
        description: "La rencontre audacieuse d'une lavande rafraîchissante et d'une vanille addictive.",
        topNotes: "Citron tonique",
        heartNotes: "Lavande futée",
        baseNotes: "Vanille crémeuse, Vétiver",
        price5ml: 110,
        price10ml: 190,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "creed-aventus",
        name: "Aventus",
        brand: "Creed",
        category: "homme",
        type: "Eau de Parfum",
        family: "Fruité Boisé",
        image: "/assets/images/dior.jpg",
        badge: "Prestige Niche",
        description: "Un parfum mythique célébrant la force et la réussite masculine.",
        topNotes: "Ananas royal, Bergamote",
        heartNotes: "Bouleau fumé, Patchouli",
        baseNotes: "Mousse de chêne, Musc",
        price5ml: 190,
        price10ml: 340,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "scandal-jpg",
        name: "Scandal",
        brand: "Jean Paul Gaultier",
        category: "femme",
        type: "Eau de Parfum",
        family: "Gourmand Floral",
        image: "/assets/images/scandal.jpg",
        badge: "Sensuel & Gourmand",
        description: "Un miel gourmand et élégant associé au gardénia envoûtant.",
        topNotes: "Orange Sanguine, Mandarine",
        heartNotes: "Miel, Gardénia",
        baseNotes: "Patchouli, Caramel",
        price5ml: 125,
        price10ml: 215,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "libre-ysl",
        name: "Libre Intense",
        brand: "Yves Saint Laurent",
        category: "femme",
        type: "Eau de Parfum",
        family: "Floral Oriental",
        image: "/assets/images/collection.jpeg",
        badge: "Coup de Cœur",
        description: "Le parfum d'une femme libre à l'instinct sauvage qui rugit de liberté.",
        topNotes: "Bergamote, Mandarine",
        heartNotes: "Fleur d'Oranger, Lavande",
        baseNotes: "Vanille de Madagascar, Ambre",
        price5ml: 135,
        price10ml: 235,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "baccarat-rouge-540",
        name: "Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        category: "femme",
        type: "Extrait de Parfum",
        family: "Ambré Boisé",
        image: "/assets/images/Perfume_bottle_on_black_pedestal_202609010307.jpeg",
        badge: "Niche Étoilée",
        description: "Une alchimie poétique où le jasmin et le safran s'accordent à l'ambre gris.",
        topNotes: "Safran doré, Jasmin",
        heartNotes: "Bois d'ambre",
        baseNotes: "Cèdre de Virginie",
        price5ml: 220,
        price10ml: 390,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    const initialOrders: OrderItem[] = [
      {
        id: "ORD-1001",
        customerName: "Youssef Bennani",
        customerPhone: "0661234567",
        customerCity: "Casablanca",
        customerAddress: "Bd Anfa, Apt 12",
        perfumeId: "sauvage-dior",
        perfumeName: "Sauvage",
        brand: "Dior",
        category: "homme",
        format: "10ml",
        price: 230,
        quantity: 1,
        totalAmount: 230,
        status: "Confirmée",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "ORD-1002",
        customerName: "Siham El Amrani",
        customerPhone: "0669876543",
        customerCity: "Rabat",
        customerAddress: "Agdal, Rue 14",
        perfumeId: "scandal-jpg",
        perfumeName: "Scandal",
        brand: "Jean Paul Gaultier",
        category: "femme",
        format: "5ml",
        price: 125,
        quantity: 1,
        totalAmount: 125,
        status: "En attente",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2));
  }
}

// --- PRODUCTS API ---
export function getProducts(): PerfumeItem[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export function saveProducts(products: PerfumeItem[]): boolean {
  ensureFilesExist();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving products:", error);
    return false;
  }
}

export function addProduct(productData: Omit<PerfumeItem, "id" | "createdAt">): PerfumeItem {
  const products = getProducts();
  const newProduct: PerfumeItem = {
    ...productData,
    id: `perfume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<PerfumeItem>): PerfumeItem | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  return saveProducts(filtered);
}

// --- ORDERS API ---
export function getOrders(): OrderItem[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export function saveOrders(orders: OrderItem[]): boolean {
  ensureFilesExist();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving orders:", error);
    return false;
  }
}

export function addOrder(orderData: Omit<OrderItem, "id" | "createdAt">): OrderItem {
  const orders = getOrders();
  const newOrder: OrderItem = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderItem["status"]): OrderItem | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = status;
  saveOrders(orders);
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  return saveOrders(filtered);
}
