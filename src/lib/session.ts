import { NextRequest } from "next/server";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

function decodeToken(token: string): SessionUser | null {
  try {
    if (!token.includes(".")) {
      const decoded = JSON.parse(Buffer.from(token, "base64url").toString());
      if (decoded.id && decoded.role) {
        return {
          id: decoded.id,
          name: decoded.name || null,
          email: decoded.email || null,
          phone: decoded.phone || null,
          role: decoded.role,
        };
      }
    }
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (decoded.id && decoded.role) {
      return {
        id: decoded.id,
        name: decoded.name || null,
        email: decoded.email || null,
        phone: decoded.phone || null,
        role: decoded.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSessionUser(req: NextRequest): SessionUser | null {
  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;
  if (!token) return null;
  return decodeToken(token);
}
