"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingName: string;
  shippingEmail: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
}

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Orders</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs sm:text-sm text-gray-500 border-b border-gray-200">
                <th className="p-3 sm:p-4">Order</th>
                <th className="p-3 sm:p-4">Customer</th>
                <th className="p-3 sm:p-4 hidden md:table-cell">Items</th>
                <th className="p-3 sm:p-4">Total</th>
                <th className="p-3 sm:p-4">Status</th>
                <th className="p-3 sm:p-4 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">{order.orderNumber}</td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">
                    <div>{order.user.name || "Guest"}</div>
                    <div className="text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="p-3 sm:p-4 hidden md:table-cell">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-xs sm:text-sm">
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">₹{(order.total / 100).toFixed(0)}</td>
                  <td className="p-3 sm:p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-[10px] sm:text-xs border border-gray-300 rounded px-1.5 sm:px-2 py-1 min-h-[32px]"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
