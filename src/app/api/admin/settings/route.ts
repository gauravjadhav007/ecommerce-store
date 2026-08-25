import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
    if (!setting) {
      setting = await prisma.storeSettings.create({ data: { key: "payment_mode", value: "test" } });
    }
    return NextResponse.json({ paymentMode: setting.value });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMode } = await req.json();
    if (paymentMode !== "live" && paymentMode !== "test") {
      return NextResponse.json({ error: "Invalid payment mode" }, { status: 400 });
    }

    await prisma.storeSettings.upsert({
      where: { key: "payment_mode" },
      update: { value: paymentMode },
      create: { key: "payment_mode", value: paymentMode },
    });

    return NextResponse.json({ paymentMode });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
