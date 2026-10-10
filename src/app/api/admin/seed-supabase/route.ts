import { NextResponse } from "next/server";
import { seedProductsToSupabase } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET() {
  return NextResponse.json({
    supabaseConfigured: isSupabaseConfigured(),
    message: isSupabaseConfigured()
      ? "Supabase est configuré. Utilisez POST pour synchroniser les produits."
      : "Supabase n'est pas encore configuré avec SUPABASE_URL et SUPABASE_ANON_KEY.",
  });
}

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase n'est pas configuré. Veuillez définir SUPABASE_URL et SUPABASE_ANON_KEY dans les variables Vercel.",
        },
        { status: 400 }
      );
    }

    const result = await seedProductsToSupabase();
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      importedCount: result.count,
      message: `${result.count} produits synchronisés avec succès vers Supabase !`,
    });
  } catch (err) {
    console.error("[Seed Supabase] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
