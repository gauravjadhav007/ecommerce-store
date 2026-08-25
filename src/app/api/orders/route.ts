import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseImages } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { validateCoupon, incrementCouponUsage, getCouponByCode } from "@/lib/coupons";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const FREE_SHIPPING_THRESHOLD = 49900;
const SHIPPING_COST = 4900;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, shipping, couponCode } = body as {
      items: OrderItem[];
      shipping: ShippingInfo;
      couponCode?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!shipping?.name || !shipping?.email || !shipping?.phone || !shipping?.address || !shipping?.city || !shipping?.state || !shipping?.zip) {
      return NextResponse.json({ error: "Shipping information is incomplete" }, { status: 400 });
    }

    let subtotal = 0;
    const validItems: Array<{ item: OrderItem; product: any }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: "Some products are no longer available" }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Product "${product.name}" is out of stock (available: ${product.stock})` }, { status: 400 });
      }
      subtotal += product.price * item.quantity;
      validItems.push({ item, product });
    }

    let discount = 0;
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, subtotal);
      if (couponResult.valid) {
        discount = couponResult.discount;
      }
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal - discount + shippingCost;

    let userId = session?.user?.id;
    if (!userId) {
      let existingUser = await prisma.user.findUnique({ where: { email: shipping.email } });
      if (!existingUser) {
        existingUser = await prisma.user.findUnique({ where: { phone: shipping.phone } });
      }
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const guestUser = await prisma.user.create({
          data: {
            name: shipping.name,
            email: shipping.email,
            phone: shipping.phone,
          },
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
        shippingPhone: shipping.phone,
        shippingAddr: JSON.stringify({ ...shipping, discount, couponCode: couponCode || null }),
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

    if (couponCode) {
      const coupon = await getCouponByCode(couponCode);
      if (coupon) await incrementCouponUsage(coupon.id);
    }

    if (shipping.email) {
      sendOrderConfirmation(
        shipping.email,
        order.orderNumber,
        order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total,
      ).catch((err) => console.error("[Order Email] Failed:", err));
    }

    return NextResponse.json({ orderNumber: order.orderNumber, total });
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
