import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseImages } from "@/lib/utils";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, shipping } = body as { items: OrderItem[]; shipping: ShippingInfo };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!shipping?.name || !shipping?.email || !shipping?.address || !shipping?.city || !shipping?.state || !shipping?.zip) {
      return NextResponse.json({ error: "Shipping information is incomplete" }, { status: 400 });
    }

    let total = 0;
    const validItems: Array<{ item: OrderItem; product: any }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: "Some products are no longer available" }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Product "${product.name}" is out of stock (available: ${product.stock})` }, { status: 400 });
      }
      total += product.price * item.quantity;
      validItems.push({ item, product });
    }

    let userId = session?.user?.id;
    if (!userId) {
      const existingUser = await prisma.user.findUnique({ where: { email: shipping.email } });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const guestUser = await prisma.user.create({
          data: { email: shipping.email, name: shipping.name },
        });
        userId = guestUser.id;
      }
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
        total,
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingPhone: shipping.phone || null,
        shippingAddr: JSON.stringify(shipping),
        userId,
        items: {
          create: validItems.map(({ item, product }) => ({
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: parseImages(product.images)[0] || null,
            productId: item.productId,
          })),
        },
      },
      include: { items: true },
    });

    for (const { item } of validItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
