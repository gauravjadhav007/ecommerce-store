import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const digitalDownloads: Record<string, { name: string; downloadUrl: string }[]> = {
  "starter-kit": [
    { name: "Instagram Post Templates (20)", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/posts" },
    { name: "Instagram Story Templates (10)", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/stories" },
    { name: "Invoice & Price List Templates", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/business" },
    { name: "Expense Tracker Spreadsheet", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/expense-tracker" },
    { name: "30-Day Content Calendar", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/content-calendar" },
    { name: "30 Caption Ideas PDF", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/captions" },
    { name: "WhatsApp Promotion Templates", downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID/whatsapp" },
  ],
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const hasDigital = order.items.some((item) => item.isDigital);
    if (!hasDigital) {
      return NextResponse.json({ error: "This order does not contain digital products" }, { status: 400 });
    }

    const productKey = order.items[0]?.productId?.replace("digital-", "") || "starter-kit";
    let downloads = digitalDownloads[productKey] || [];

    if (downloads.length === 0) {
      const product = await prisma.product.findUnique({ where: { id: order.items[0]?.productId } });
      downloads = digitalDownloads[product?.slug || ""] || digitalDownloads["starter-kit"] || [];
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      total: order.total,
      items: downloads,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to fetch download links" }, { status: 500 });
  }
}
