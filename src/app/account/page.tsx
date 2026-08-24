"use client";

import { useSession, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Package, ShoppingBag, LogOut, Shield, Settings, Pencil, Check, X } from "lucide-react";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setNameValue(session.user.name);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session.user?.role === "ADMIN";

  const handleSaveName = async () => {
    setNameError("");
    if (nameValue.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setSavingName(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setNameError(data.error || "Failed to update");
        return;
      }
      await update();
      setEditingName(false);
    } catch {
      setNameError("Something went wrong");
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {session.user?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Name</span>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="w-40 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNameValue(session.user?.name || "");
                    setNameError("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{session.user?.name || "N/A"}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>
          {nameError && (
            <p className="text-xs text-red-500 text-right">{nameError}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{session.user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Account Type</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
              {isAdmin ? (
                <>
                  <Shield size={14} className="text-amber-500" />
                  Admin
                </>
              ) : (
                "Customer"
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium text-gray-900">January 2024</span>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-3 mb-6">
        <Link
          href="/account/orders"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:bg-gray-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
            <Package size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900">My Orders</h3>
            <p className="text-xs text-gray-500">View and track your orders</p>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:bg-gray-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
            <ShoppingBag size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900">Continue Shopping</h3>
            <p className="text-xs text-gray-500">Browse our latest products</p>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-4 bg-white border border-amber-200 rounded-xl p-4 sm:p-5 hover:bg-amber-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Settings size={20} className="text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-amber-900">Admin Panel</h3>
              <p className="text-xs text-amber-600">Manage products and orders</p>
            </div>
            <svg
              className="w-5 h-5 text-amber-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 rounded-xl p-4 sm:p-5 hover:bg-red-50 transition-colors font-medium"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
