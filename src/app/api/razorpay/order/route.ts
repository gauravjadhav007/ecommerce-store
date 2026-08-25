import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

async function getPaymentMode(): Promise<string> {
  try {
    const setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
    return setting?.value || "test";
  } catch (e) {
    console.error("Failed to read payment_mode from DB, defaulting to test:", e);
    return "test";
  }
}

function getRazorpayKeys(mode: string) {
  if (mode === "live") {
    return {
      key_id: process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!,
    };
  }
  return {
    key_id: process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET!,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least ₹1 (100 paise)" }, { status: 400 });
    }

    const mode = await getPaymentMode();
    const keys = getRazorpayKeys(mode);

    console.log("Razorpay order - mode:", mode, "keyId:", keys.key_id?.substring(0, 12) + "...");

    const razorpay = new Razorpay(keys);

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keys.key_id,
      mode,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error?.message || error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
