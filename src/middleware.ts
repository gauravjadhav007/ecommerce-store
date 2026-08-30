import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecrypt } from "jose";
import { hkdf } from "@panva/hkdf";

const protectedRoutes = ["/checkout"];
const adminRoutes = ["/admin"];
const adminLoginRoutes = ["/admin/login"];
const authRoutes = ["/login", "/register"];

async function getDerivedEncryptionKey(keyMaterial: string, salt: string) {
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`,
    32
  );
}

async function decryptToken(token: string): Promise<{ role?: string } | null> {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret, "");
    const { payload } = await jwtDecrypt(token, encryptionSecret, {
      clockTolerance: 15,
    });
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
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
      const payload = await decryptToken(token);
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
    const payload = await decryptToken(token);
    if (payload?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|logo-white.svg|.*\\..*).*)"],
};
