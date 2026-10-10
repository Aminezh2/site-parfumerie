import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side only — no NEXT_PUBLIC_ prefix needed
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseKey.includes("placeholder") &&
    supabaseUrl.startsWith("https://")
  );
}

// Client for server-side operations only (API routes)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
