"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users, AlertTriangle, TrendingUp, Clock, ArrowUpRight } from "lucide-react";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string; phone: string | null };
    items: { name: string; quantity: number; price: number }[];
  }[];
  lowStockProducts: { id: string; name: string; stock: number; price: number }[];
  topProducts: {
    productId: string;
    _sum: { quantity: number; price: number };
    product: { name: string; images: string } | null;
  }[];
  ordersByStatus: { status: string; _count: { id: number } }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500 text-sm">Loading dashboard...</div></div>;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Panel</h1>
        <p className="text-gray-500">Make sure you are logged in as an admin user.</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.revenueByDay.map(d => d.revenue), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Today + Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
          <p className="text-2xl font-bold mt-1">₹{(data.todayRevenue / 100).toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-sm text-gray-500">Today&apos;s Orders</p>
          <p className="text-2xl font-bold mt-1">{data.todayOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold mt-1">{data.pendingOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold mt-1">{data.totalUsers}</p>
        </div>
      </div>

      {/* Revenue Chart + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Last 7 Days */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Revenue — Last 7 Days</h2>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="flex items-end gap-3 h-40">
            {data.revenueByDay.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-500">₹{(day.revenue / 100).toLocaleString("en-IN")}</span>
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 120, 4)}px` }}
                />
                <span className="text-[10px] text-gray-400">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold mb-6">Orders by Status</h2>
          <div className="space-y-4">
            {data.ordersByStatus.map((s) => {
              const colors: Record<string, string> = {
                PENDING: "bg-gray-400",
                PROCESSING: "bg-blue-500",
                SHIPPED: "bg-indigo-500",
                DELIVERED: "bg-green-500",
                CANCELLED: "bg-red-500",
              };
              const total = data.ordersByStatus.reduce((a, b) => a + b._count.id, 0);
              const pct = total > 0 ? Math.round((s._count.id / total) * 100) : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors[s.status] || "bg-gray-300"}`} />
                      <span>{s.status}</span>
                    </div>
                    <span className="font-medium">{s._count.id} <span className="text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[s.status] || "bg-gray-300"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold">Top Selling Products</h2>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topProducts.length === 0 && (
              <div className="p-6 text-sm text-gray-400 text-center">No sales yet</div>
            )}
            {data.topProducts.map((tp, i) => (
              <div key={tp.productId} className="p-4 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400 w-6">#{i + 1}</span>
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {tp.product?.images && (() => {
                    try { const imgs = JSON.parse(tp.product.images); return imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : null; } catch { return null; }
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{tp.product?.name || "Deleted"}</div>
                  <div className="text-xs text-gray-500">{tp._sum.quantity} sold</div>
                </div>
                <div className="text-sm font-medium">₹{((tp._sum.price || 0) / 100).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              <h2 className="font-semibold">Low Stock</h2>
              {data.lowStockProducts.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                  {data.lowStockProducts.length}
                </span>
              )}
            </div>
            <Link href="/admin/inventory" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Manage <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.lowStockProducts.length === 0 && (
              <div className="p-6 text-sm text-green-600 text-center">All products well stocked</div>
            )}
            {data.lowStockProducts.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">₹{(p.price / 100).toLocaleString("en-IN")}</div>
                </div>
                <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3 hidden md:table-cell">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders?id=${order.id}`} className="font-medium text-sm hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{order.user.name || "Guest"}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">{item.name} x{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">₹{(order.total / 100).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
