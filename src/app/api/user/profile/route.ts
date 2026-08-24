import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      gender: true,
      dob: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName, lastName, gender, dob } = await req.json();

  const updateData: Record<string, unknown> = {};

  if (firstName !== undefined) updateData.firstName = firstName.trim() || null;
  if (lastName !== undefined) updateData.lastName = lastName.trim() || null;
  if (gender !== undefined) updateData.gender = gender || null;
  if (dob !== undefined) updateData.dob = dob ? new Date(dob) : null;

  if (firstName !== undefined || lastName !== undefined) {
    const f = (firstName || "").trim();
    const l = (lastName || "").trim();
    updateData.name = [f, l].filter(Boolean).join(" ") || null;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  return NextResponse.json({ success: true });
}
