"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Package, Truck, CreditCard, MapPin, ArrowRight } from "lucide-react";
import { getWhatsAppOrderLink } from "@/lib/whatsapp";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string | null;
  shippingAddr: any;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

function OrderConfirmed() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isDigital = searchParams.get("digital") === "true";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4 sm:mb-6" />
          <h1 className="text-xl sm:text-2xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          {orderNumber && (
            <p className="text-sm text-gray-700 font-medium mb-6">
              Order Number: <span className="text-gray-900">{orderNumber}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 text-sm"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingAddr = order.shippingAddr || {};
  const subtotal = order.total;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Success Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-green-600 sm:hidden" />
          <CheckCircle size={48} className="text-green-600 hidden sm:block" />
        </div>
        <h1 className="text-xl sm:text-3xl font-bold mb-2">
          {isDigital ? "Your order is complete!" : "Order Confirmed!"}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Thank you for purchasing from GT Shop
        </p>
      </div>

      {/* Digital Download Banner */}
      {isDigital && orderNumber && (
        <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold mb-2">Your download is ready</h2>
          <p className="text-blue-100 text-sm mb-5">
            We&apos;ve sent your download link to <span className="font-semibold">{order?.shippingEmail || "your email"}</span>
          </p>
          <Link
            href={`/download/${orderNumber}`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
          >
            Download Your Product
          </Link>
        </div>
      )}

      {/* Order Number & Date */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-sm sm:text-base font-semibold mb-4">Order Status</h2>
        <div className="flex items-center justify-between">
          {["Confirmed", "Processing", "Shipped", "Delivered"].map((step, i) => {
            const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
            const currentIdx = statuses.indexOf(order.status);
            const isActive = i <= currentIdx;
            return (
              <div key={step} className="flex-1 text-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2 ${
                  isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {i === 0 && <CheckCircle size={16} />}
                  {i === 1 && <Package size={16} />}
                  {i === 2 && <Truck size={16} />}
                  {i === 3 && <CheckCircle size={16} />}
                </div>
                <p className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}>{step}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-sm sm:text-base font-semibold mb-4">
              Items Ordered ({order.items.length})
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      ₹{((item.price * item.quantity) / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
              <CreditCard size={16} /> Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{(subtotal / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST)</span>
                <span>Included</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-base">
                <span>Total Paid</span>
                <span className="text-gray-900">₹{(subtotal / 100).toFixed(0)}</span>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                <CreditCard size={12} /> Payment: {order.paidAt ? "Paid Online (Razorpay)" : "Cash on Delivery"}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
              <MapPin size={16} /> Shipping Address
            </h2>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p className="font-medium">{order.shippingName}</p>
              <p>{shippingAddr.address || "N/A"}</p>
              <p>
                {shippingAddr.city || ""}{shippingAddr.state ? `, ${shippingAddr.state}` : ""}{" "}
                {shippingAddr.zip || ""}
              </p>
              <p>{shippingAddr.country || "India"}</p>
              <p className="text-gray-500 mt-2">{order.shippingEmail}</p>
              {order.shippingPhone && (
                <p className="text-gray-500">{order.shippingPhone}</p>
              )}
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-sm sm:text-base font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <Truck size={16} /> Estimated Delivery
            </h2>
            <p className="text-sm text-blue-700 font-medium">
              {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" - "}
              {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Standard delivery: 5-7 business days
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 sm:mt-10 border-t border-gray-200 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          {isDigital ? (
            <>
              <Link
                href="/digital-products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              >
                Browse More Products <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Back to Home
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/products"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              >
                Continue Shopping <ArrowRight size={16} />
              </Link>
              {order?.shippingPhone && (
                <a
                  href={getWhatsAppOrderLink(order.shippingPhone, order.orderNumber, order.total)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  Track on WhatsApp
                </a>
              )}
              <Link
                href="/"
                className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 sm:py-12 text-sm">Loading...</div>}>
      <OrderConfirmed />
    </Suspense>
  );
}
