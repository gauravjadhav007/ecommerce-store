import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

export const metadata = {
  title: "Products | GT Shop",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const featured = params.featured === "true";
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const where: { isActive: boolean; category?: { slug: string }; featured?: boolean; name?: { contains: string } } = { isActive: true };
  if (category) where.category = { slug: category };
  if (featured) where.featured = true;
  if (search) where.name = { contains: search };

  const orderBy: Record<string, string> =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy }),
    prisma.category.findMany(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-900">
          {activeCategory?.name || featured ? "Featured" : "All Products"}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
            {activeCategory?.name || featured ? "Featured Products" : "All Products"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{products.length} products found</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Mobile filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:hidden">
          <Link
            href="/products"
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !category && !featured ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat.slug ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className={`text-sm ${!category ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                    All Categories
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/products?category=${cat.slug}`} className={`text-sm ${category === cat.slug ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Sort By</h3>
              <ul className="space-y-2">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                ].map((s) => (
                  <li key={s.value}>
                    <Link
                      href={`/products?${new URLSearchParams({ ...params, sort: s.value }).toString()}`}
                      className={`text-sm ${sort === s.value ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <p className="text-gray-500 mb-4 text-sm">No products found.</p>
              <Link href="/products" className="text-gray-900 font-medium text-sm hover:underline">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
