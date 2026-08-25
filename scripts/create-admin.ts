import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const email = "gaurav.jadhav561@gmail.com";
  const password = "Gaurav@007";
  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "ADMIN",
        name: "Gaurav Jadhav",
      },
    });
    console.log(`Admin updated: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        name: "Gaurav Jadhav",
      },
    });
    console.log(`Admin created: ${email}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
