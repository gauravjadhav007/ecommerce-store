import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
    if (!setting) {
      setting = await prisma.storeSettings.create({ data: { key: "payment_mode", value: "test" } });
    }
    return NextResponse.json({ paymentMode: setting.value });
  } catch {
    return NextResponse.json({ paymentMode: "test" });
  }
}
