import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { Check, Download, Zap } from "lucide-react";

export default async function HomePage() {
  const digitalProducts = await prisma.product.findMany({
    where: { isActive: true, isDigital: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8 py-20 sm:py-28 md:py-36 text-center">
          <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-6 block">
            Digital Products
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Digital tools that help
            <span className="block text-blue-400">you grow your business</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Ready-to-use templates, business tools and resources for creators and small businesses.
          </p>
          <Link
            href="/digital-products"
            className="inline-block bg-blue-600 text-white px-10 py-4 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-16 sm:py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-10">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "20 Instagram\nTemplates", color: "bg-pink-100 text-pink-600" },
                  { label: "10 Story\nTemplates", color: "bg-purple-100 text-purple-600" },
                  { label: "Invoice &\nPrice List", color: "bg-blue-100 text-blue-600" },
                  { label: "Content\nCalendar", color: "bg-green-100 text-green-600" },
                ].map((item) => (
                  <div key={item.label} className={`${item.color} rounded-xl p-4 text-center`}>
                    <p className="text-xs font-semibold whitespace-pre-line leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-black text-white rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">50+ Templates</p>
                <p className="text-xs text-gray-400 mt-1">Ready to use instantly</p>
              </div>
            </div>

            {/* Info */}
            <div>
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                Best Seller
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Social Media Starter Kit
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Everything you need to create professional social media content for your small business. No design skills required.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "20 Instagram post templates",
                  "10 Instagram story templates",
                  "Invoice, price list & order tracker",
                  "Expense tracker spreadsheet",
                  "30 caption ideas & content calendar",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">₹399</span>
                <span className="text-sm text-gray-400 line-through">₹999</span>
              </div>
              <Link
                href="/digital-products/starter-kit"
                className="block w-full bg-blue-600 text-white py-4 text-center font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 md:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Purchase", desc: "Select your product and complete the checkout." },
              { step: "2", title: "Download", desc: "Get instant access to your files after payment." },
              { step: "3", title: "Use & Grow", desc: "Open in Canva or Google Sheets. Start creating." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Products */}
      {digitalProducts.length > 1 && (
        <section className="py-16 sm:py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-14">
              All Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalProducts.map((product) => {
                const images = parseImages(product.images);
                return (
                  <Link
                    key={product.id}
                    href={`/digital-products/${product.slug}`}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {images[0] ? (
                        <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Zap className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">₹{product.price / 100}</span>
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                          <Download className="w-3 h-3" /> Instant
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
