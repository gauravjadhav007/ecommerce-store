import prisma from "./prisma";

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
