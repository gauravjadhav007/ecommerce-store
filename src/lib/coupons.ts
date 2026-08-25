import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

const COUPONS_PATH = join(process.cwd(), "data", "coupons.json");

function readCoupons(): Coupon[] {
  if (!existsSync(COUPONS_PATH)) {
    writeFileSync(COUPONS_PATH, "[]", "utf-8");
    return [];
  }
  const raw = readFileSync(COUPONS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeCoupons(coupons: Coupon[]) {
  writeFileSync(COUPONS_PATH, JSON.stringify(coupons, null, 2), "utf-8");
}

export function getAllCoupons(): Coupon[] {
  return readCoupons();
}

export function getCouponByCode(code: string): Coupon | undefined {
  return readCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export function createCoupon(data: Omit<Coupon, "id" | "usedCount" | "createdAt">): Coupon {
  const coupons = readCoupons();
  const newCoupon: Coupon = {
    ...data,
    id: `coupon-${Date.now()}`,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
  coupons.push(newCoupon);
  writeCoupons(coupons);
  return newCoupon;
}

export function updateCoupon(id: string, data: Partial<Omit<Coupon, "id" | "createdAt">>): Coupon | null {
  const coupons = readCoupons();
  const index = coupons.findIndex((c) => c.id === id);
  if (index === -1) return null;
  coupons[index] = { ...coupons[index], ...data };
  writeCoupons(coupons);
  return coupons[index];
}

export function deleteCoupon(id: string): boolean {
  const coupons = readCoupons();
  const filtered = coupons.filter((c) => c.id !== id);
  if (filtered.length === coupons.length) return false;
  writeCoupons(filtered);
  return true;
}

export function validateCoupon(
  code: string,
  cartTotal: number
): { valid: boolean; discount: number; finalTotal: number; error?: string } {
  const coupon = getCouponByCode(code);

  if (!coupon) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "This coupon is no longer active" };
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, finalTotal: cartTotal, error: "This coupon has expired" };
  }

  if (coupon.usedCount >= coupon.maxUses) {
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

  return { valid: true, discount, finalTotal };
}

export function incrementCouponUsage(id: string): void {
  const coupons = readCoupons();
  const index = coupons.findIndex((c) => c.id === id);
  if (index !== -1) {
    coupons[index].usedCount += 1;
    writeCoupons(coupons);
  }
}
