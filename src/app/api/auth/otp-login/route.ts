import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, email } = await req.json();
    const identifier = email || phone;

    if (!identifier) {
      return NextResponse.json({ error: "Phone or email required" }, { status: 400 });
    }

    let user;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        return NextResponse.json({ error: "Valid phone number required" }, { status: 400 });
      }
      user = await prisma.user.findUnique({ where: { phone } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
    }

    // Simple base64url payload the middleware can decode
    const payload = {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob?.toISOString() || null,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    };

    const token = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const response = NextResponse.json({ success: true });

    const cookieOpts = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    };

    response.cookies.set("__Secure-next-auth.session-token", token, cookieOpts);
    response.cookies.set("next-auth.session-token", token, { ...cookieOpts, secure: false });

    return response;
  } catch (error) {
    console.error("[OTP-LOGIN]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
