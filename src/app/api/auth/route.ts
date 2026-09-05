import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Pour l'instant, on utilise un mot de passe codé en dur (idéalement depuis .env)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zakaria2026";

    if (password === ADMIN_PASSWORD) {
      // Définir un cookie sécurisé
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 semaine
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
