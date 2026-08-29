import prisma from "./prisma";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_FLOW_ID_SIGNUP = process.env.MSG91_FLOW_ID_SIGNUP;
const MSG91_FLOW_ID_LOGIN = process.env.MSG91_FLOW_ID_LOGIN;

const MSG91_FLOW_URL = "https://control.msg91.com/api/v5/flow";

async function sendSms(phone: string, otp: string, purpose: "login" | "signup"): Promise<boolean> {
  if (!MSG91_AUTH_KEY) {
    console.error(`[OTP] MSG91_AUTH_KEY not configured! Cannot send SMS to ${phone}`);
    return false;
  }

  const flowId = purpose === "login" ? MSG91_FLOW_ID_LOGIN : MSG91_FLOW_ID_SIGNUP;

  try {
    const res = await fetch(MSG91_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY ?? "",
      },
      body: JSON.stringify({
        flow_id: flowId,
        sender: "GTSHOP",
        recipients: [{ mobiles: [`91${phone}`], var: otp }],
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

export async function createOtp(identifier: string): Promise<string> {
  const code = generateRandomOtp();
  await prisma.otp.deleteMany({ where: { phone: identifier } });
  await prisma.otp.create({
    data: {
      phone: identifier,
      code,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return code;
}

export async function generateOtp(phone: string, purpose: "login" | "signup" = "login"): Promise<string> {
  const code = await createOtp(phone);

  const sent = await sendSms(phone, code, purpose);

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
