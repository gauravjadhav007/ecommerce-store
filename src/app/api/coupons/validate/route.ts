import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, cartTotal } = body;

    if (!code || cartTotal === undefined) {
      return NextResponse.json({ error: "Code and cart total are required" }, { status: 400 });
    }

    const result = await validateCoupon(code, Number(cartTotal));
    return NextResponse.json(result);
  } catch (err) {
    console.error("[COUPON-VALIDATE]", err);
    return NextResponse.json({ valid: false, discount: 0, finalTotal: 0, error: "Failed to validate coupon" }, { status: 200 });
  }
}
