import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendOrderConfirmation } from "@/lib/email";

async function getPaymentMode(): Promise<string> {
  try {
    const setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
    return setting?.value || "test";
  } catch {
    return "test";
  }
}

function getKeySecret(mode: string): string {
  if (mode === "live") {
    return process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!;
  }
  return process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!;
}

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    if (!orderNumber) {
      return NextResponse.json({ error: "Missing order number" }, { status: 400 });
    }

    // Get the correct secret for the current payment mode
    const mode = await getPaymentMode();
    const keySecret = getKeySecret(mode);

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order with payment info
    const order = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentIntent: razorpay_payment_id,
        status: "PROCESSING",
        paidAt: new Date(),
      },
      include: { items: true },
    });

    // Decrement stock now that payment is confirmed
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Send confirmation email (non-blocking)
    if (order.shippingEmail) {
      sendOrderConfirmation(
        order.shippingEmail,
        order.orderNumber,
        order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        order.total
      ).catch((err) => console.error("Email send failed:", err));
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Payment verification failed", details: message }, { status: 500 });
  }
}
