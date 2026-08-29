import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { Download, Zap } from "lucide-react";

export const metadata = {
  title: "Digital Products | GT SHOP",
  description: "Ready-to-use templates and tools for small businesses and creators.",
};

export default async function DigitalProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isDigital: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-black text-white py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8 text-center">
          <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
            Our Products
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Digital Products
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Professional templates, tools and resources designed for small businesses and creators.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-14 sm:py-18 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const images = parseImages(product.images);
                return (
                  <Link
                    key={product.id}
                    href={`/digital-products/${product.slug}`}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Zap className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-gray-900 mb-1">{product.name}</h2>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {product.description || "Professional templates ready to use."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">₹{product.price / 100}</span>
                        <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                          <Download className="w-3 h-3" /> Instant Download
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
