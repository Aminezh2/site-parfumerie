-- ============================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE POUR FSAHI FRAGRANCES
-- Copiez-collez ce script dans l'éditeur SQL de votre projet Supabase
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. TABLE DES PRODUITS ET PACKS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Fsahi Fragrances',
  category TEXT NOT NULL CHECK (category IN ('homme', 'femme', 'unisexe', 'pack')),
  type TEXT DEFAULT 'Eau de Parfum',
  family TEXT DEFAULT 'Parfum Original',
  image TEXT NOT NULL,
  image_5ml TEXT,
  image_10ml TEXT,
  badge TEXT DEFAULT '',
  description TEXT DEFAULT '',
  top_notes TEXT,
  heart_notes TEXT,
  base_notes TEXT,
  price_5ml NUMERIC NOT NULL DEFAULT 0,
  price_10ml NUMERIC NOT NULL DEFAULT 0,
  old_price_5ml NUMERIC,
  old_price_10ml NUMERIC,
  is_promo BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par catégorie
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 2. TABLE DES COMMANDES
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL DEFAULT 'Non spécifiée',
  customer_address TEXT NOT NULL DEFAULT 'Non spécifiée',
  perfume_id TEXT NOT NULL,
  perfume_name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Fsahi Fragrances',
  category TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('5ml', '10ml')),
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Confirmée', 'En cours de livraison', 'Livrée', 'Annulée')),
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour trier les commandes par date
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 3. TABLE DES MESSAGES SUPPORT CHAT
CREATE TABLE IF NOT EXISTS public.support_messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_created_at ON public.support_messages(created_at ASC);

-- 4. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique des produits
DROP POLICY IF EXISTS "Public select products" ON public.products;
CREATE POLICY "Public select products" ON public.products FOR SELECT USING (true);

-- Autoriser les modifications de produits
DROP POLICY IF EXISTS "Public all products" ON public.products;
CREATE POLICY "Public all products" ON public.products FOR ALL USING (true);

-- Autoriser la lecture et création de commandes
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete orders" ON public.orders;
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

-- Autoriser le support
DROP POLICY IF EXISTS "Public all support" ON public.support_messages;
CREATE POLICY "Public all support" ON public.support_messages FOR ALL USING (true);
