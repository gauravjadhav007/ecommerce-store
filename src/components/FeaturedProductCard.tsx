"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { parseImages } from "@/lib/utils";
import { useState } from "react";
import { Zap } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    compareAt?: number | null;
    images: string;
    stock: number;
    featured?: boolean;
    category?: { name: string } | null;
    variants: { id: string; name: string; price: number; stock: number }[];
  };
}

export default function FeaturedProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const images = parseImages(product.images);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] || null
  );
  const [added, setAdded] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const discount =
    product.compareAt && product.compareAt > currentPrice
      ? Math.round(
          ((product.compareAt - currentPrice) / product.compareAt) * 100
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      image: images[0] || null,
      stock: product.stock,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const features = [
    "Fast Delivery",
    "Quality Checked",
    "Genuine Product",
    "Easy Returns",
  ];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative bg-gray-50 aspect-square overflow-hidden">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              Best Seller
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-gray-900 text-sm mb-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </Link>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{(currentPrice / 100).toFixed(0)}
          </span>
          {product.compareAt && product.compareAt > currentPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{(product.compareAt / 100).toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>

        {/* Feature Tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {features.map((f) => (
            <span
              key={f}
              className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
