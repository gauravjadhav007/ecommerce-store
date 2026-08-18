import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import { parseImages } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | GT Shop`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const images = parseImages(product.images);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <Link href="/products" className="hover:text-gray-900">
          Products
        </Link>
        {product.category && (
          <>
            <span className="mx-1 sm:mx-2">/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-gray-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {images[0] ? (
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-base sm:text-lg">
                No Image Available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3 sm:mt-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-900"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{product.name}</h1>

          {avgRating > 0 && (
            <div className="flex items-center mt-2 sm:mt-3">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-base sm:text-lg ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
              <span className="text-xs sm:text-sm text-gray-500 ml-2">
                ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 sm:gap-3 mt-4 sm:mt-6">
            <span className="text-2xl sm:text-3xl font-bold">₹{(product.price / 100).toFixed(0)}</span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-lg sm:text-xl text-gray-400 line-through">
                ₹{(product.compareAt / 100).toFixed(0)}
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6 leading-relaxed">
            {product.description || "No description available."}
          </p>

          <div className="mt-4 sm:mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={product.stock > 0 ? "text-green-700" : "text-red-700"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            {product.sku && (
              <p className="text-xs sm:text-sm text-gray-500">SKU: {product.sku}</p>
            )}
          </div>

          {product.stock > 0 && (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: images[0] || null,
                stock: product.stock,
              }}
            />
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Available Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                  >
                    <span>{variant.name}</span>
                    <span className="text-gray-500 ml-2">
                      ₹{(variant.price / 100).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-10 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Customer Reviews</h2>
          <div className="space-y-4 sm:space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 sm:pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <span className="font-medium text-sm sm:text-base">{review.user.name}</span>
                </div>
                {review.comment && (
                  <p className="text-sm sm:text-base text-gray-600 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
