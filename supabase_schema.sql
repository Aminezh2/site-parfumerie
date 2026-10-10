-- ============================================================
-- SCHÉMA COMPLET FSAHI FRAGRANCES — VERSION 2
-- Exécutez CE script dans Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- Supprimer les tables si elles existent (pour un clean reset)
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 1. TABLE DES PRODUITS
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Fsahi Fragrances',
  category TEXT NOT NULL CHECK (category IN ('homme', 'femme', 'unisexe', 'pack')),
  type TEXT DEFAULT 'Eau de Parfum',
  family TEXT DEFAULT 'Parfum Original',
  image TEXT NOT NULL DEFAULT '',
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

-- 2. TABLE DES COMMANDES
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL DEFAULT 'Non spécifiée',
  customer_address TEXT NOT NULL DEFAULT 'Non spécifiée',
  perfume_id TEXT NOT NULL DEFAULT 'unknown',
  perfume_name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Fsahi Fragrances',
  category TEXT NOT NULL DEFAULT 'homme',
  format TEXT NOT NULL CHECK (format IN ('5ml', '10ml')),
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Confirmée', 'En cours de livraison', 'Livrée', 'Annulée')),
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES MESSAGES SUPPORT
CREATE TABLE public.support_messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_support_created_at ON public.support_messages(created_at ASC);

-- ============================================================
-- SÉCURITÉ RLS — Accès complet pour la clé anon (API routes)
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Products: tout autoriser
CREATE POLICY "anon_all_products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: tout autoriser
CREATE POLICY "anon_all_orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Support: tout autoriser
CREATE POLICY "anon_all_support" ON public.support_messages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_support" ON public.support_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- PERMISSIONS SQL (GRANT) — Obligatoire pour PostgREST / Supabase API
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.support_messages TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================================
-- FORCER LE RAFRAÎCHISSEMENT DU CACHE POSTGREST
-- ============================================================
NOTIFY pgrst, 'reload schema';
