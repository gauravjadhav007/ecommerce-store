import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encode } from "next-auth/jwt";

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

    const maxAge = 365 * 24 * 60 * 60 * 10;

    const token = await encode({
      token: {
        sub: user.id,
        id: user.id,
        role: user.role,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        dob: user.dob?.toISOString() || null,
        name: user.name,
        email: user.email,
        picture: user.image,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge,
    });

    const response = NextResponse.json({ success: true });

    const cookieOpts = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge,
    };

    response.cookies.set("__Secure-next-auth.session-token", token, cookieOpts);
    response.cookies.set("next-auth.session-token", token, { ...cookieOpts, secure: false });

    return response;
  } catch (error) {
    console.error("[OTP-LOGIN]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
