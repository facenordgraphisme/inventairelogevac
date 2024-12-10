import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  // Définir les routes protégées
  const protectedRoutes = ["/", "/building", "/inventory"];

  // Si l'utilisateur n'est pas authentifié et tente d'accéder à une route protégée
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Si l'utilisateur est authentifié, autoriser l'accès
  return NextResponse.next();
}

// Définir les chemins où appliquer le middleware
export const config = {
  matcher: ["/((?!auth|api|_next|favicon.ico).*)"], // Protéger toutes les pages sauf celles d'authentification et des API
};
