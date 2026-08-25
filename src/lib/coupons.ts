import prisma from "./prisma";

export interface CouponData {
  id: string;
  code: string;
  discountType: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export async function getAllCoupons(): Promise<CouponData[]> {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCouponByCode(code: string): Promise<CouponData | null> {
  return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
}

export async function createCoupon(data: {
  code: string;
  discountType: string;
  value: number;
  minOrder?: number;
  maxUses?: number;
  expiresAt: string;
  isActive?: boolean;
}): Promise<CouponData> {
  return prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      value: data.value,
      minOrder: data.minOrder || 0,
      maxUses: data.maxUses || 0,
      expiresAt: new Date(data.expiresAt),
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

export async function updateCoupon(id: string, data: Partial<{
  code: string;
  discountType: string;
  value: number;
  minOrder: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}>): Promise<CouponData | null> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.code) updateData.code = data.code.toUpperCase();
  if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);
  return prisma.coupon.update({ where: { id }, data: updateData });
}

export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    await prisma.coupon.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; discount: number; finalTotal: number; error?: string; coupon?: CouponData }> {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "This coupon is no longer active" };
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "This coupon has expired" };
  }

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "This coupon has reached its usage limit" };
  }

  if (cartTotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      finalTotal: cartTotal,
      error: `Minimum order of ₹${(coupon.minOrder / 100).toFixed(0)} required`,
    };
  }

  let discount: number;
  if (coupon.discountType === "percentage") {
    discount = Math.round((cartTotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }

  discount = Math.min(discount, cartTotal);
  const finalTotal = cartTotal - discount;

  return { valid: true, discount, finalTotal, coupon };
}

export async function incrementCouponUsage(id: string): Promise<void> {
  await prisma.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } },
  });
}
