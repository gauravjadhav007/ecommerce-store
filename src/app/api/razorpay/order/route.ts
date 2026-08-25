import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

async function getRazorpayInstance() {
  let setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
  const mode = setting?.value || "test";

  if (mode === "live") {
    return new Razorpay({
      key_id: process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least ₹1 (100 paise)" }, { status: 400 });
    }

    const razorpay = await getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    let setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
    const mode = setting?.value || "test";
    const keyId = mode === "live"
      ? (process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID!)
      : (process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID!);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      mode,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
