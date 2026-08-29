import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import ReviewSection from "@/components/ReviewSection";
import ProductGallery from "@/components/ProductGallery";
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
  const images = parseImages(product.images);
  return {
    title: `${product.name} | GT SHOP`,
    description:
      product.description?.slice(0, 160) ||
      `${product.name} - Quality products at honest prices`,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: images[0] ? [images[0]] : [],
    },
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
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": images,
          "description": product.description || `${product.name} - Quality products at honest prices`,
          "sku": product.id,
          "brand": {
            "@type": "Brand",
            "name": "GT SHOP"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://gtshoppingonline.in/products/${product.slug}`,
            "priceCurrency": "INR",
            "price": (product.price / 100).toFixed(2),
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "aggregateRating": product.reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": avgRating.toFixed(1),
            "reviewCount": product.reviews.length
          } : undefined
        }),
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gtshoppingonline.in" },
            { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://gtshoppingonline.in/products" },
            ...(product.category ? [{ "@type": "ListItem", "position": 3, "name": product.category.name, "item": `https://gtshoppingonline.in/products?category=${product.category.slug}` }] : []),
            { "@type": "ListItem", "position": product.category ? 4 : 3, "name": product.name }
          ]
        }),
      }}
    />
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
          <ProductGallery images={images} name={product.name} />
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
                    {variant.price !== product.price && (
                      <span className={`ml-1 text-[10px] font-medium ${variant.price > product.price ? "text-red-500" : "text-green-600"}`}>
                        {variant.price > product.price ? "+" : ""}₹{((variant.price - product.price) / 100).toFixed(0)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Returns Info */}
          <div className="mt-6 sm:mt-8 space-y-3 border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-sm sm:text-base mb-3">Shipping & Returns</h3>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-600">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p>On orders above ₹499. Standard delivery: 5-7 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-600">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="font-medium text-gray-900">7-Day Returns</p>
                <p>Easy returns within 7 days of delivery. Item must be unused and in original packaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-600">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="font-medium text-gray-900">Secure Payment</p>
                <p>UPI, Credit/Debit cards accepted. SSL encrypted checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />
    </div>
    </>
  );
}
