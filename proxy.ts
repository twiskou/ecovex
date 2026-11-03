import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

const PUBLIC_ROUTES = [
  "/",
  "/fonctionnalites",
  "/points-collecte",
  "/impact",
  "/a-propos",
  "/contact",
  "/confidentialite",
  "/conditions-utilisation",
  "/cookies",
  "/connexion",
  "/inscription",
  "/acces-interdit",
];

const ROLE_ROUTES: Record<string, ("CITIZEN" | "VERIFIER" | "ADMIN")[]> = {
  "/citoyen": ["CITIZEN", "ADMIN"],
  "/admin": ["ADMIN"],
  "/verificateur": ["VERIFIER", "ADMIN"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static assets
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/uploads/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get session cookie and unseal data
  const sessionCookie = request.cookies.get(sessionOptions.cookieName)?.value;
  let session: SessionData | null = null;

  if (sessionCookie) {
    try {
      session = await unsealData<SessionData>(sessionCookie, {
        password: sessionOptions.password,
      });
    } catch {
      session = null;
    }
  }

  if (!session || !session.isLoggedIn || !session.userId) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      if (!session.role || !allowedRoles.includes(session.role)) {
        return NextResponse.redirect(new URL("/acces-interdit", request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

