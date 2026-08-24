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

    const code = generateOtp(phone);

    // In production, send SMS via Twilio/MSG91 here
    // For development, we just log the OTP
    return NextResponse.json({
      success: true,
      message: `OTP sent to ${phone}`,
      // DEV ONLY: include OTP in response for testing
      otp: code,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
