import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { Check, Zap, Star, Truck, ShieldCheck, Leaf, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
                Premium Collection
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Shop Smart.
                <span className="block text-blue-400">Live Better.</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                Curated products for modern living. Quality you can trust, prices you will love. Free delivery on orders above ₹499.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-8 py-3.5 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
                >
                  Shop Now
                </Link>
                <Link
                  href="/digital-products"
                  className="inline-block border border-white/30 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors text-sm tracking-wide uppercase"
                >
                  Digital Products
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center">
                  <div className="w-60 h-60 bg-gradient-to-br from-blue-500/30 to-blue-700/30 rounded-full flex items-center justify-center">
                    <Zap className="w-24 h-24 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Orders ₹499+" },
              { icon: ShieldCheck, label: "Secure Payment", sub: "100% Safe" },
              { icon: Leaf, label: "100% Genuine", sub: "Quality Products" },
              { icon: Star, label: "Top Rated", sub: "5-Star Reviews" },
            ].map((badge) => (
              <div key={badge.label} className="py-5 md:py-6 text-center">
                <badge.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900">{badge.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Reference style */}
      {featuredProducts.length > 0 && (
        <section className="py-14 sm:py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                Featured
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Pick Your Story
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Handpicked products curated just for you. Quality, style, and value in every pick.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const images = parseImages(product.images);
                const discount =
                  product.compareAt && product.compareAt > product.price
                    ? Math.round(
                        ((product.compareAt - product.price) / product.compareAt) * 100
                      )
                    : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square mb-4">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Zap className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          {discount}% OFF
                        </span>
                      )}
                      {product.featured && (
                        <span className="absolute top-3 right-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div>
                      {product.category && (
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                          {product.category.name}
                        </p>
                      )}
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{(product.price / 100).toFixed(0)}
                        </span>
                        {product.compareAt && product.compareAt > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{(product.compareAt / 100).toFixed(0)}
                          </span>
                        )}
                      </div>
                      {product.variants.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {product.variants.slice(0, 4).map((v) => (
                            <span
                              key={v.id}
                              className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {v.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-14 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Browse & Choose",
                desc: "Explore our curated collection of products and find what fits your style.",
              },
              {
                step: "2",
                title: "Secure Checkout",
                desc: "Pay safely with UPI, cards, or net banking. Your payment is 100% secure.",
              },
              {
                step: "3",
                title: "Fast Delivery",
                desc: "Get your order delivered to your doorstep. Free shipping on orders above ₹499.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-400 text-sm">Store Image</p>
              </div>
            </div>
            <div>
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                Our Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Quality Products, Honest Prices
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                We started with a simple mission: bring you quality products without the markup. Every item in our store is handpicked, tested, and priced fairly. No shortcuts, no compromises.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                From trending electronics to everyday essentials, we curate products that make your life better. Our team works directly with trusted brands and sellers to bring you the best deals.
              </p>
              <div className="space-y-3">
                {["Premium quality products", "Transparent pricing", "Fast & free delivery", "Easy returns & support"].map(
                  (f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{f}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Products */}
      {allProducts.length > 0 && (
        <section className="py-14 sm:py-20 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                All Products
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Explore Our Collection
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {allProducts.map((product) => {
                const images = parseImages(product.images);
                const discount =
                  product.compareAt && product.compareAt > product.price
                    ? Math.round(
                        ((product.compareAt - product.price) / product.compareAt) * 100
                      )
                    : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Zap className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      {product.category && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {product.category.name}
                        </p>
                      )}
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-gray-900">
                          ₹{(product.price / 100).toFixed(0)}
                        </span>
                        {product.compareAt && product.compareAt > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(product.compareAt / 100).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-14 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                location: "Mumbai",
                rating: 5,
                text: "Amazing quality and super fast delivery! The products exceeded my expectations. Will definitely order again.",
              },
              {
                name: "Rahul V.",
                location: "Delhi",
                rating: 5,
                text: "Best online shopping experience. Great prices, genuine products, and the customer support is excellent.",
              },
              {
                name: "Anjali P.",
                location: "Bangalore",
                rating: 5,
                text: "Love the curated collection! Found exactly what I was looking for. The free delivery was a nice bonus.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Shop?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Free delivery on orders above ₹499. Secure payment. Easy returns.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-10 py-4 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
