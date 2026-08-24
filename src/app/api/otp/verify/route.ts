import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and OTP code required" },
        { status: 400 }
      );
    }

    const valid = verifyOtp(phone, code);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
