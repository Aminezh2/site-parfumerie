import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Mot de passe sécurisé (configurable via .env avec fallback)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Zakaria_2026@";

    if (password === ADMIN_PASSWORD) {
      // Définir un cookie sécurisé HttpOnly
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true, message: "Déconnecté" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur déconnexion" }, { status: 500 });
  }
}
