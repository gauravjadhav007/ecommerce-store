import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, email } = await req.json();

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Valid email required" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      });
      return NextResponse.json({
        exists: !!user,
        user: user ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } : null,
      });
    }

    if (phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        return NextResponse.json({ error: "Valid 10-digit mobile number required" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({
        where: { phone },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      });
      return NextResponse.json({
        exists: !!user,
        user: user ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } : null,
      });
    }

    return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}
