import prisma from "./prisma";

export async function generateOtp(phone: string): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  await prisma.otp.deleteMany({ where: { phone } });

  await prisma.otp.create({
    data: {
      phone,
      code,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log(`[OTP] ${phone} -> ${code}`);
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
