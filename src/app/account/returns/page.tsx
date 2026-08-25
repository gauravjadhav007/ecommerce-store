"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";

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
  createdAt: string;
  items: OrderItem[];
}

interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  items: { id: string; name: string; quantity: number }[];
  reason: string;
  type: "RETURN" | "EXCHANGE";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  PENDING: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: <Clock size={14} />,
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: <CheckCircle size={14} />,
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: <XCircle size={14} />,
  },
};

export default function ReturnsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [requestType, setRequestType] = useState<"RETURN" | "EXCHANGE">("RETURN");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      const stored = localStorage.getItem("return-requests");
      if (stored) {
        const all: ReturnRequest[] = JSON.parse(stored);
        setReturnRequests(
          all.filter((r) => r.orderId && session?.user?.id)
        );
      }
    }
  }, [session]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || selectedItems.length === 0 || !reason.trim()) return;

    setSubmitting(true);

    const items = selectedOrder.items
      .filter((i) => selectedItems.includes(i.id))
      .map((i) => ({ id: i.id, name: i.name, quantity: i.quantity }));

    const newRequest: ReturnRequest = {
      id: `RET-${Date.now()}`,
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      items,
      reason: reason.trim(),
      type: requestType,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem("return-requests");
    const all: ReturnRequest[] = stored ? JSON.parse(stored) : [];
    all.unshift(newRequest);
    localStorage.setItem("return-requests", JSON.stringify(all));
    setReturnRequests((prev) => [newRequest, ...prev]);

    setSelectedOrderId("");
    setSelectedItems([]);
    setReason("");
    setRequestType("RETURN");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/account" className="hover:text-gray-900">My Account</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">Returns &amp; Exchanges</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Returns &amp; Exchanges</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Your return request has been submitted successfully.
        </div>
      )}

      {/* Submit New Request */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit a Request</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">
            You have no orders yet.{" "}
            <Link href="/products" className="text-gray-900 font-medium hover:underline">
              Start shopping
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Order
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  setSelectedItems([]);
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Choose an order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderNumber} — ₹{(order.total / 100).toFixed(0)} (
                    {new Date(order.createdAt).toLocaleDateString("en-IN")})
                  </option>
                ))}
              </select>
            </div>

            {selectedOrder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Items to Return
                </label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItems.includes(item.id)
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{((item.price * item.quantity) / 100).toFixed(0)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRequestType("RETURN")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    requestType === "RETURN"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <RotateCcw size={16} />
                  Return
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType("EXCHANGE")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    requestType === "EXCHANGE"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ArrowLeftRight size={16} />
                  Exchange
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                placeholder="Please describe the reason for your return/exchange..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || selectedItems.length === 0 || !reason.trim()}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>

      {/* Return Requests History */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Your Return Requests</h2>
        </div>

        {returnRequests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No return requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {returnRequests.map((req) => {
              const statusConfig = STATUS_CONFIG[req.status];
              return (
                <div key={req.id} className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {req.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.icon}
                          {req.status}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                          req.type === "RETURN" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {req.type === "RETURN" ? <RotateCcw size={10} /> : <ArrowLeftRight size={10} />}
                          {req.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Items: {req.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                    </p>
                    <p className="text-xs text-gray-500">Reason: {req.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
