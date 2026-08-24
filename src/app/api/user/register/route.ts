import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName, email } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    const name = [firstName, lastName].filter(Boolean).join(" ") || `User ${phone.slice(-4)}`;

    const user = await prisma.user.create({
      data: {
        phone,
        name,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        email: email?.trim() || null,
      },
      select: { id: true, name: true, phone: true },
    });

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
