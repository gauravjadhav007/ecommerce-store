import { NextRequest, NextResponse } from "next/server";
import { generateOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    await generateOtp(phone);

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${phone}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
