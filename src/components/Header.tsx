"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { User, Menu, X, LogOut, Package, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-gray-700"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="GT Shop" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {session ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <User size={20} />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
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
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[56px] bg-white z-50 overflow-y-auto md:hidden">
          <nav className="px-4 py-4">
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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
