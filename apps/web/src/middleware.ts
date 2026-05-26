import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/admin"];
const authPaths = ["/connexion", "/inscription"];
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60_000;

function getRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.lastReset > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  // ===== SITE FERME — ACCES BLOQUE =====
  // Pour reouvrir : definir SITE_OPEN=yes ET fournir le bon SITE_BYPASS_KEY.
  const SITE_OPEN = process.env.SITE_OPEN === "yes";
  if (!SITE_OPEN && pathname !== "/maintenance") {
    const bypassKey = process.env.SITE_BYPASS_KEY || "";
    const queryKey = request.nextUrl.searchParams.get("k");
    const cookieKey = request.cookies.get("ll-bypass")?.value;

    if (bypassKey && bypassKey.length >= 16 && (queryKey === bypassKey || cookieKey === bypassKey)) {
      const res = NextResponse.next();
      if (queryKey === bypassKey) {
        res.cookies.set("ll-bypass", bypassKey, { path: "/", maxAge: 60 * 60, httpOnly: true, sameSite: "strict", secure: true });
      }
      return res;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    url.search = "";
    const res = NextResponse.rewrite(url, { status: 503 });
    res.headers.set("Retry-After", "86400");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.headers.set("Pragma", "no-cache");
    return res;
  }

  if (getRateLimit(ip)) {
    return new NextResponse("Too Many Requests", { status: 429, headers: { "Retry-After": "60" } });
  }

  const token = request.cookies.get("ll-auth-token")?.value;
  const userRole = request.cookies.get("ll-user-role")?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const adminRoles = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];
  if (pathname.startsWith("/admin") && token && !adminRoles.includes(userRole || "")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isAuth && token && !request.nextUrl.searchParams.has("logout")) {
    const url = request.nextUrl.clone();
    url.pathname = adminRoles.includes(userRole || "") ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  response.headers.set("X-Request-Id", crypto.randomUUID());
  response.headers.set("X-Response-Time", Date.now().toString());

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
