import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        images: true,
        isActive: true,
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, stock } = await req.json();
    if (!id || stock === undefined) {
      return NextResponse.json({ error: "Product ID and stock are required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stock: Number(stock) },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
