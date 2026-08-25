"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, Menu, X, Tag, AlertTriangle, BarChart3 } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: BarChart3 },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLowStockCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Mobile Top Nav */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Admin Panel</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mt-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{link.label}</span>
                  {link.href === "/admin/inventory" && lowStockCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                      {lowStockCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-6 px-3">Admin Panel</h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{link.label}</span>
                  {link.href === "/admin/inventory" && lowStockCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                      {lowStockCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          {lowStockCount > 0 && (
            <div className="mt-6 mx-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle size={14} />
                <span className="text-xs font-medium">{lowStockCount} product{lowStockCount !== 1 ? "s" : ""} low on stock</span>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
