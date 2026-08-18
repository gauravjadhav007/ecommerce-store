import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productKey, name, email, phone } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Digital product pricing
    const digitalProducts: Record<string, { name: string; price: number; slug: string }> = {
      "starter-kit": { name: "Social Media Starter Kit", price: 39900, slug: "social-media-starter-kit" },
    };

    const product = digitalProducts[productKey || "starter-kit"] || digitalProducts["starter-kit"];

    // Find the actual product in DB
    const dbProduct = await prisma.product.findFirst({ where: { slug: product.slug } });

    // Find or create user
    let userId: string;
    const existingUser = email ? await prisma.user.findUnique({ where: { email } }) : null;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const guestUser = await prisma.user.create({
        data: { email: email || `guest_${Date.now()}@gtshop.in`, name: name || "Customer" },
      });
      userId = guestUser.id;
    }

    // Generate order number
    const rand = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `GT-${rand}`;

    // Create order in database
    await prisma.order.create({
      data: {
        orderNumber,
        total: product.price,
        shippingName: name || "Customer",
        shippingEmail: email || "",
        shippingPhone: phone || null,
        shippingAddr: { type: "digital" },
        paymentIntent: razorpay_payment_id,
        status: "PROCESSING",
        userId,
        items: {
          create: {
            name: product.name,
            price: product.price,
            quantity: 1,
            isDigital: true,
            downloaded: false,
            productId: dbProduct?.id || "digital-" + (productKey || "starter-kit"),
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Payment verification failed", details: message }, { status: 500 });
  }
}
