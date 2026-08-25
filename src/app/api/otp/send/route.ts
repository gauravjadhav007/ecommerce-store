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

    const code = await generateOtp(phone);

    const message = `Your GT Shop login OTP is: ${code}\n\nThis code expires in 5 minutes.\nDo not share this with anyone.`;
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${phone}`,
      otp: code,
      whatsappUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
