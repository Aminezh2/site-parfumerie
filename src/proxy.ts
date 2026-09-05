import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const adminSession = request.cookies.get("admin_session");

  // Si on essaye d'accéder à /admin sans être connecté, redirection vers /login
  if (isAdminRoute && !adminSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si on est déjà connecté et qu'on va sur /login, redirection vers /admin
  if (request.nextUrl.pathname.startsWith("/login") && adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
