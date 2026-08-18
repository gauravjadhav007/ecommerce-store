"use client";

import { useCart } from "@/stores/cart";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4 sm:mb-6" />
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your cart is empty</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors min-h-[44px]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs sm:text-sm text-red-500 hover:text-red-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variantId}`}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] sm:text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium text-sm sm:text-base hover:text-gray-600 line-clamp-1"
                >
                  {item.name}
                </Link>
                {item.variantName && (
                  <p className="text-xs sm:text-sm text-gray-500">{item.variantName}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  ₹{(item.price / 100).toFixed(0)} each
                </p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1),
                          item.variantId
                        )
                      }
                      className="p-1.5 sm:p-2 hover:bg-gray-100 min-w-[32px] min-h-[32px] flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 sm:px-3 text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.min(item.stock, item.quantity + 1),
                          item.variantId
                        )
                      }
                      className="p-1.5 sm:p-2 hover:bg-gray-100 min-w-[32px] min-h-[32px] flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="font-semibold text-sm sm:text-base">
                      ₹{((item.price * item.quantity) / 100).toFixed(0)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id, item.variantId)}
                      className="text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sticky top-24">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{(total / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2 sm:pt-3 flex justify-between font-semibold text-base sm:text-lg">
                <span>Total</span>
                <span>₹{(total / 100).toFixed(0)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-semibold mt-4 sm:mt-6 hover:bg-gray-700 transition-colors min-h-[44px]"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="block text-center text-gray-600 hover:text-gray-900 text-xs sm:text-sm mt-3 sm:mt-4 min-h-[44px] flex items-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
