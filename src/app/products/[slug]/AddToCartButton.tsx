"use client";

import { useCart } from "@/stores/cart";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const handleAdd = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 sm:p-3 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Minus size={16} />
          </button>
          <span className="px-3 sm:px-4 font-medium min-w-[40px] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-3 sm:p-3 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-gray-900 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
