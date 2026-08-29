import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose = "login" } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 }
      );
    }

    const code = await createOtp(email);
    await sendOtpEmail(email, code, purpose);

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
