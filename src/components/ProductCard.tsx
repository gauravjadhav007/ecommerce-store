"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { ShoppingBag, Heart } from "lucide-react";
import { parseImages } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAt?: number | null;
    images: string | string[];
    stock: number;
    category?: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const images = parseImages(product.images);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: images[0] || null,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.compareAt && product.compareAt > product.price
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        {images[0] ? (
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-gray-900 text-white p-2 sm:p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-700 shadow-lg"
        >
          <ShoppingBag size={14} />
        </button>
      </div>
      <div className="mt-2 sm:mt-3 px-0.5">
        {product.category && (
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{product.category.name}</p>
        )}
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 mt-0.5">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            ₹{(product.price / 100).toFixed(0)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{(product.compareAt / 100).toFixed(0)}
            </span>
          )}
        </div>
        {added && (
          <span className="text-[10px] sm:text-xs text-green-600 font-medium">Added!</span>
        )}
      </div>
    </Link>
  );
}
