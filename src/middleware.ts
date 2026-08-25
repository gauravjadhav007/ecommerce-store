import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/cart", "/checkout"];
const adminRoutes = ["/admin"];
const adminLoginRoutes = ["/admin/login"];
const authRoutes = ["/login", "/register"];

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  if (host === "gtshoppingonline.in" && !pathname.startsWith("/api/")) {
    const wwwUrl = new URL(request.url);
    wwwUrl.hostname = "www.gtshoppingonline.in";
    return NextResponse.redirect(wwwUrl, 308);
  }

  const token = request.cookies.get("__Secure-next-auth.session-token")?.value || request.cookies.get("next-auth.session-token")?.value;

  // Allow admin login page without auth
  if (adminLoginRoutes.includes(pathname)) {
    if (token) {
      const payload = decodeToken(token);
      if (payload?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Redirect logged-in users away from login/register (except admin)
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect cart/checkout - require any login
  if (protectedRoutes.includes(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes - require ADMIN role
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const payload = decodeToken(token);
    if (payload?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|logo-white.svg|.*\\..*).*)"],
};
