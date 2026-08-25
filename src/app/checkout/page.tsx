"use client";

import { useCart } from "@/stores/cart";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Tag, X, Check, Lock } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const total = getTotal();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "IN",
  });

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const shipping = total >= 49900 ? 0 : 4900;
  const afterDiscount = total - discount;
  const grandTotal = afterDiscount + shipping;

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user.name || "",
        email: prev.email || session.user.email || "",
        phone: prev.phone || "",
      }));
    }
  }, [session]);

  const fetchPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          city: po.District || po.Name,
          state: po.State,
          country: "IN",
        }));
      }
    } catch {
      // ignore — user can fill manually
    } finally {
      setPincodeLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: total }),
      });
      const data = await res.json();

      if (data.valid) {
        setDiscount(data.discount);
        setAppliedCoupon(couponCode.trim().toUpperCase());
        setCouponSuccess(`Coupon applied! You save ₹${(data.discount / 100).toFixed(0)}`);
        setCouponError("");
      } else {
        setCouponError(data.error || "Invalid coupon");
        setDiscount(0);
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponError("");
    setCouponSuccess("");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your cart is empty</h1>
        <Link
          href="/products"
          className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create order in DB first
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shipping: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          couponCode: appliedCoupon || undefined,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "Failed to create order");
        setLoading(false);
        return;
      }

      const orderNumber = orderData.orderNumber;
      const finalTotal = orderData.total;

      // 2. Create Razorpay order with server-validated total
      const razorpayRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "INR",
          receipt: orderNumber,
        }),
      });

      const razorpayData = await razorpayRes.json();

      if (!razorpayRes.ok) {
        setError(razorpayData.error || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "GT Shop",
        description: `Order ${orderNumber}`,
        order_id: razorpayData.orderId,
        handler: async function (response: any) {
          // 4. Verify payment
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderNumber,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-confirmed?order=${orderNumber}`);
            } else {
              setError("Payment received but verification failed. Contact support with Order: " + orderNumber);
            }
          } catch {
            setError("Payment received but verification failed. Contact support with Order: " + orderNumber);
          }
          setLoading(false);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone ? `+91${form.phone}` : "",
        },
        theme: {
          color: "#111827",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm({ ...form, phone: val });
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Shipping Address</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="e.g. 400001"
                    value={form.zip}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setForm({ ...form, zip: val });
                      if (val.length === 6) fetchPincode(val);
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City {pincodeLoading && <span className="text-gray-400 text-xs">(fetching...)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      State {pincodeLoading && <span className="text-gray-400 text-xs">(fetching...)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sticky top-24">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId}`}
                    className="flex justify-between text-xs sm:text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{((item.price * item.quantity) / 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    Coupon Code
                  </span>
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-green-700 font-medium">
                      <Check size={14} />
                      {appliedCoupon}
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[40px]"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 min-h-[40px]"
                    >
                      {validatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 mt-1">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-green-600 mt-1">{couponSuccess}</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{(total / 100).toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{(discount / 100).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : `₹${(shipping / 100).toFixed(0)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-blue-600">
                    Add ₹{((49900 - total) / 100).toFixed(0)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-semibold text-base sm:text-lg border-t border-gray-200 pt-2 sm:pt-3">
                  <span>Total</span>
                  <span>₹{(grandTotal / 100).toFixed(0)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold mt-4 sm:mt-6 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {loading ? "Processing..." : `Pay ₹${(grandTotal / 100).toFixed(0)}`}
              </button>
              <p className="text-center text-gray-400 text-[11px] mt-3 flex items-center justify-center gap-1">
                <Lock size={12} /> Secured by Razorpay · UPI, Cards, NetBanking
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
