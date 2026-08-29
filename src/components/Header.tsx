"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { ShoppingBag, User, Menu, X, Search, ChevronRight, LogOut, Package, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const itemCount = useCart((s) => s.getItemCount());
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-gray-700 active:text-gray-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo + Store Name */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img src="/logo.svg" alt="GT SHOP" className="h-9 md:h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Search size={20} />
            </button>

            {session ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 active:text-gray-900"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-[60]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {isAdmin ? "Admin" : "Customer"}
                      </span>
                    </div>
                    {isAdmin ? (
                      <Link href="/admin" onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Shield size={16} /> Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link href="/account" onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <User size={16} /> My Account
                        </Link>
                        <Link href="/account/orders" onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Package size={16} /> My Orders
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { signOut(); setAccountMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2 text-gray-600 hover:text-gray-900">
                <User size={20} />
              </Link>
            )}

            <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 md:pb-4">
            <form action="/products" method="get" className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search for products..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile menu */}
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-50 md:hidden transition-transform duration-200 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Mobile menu header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
          <span className="text-base font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 -mr-2 text-gray-700"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-gray-800 border-b border-gray-100"
              >
                <span className="text-sm font-medium">{link.label}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            {session ? (
              <>
                <div className="py-2.5 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{session.user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-800">
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-800">
                      My Account
                    </Link>
                    <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-800">
                      My Orders
                    </Link>
                  </>
                )}
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block py-2.5 text-sm font-medium text-red-600">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-800">
                Sign In / Register
              </Link>
            )}
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-800">
              Cart ({itemCount} items)
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
