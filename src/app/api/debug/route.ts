import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET() {
  const status: Record<string, unknown> = {
    supabaseConfigured: isSupabaseConfigured(),
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? "✅ Set" : (process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set (NEXT_PUBLIC)" : "❌ Missing"),
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅ Set" : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set (NEXT_PUBLIC)" : "❌ Missing"),
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ Set" : "❌ Missing",
      TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "✅ Set" : "❌ Missing",
    },
    tables: {} as Record<string, unknown>,
  };

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ...status,
      error: "Supabase n'est pas configuré. Vérifiez les variables d'environnement.",
    });
  }

  // Test each table
  for (const table of ["products", "orders", "support_messages"]) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        (status.tables as Record<string, unknown>)[table] = `❌ Erreur: ${error.message}`;
      } else {
        (status.tables as Record<string, unknown>)[table] = `✅ Existe (${count ?? 0} lignes)`;
      }
      void data;
    } catch (e) {
      (status.tables as Record<string, unknown>)[table] = `❌ Exception: ${String(e)}`;
    }
  }

  return NextResponse.json(status, { status: 200 });
}
