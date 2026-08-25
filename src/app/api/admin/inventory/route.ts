import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: 5 },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        images: true,
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json(lowStockProducts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
