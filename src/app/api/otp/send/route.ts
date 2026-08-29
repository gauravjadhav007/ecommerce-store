import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Phone OTP is not supported. Please use email OTP." },
    { status: 400 }
  );
}
