"use client";

import { useCart } from "@/stores/cart";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const shipping = total >= 49900 ? 0 : 4900;
  const grandTotal = total + shipping;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      clearCart();
      router.push(`/order-confirmed?order=${data.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
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

      <form onSubmit={handleSubmit}>
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
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City
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
                      State
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
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] text-sm sm:text-base"
                    >
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
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
              <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{(total / 100).toFixed(0)}</span>
                </div>
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
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold mt-4 sm:mt-6 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
