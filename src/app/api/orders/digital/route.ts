import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const digitalProducts: Record<string, { name: string; price: number; downloadUrl: string }> = {
  "starter-kit": {
    name: "Social Media Starter Kit",
    price: 39900,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productKey, name, email, phone } = body;

    if (!productKey || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const digitalProduct = digitalProducts[productKey];
    if (!digitalProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let userId: string;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const guestUser = await prisma.user.create({
        data: { email, name },
      });
      userId = guestUser.id;
    }

    let orderNumber: string;
    let attempts = 0;
    do {
      const rand = Math.floor(100000 + Math.random() * 900000);
      orderNumber = `GT-${rand}`;
      attempts++;
    } while (attempts < 10);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        total: digitalProduct.price,
        shippingName: name,
        shippingEmail: email,
        shippingPhone: phone || null,
        shippingAddr: { type: "digital" },
        status: "PROCESSING",
        userId,
        items: {
          create: {
            name: digitalProduct.name,
            price: digitalProduct.price,
            quantity: 1,
            isDigital: true,
            downloaded: false,
            productId: "digital-" + productKey,
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Digital order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
