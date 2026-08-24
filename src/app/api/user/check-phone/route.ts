import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    return NextResponse.json({
      exists: !!user,
      user: user
        ? { firstName: user.firstName, lastName: user.lastName, email: user.email }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check phone" },
      { status: 500 }
    );
  }
}
