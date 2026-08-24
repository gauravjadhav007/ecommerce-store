import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {
      phone,
      name: name || `User ${phone.slice(-4)}`,
    };

    if (email) {
      data.email = email;
    }

    if (password) {
      data.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.create({
      data,
      select: { id: true, name: true, phone: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
