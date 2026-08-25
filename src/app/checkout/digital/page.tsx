"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const products: Record<string, { name: string; price: number; priceInPaise: number }> = {
  "starter-kit": { name: "Social Media Starter Kit", price: 399, priceInPaise: 39900 },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productKey = searchParams.get("product") || "starter-kit";
  const product = products[productKey] || products["starter-kit"];

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Razorpay) {
        setScriptLoaded(true);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!form.name || !form.email) {
      setError("Please fill in your name and email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: product.priceInPaise,
          currency: "INR",
          receipt: `gtshop_${productKey}_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "Failed to create payment order");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GT Shop",
        description: product.name,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify payment on server
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productKey,
                name: form.name,
                email: form.email,
                phone: form.phone,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              router.push(`/order-confirmed?order=${verifyData.orderNumber}&digital=true`);
            } else {
              setError("Payment verified but order creation failed. Contact support.");
            }
          } catch {
            setError("Payment received but verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
          }
          setLoading(false);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone ? `+91${form.phone}` : "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="max-w-lg mx-auto px-4 sm:px-5 py-8 sm:py-12">
        <Link
          href="/digital-products/starter-kit"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to product
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          {/* Product summary */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-400 text-xs mt-0.5">Instant digital download</p>
            </div>
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Customer Information</h2>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Email (for download link)</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="9876543210"
              />
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? "Processing..." : `Pay ₹${product.price}`}
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Secured by Razorpay · UPI, Cards, NetBanking
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DigitalCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
