import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

async function getPaymentMode(): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const setting = await prisma.storeSettings.findUnique({ where: { key: "payment_mode" } });
      return setting?.value || "test";
    } catch (e) {
      console.error(`getPaymentMode attempt ${attempt} failed:`, e);
      if (attempt === 3) return "test";
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  return "test";
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

    let lastError: any;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
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
        lastError = error;
        console.error(`Razorpay API attempt ${attempt} failed:`, error?.message || error);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error?.message || error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
