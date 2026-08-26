import prisma from "./prisma";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

const MSG91_OTP_URL = "https://control.msg91.com/api/v5/otp";

async function sendSms(phone: string, otp: string): Promise<boolean> {
  if (!MSG91_AUTH_KEY) {
    console.error(`[OTP] MSG91_AUTH_KEY not configured! Cannot send SMS to ${phone}`);
    return false;
  }

  try {
    const res = await fetch(MSG91_OTP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: `91${phone}`,
        authkey: MSG91_AUTH_KEY,
        otp: otp,
        otp_expiry: 5,
        otp_length: 6,
        ...(MSG91_TEMPLATE_ID ? { template_id: MSG91_TEMPLATE_ID } : {}),
      }),
    });

    const data = await res.json();
    console.log(`[OTP][MSG91] ${phone} -> status: ${res.status}`, JSON.stringify(data));

    if (res.ok && (data.type === "success" || data.message === "OTP Sent")) {
      return true;
    }

    console.error(`[OTP][MSG91] Failed for ${phone}:`, data);
    return false;
  } catch (err) {
    console.error(`[OTP][MSG91] Network error sending to ${phone}:`, err);
    return false;
  }
}

function generateRandomOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generateOtp(phone: string): Promise<string> {
  const code = generateRandomOtp();

  await prisma.otp.deleteMany({ where: { phone } });

  await prisma.otp.create({
    data: {
      phone,
      code,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const sent = await sendSms(phone, code);

  if (!sent) {
    throw new Error("Failed to send OTP via MSG91");
  }

  return code;
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const entry = await prisma.otp.findFirst({
    where: { phone, code },
    orderBy: { createdAt: "desc" },
  });

  if (!entry) return false;
  if (Date.now() > entry.expires.getTime()) {
    await prisma.otp.delete({ where: { id: entry.id } });
    return false;
  }

  await prisma.otp.deleteMany({ where: { phone } });
  return true;
}
