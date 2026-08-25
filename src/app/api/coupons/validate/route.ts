import { NextRequest, NextResponse } from "next/server";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, cartTotal } = body;

    if (!code || cartTotal === undefined) {
      return NextResponse.json({ error: "Code and cart total are required" }, { status: 400 });
    }

    const result = validateCoupon(code, Number(cartTotal));

    if (result.valid) {
      const coupons = (await import("@/lib/coupons")).getAllCoupons();
      const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
      if (coupon) {
        incrementCouponUsage(coupon.id);
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
