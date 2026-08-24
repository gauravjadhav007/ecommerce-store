import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import { Check, Zap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const reviews = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, text: "Finally found products that actually taste amazing! My absolute favorite. The quality is unmatched." },
  { name: "Rahul Verma", location: "Delhi", rating: 4, text: "Great products! Perfect flavor without being too much. Great protein snack for my gym routine." },
  { name: "Anjali Patel", location: "Bangalore", rating: 5, text: "Love that it's quality tested, not mass produced. The originals are pure comfort. Ordered 5 packs already!" },
  { name: "Sneha Gupta", location: "Pune", rating: 5, text: "Best online shopping I've ever had. The quality is unreal. My whole family is hooked!" },
  { name: "Arjun Mehta", location: "Hyderabad", rating: 5, text: "Bought this for a party. Everyone asked where to buy. Now I'm the go-to guy for recommendations!" },
  { name: "Kavita Reddy", location: "Chennai", rating: 4, text: "Good quality and the packaging is top notch. The crunch and quality itself is top notch." },
  { name: "Rohan Singh", location: "Jaipur", rating: 4, text: "Delivery took a bit longer than expected, but the product was fresh and well packed. My favourite!" },
  { name: "Meera Iyer", location: "Kochi", rating: 5, text: "My go-to for gifting. Pure and clean, exactly what I was looking for." },
  { name: "Vikram Joshi", location: "Ahmedabad", rating: 5, text: "The packaging is premium, the taste is premium, everything about this brand screams quality. Highly recommend!" },
  { name: "Pooja Agarwal", location: "Lucknow", rating: 4, text: "The packaging is premium and the product stays fresh. Replaced my evening habit with this. Healthier and just as tasty." },
];

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    take: 8,
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
      {/* Hero - matches reference: dark bg, label, headline, description, CTA */}
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
                Curated products for modern living. Quality you can trust, prices you will love. No shortcuts. No compromises. Just honest, quality shopping.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="inline-block bg-blue-600 text-white px-8 py-3.5 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
                >
                  Shop Now
                </Link>
                <Link
                  href="#story"
                  className="inline-block border border-white/30 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors text-sm tracking-wide uppercase"
                >
                  Our Story
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

      {/* Trust Badges - matches reference with emojis */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100">
            {[
              { emoji: "🛡️", label: "Secure Checkout", sub: "100% Safe" },
              { emoji: "🌿", label: "100% Genuine", sub: "Quality Products" },
              { emoji: "🚚", label: "Free Delivery", sub: "Orders ₹499+" },
              { emoji: "⭐", label: "Top Rated", sub: "5-Star Reviews" },
              { emoji: "🔄", label: "Easy Returns", sub: "7-Day Policy" },
            ].map((badge) => (
              <div key={badge.label} className="py-5 md:py-6 text-center">
                <span className="text-2xl block mb-1.5">{badge.emoji}</span>
                <p className="text-xs font-semibold text-gray-900">{badge.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Reference style with Add to Cart */}
      {featuredProducts.length > 0 && (
        <section id="products" className="py-14 sm:py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                Featured
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Pick Your Story
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Handpicked products curated just for you. Quality, style, and value in every pick. Healthy shopping for every mood.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
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

      {/* Product Detail Image (like reference) */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-400 text-sm">Product Showcase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - matches reference layout */}
      <section id="story" className="py-14 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
                Our Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                From Our Store, With Love
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                What started as a simple love for quality products has grown into a mission: to bring you the finest, hand-picked items at honest prices.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Every item in our collection is carefully curated, tested, and priced fairly. We work directly with trusted brands to bring you the best deals without any middlemen.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                No shortcuts. No compromises. Just honest, quality shopping.
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-6">
                Team GT Shop
              </p>
              <Link
                href="/products"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Read our full story →
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-400 text-sm">Our Store Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With Us - matches reference "Why Makhana?" */}
      <section className="py-14 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why Shop With Us?
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              The store that checks every box
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "💪", title: "Quality Guaranteed", desc: "Every product tested and verified before listing" },
              { emoji: "🚚", title: "Free Delivery", desc: "Free shipping on all orders above ₹499" },
              { emoji: "🔄", title: "Easy Returns", desc: "7-day hassle-free return policy" },
              { emoji: "⭐", title: "Top Rated", desc: "5-star rated by thousands of happy customers" },
            ].map((item) => (
              <div key={item.title} className="text-center bg-white rounded-xl p-6 border border-gray-100">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      {allProducts.length > 0 && (
        <section className="py-14 sm:py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
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

      {/* Testimonials - Scrolling Marquee like reference */}
      <section className="py-14 sm:py-20 md:py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
          </div>
        </div>
        <div className="relative">
          <div className="flex animate-scroll-left gap-5 w-max">
            {[...reviews, ...reviews].map((review, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-white rounded-xl p-5 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, j) => (
                    <span key={j} className="text-gray-200 text-sm">★</span>
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

      {/* Free Delivery CTA - matches reference banner style */}
      <section className="py-14 sm:py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Free Delivery on Orders Above ₹499
          </h2>
          <p className="text-gray-500 mb-8">
            We ship across India. Made with care, delivered to your doorstep.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-10 py-3.5 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
          >
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
}
