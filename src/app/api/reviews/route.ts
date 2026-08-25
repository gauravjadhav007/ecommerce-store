import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment } = body as {
      productId: string;
      rating: number;
      comment?: string;
    };

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "productId and rating (1-5) are required" },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: session.user.id,
        productId,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
