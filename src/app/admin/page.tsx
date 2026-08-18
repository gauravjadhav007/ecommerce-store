"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string };
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Admin Panel</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Make sure you are logged in as an admin user.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue / 100).toFixed(0)}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">{card.title}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-0.5 sm:mt-1">{card.value}</p>
                </div>
                <Icon size={20} className={`${card.color} sm:hidden`} />
                <Icon size={24} className={`${card.color} hidden sm:block`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-xs sm:text-sm text-gray-500 border-b border-gray-200">
                <th className="p-3 sm:p-4">Order</th>
                <th className="p-3 sm:p-4">Customer</th>
                <th className="p-3 sm:p-4">Status</th>
                <th className="p-3 sm:p-4">Total</th>
                <th className="p-3 sm:p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">{order.orderNumber}</td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">
                    <div>{order.user.name || "Guest"}</div>
                    <div className="text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">₹{(order.total / 100).toFixed(0)}</td>
                  <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm">
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
