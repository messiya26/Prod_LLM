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

  if (pathname.startsWith("/admin") && token && userRole !== "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isAuth && token) {
    const url = request.nextUrl.clone();
    url.pathname = userRole === "ADMIN" ? "/admin" : "/dashboard";
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
