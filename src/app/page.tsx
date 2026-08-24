import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import { Check, Zap, ArrowRight, Share2, Copy, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const reviews = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, text: "Finally found products that actually taste amazing! My absolute favorite. The quality is unmatched.", verified: true, product: "Premium Cotton T-Shirt" },
  { name: "Rahul Verma", location: "Delhi", rating: 4, text: "Great products! Perfect fit and finish. The material feels premium. Great value for money.", verified: true, product: "Wireless Earbuds Pro" },
  { name: "Anjali Patel", location: "Bangalore", rating: 5, text: "Love the quality! Ordered 5 packs already. The originals are pure comfort. My whole family is hooked!", verified: true, product: "Organic Cotton Hoodie" },
  { name: "Sneha Gupta", location: "Pune", rating: 5, text: "Best online shopping I've ever had. The quality is unreal. Delivery was super fast too!", verified: false, product: "Slim Fit Jeans" },
  { name: "Arjun Mehta", location: "Hyderabad", rating: 5, text: "Bought this for a party. Everyone asked where to buy. Now I'm the go-to guy for recommendations!", verified: true, product: "Classic Polo Shirt" },
  { name: "Kavita Reddy", location: "Chennai", rating: 4, text: "Good quality and the packaging is top notch. The fabric feels premium and comfortable.", verified: true, product: "Running Shoes" },
  { name: "Rohan Singh", location: "Jaipur", rating: 4, text: "Delivery took a bit longer than expected, but the product was fresh and well packed.", verified: false, product: "Denim Jacket" },
  { name: "Meera Iyer", location: "Kochi", rating: 5, text: "My go-to for gifting. Pure and clean, exactly what I was looking for. Highly recommend!", verified: true, product: "Casual Sneakers" },
];

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });

  const categories = await prisma.category.findMany({
    take: 6,
    include: { products: { where: { isActive: true }, take: 1 } },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Product-focused like reference */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                New Collection 2024
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Premium Quality
                <span className="block text-blue-600">For Modern Living</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                Curated products for modern living. Quality you can trust, prices you will love. No shortcuts. No compromises.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="inline-block bg-blue-600 text-white px-8 py-3.5 font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide"
                >
                  Shop Now
                </Link>
                <Link
                  href="#story"
                  className="inline-block border border-gray-300 text-gray-700 px-8 py-3.5 font-semibold hover:bg-gray-50 transition-colors text-sm tracking-wide"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-60 h-60 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
                    <Zap className="w-24 h-24 text-blue-600" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">10,000+</p>
                      <p className="text-xs text-gray-500">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Like reference */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Category Circles - Like reference */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-all">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-gray-700 line-clamp-1">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/products"
              className="flex-shrink-0 group"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-all">
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-gray-700">All Products</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee Promotional Banners - Like reference */}
      <section className="py-4 bg-gray-50 overflow-hidden">
        <div className="flex animate-scroll-left gap-4 w-max">
          {[
            { text: "Launch Offer: Flat 20% off on all products", icon: "🎉" },
            { text: "Combo Deal: Buy any 3 items, save ₹50", icon: "🎁" },
            { text: "Free Delivery on orders above ₹499", icon: "🚚" },
            { text: "New Arrivals: Check out our latest collection", icon: "✨" },
            { text: "Premium Quality: 100% genuine products", icon: "⭐" },
            { text: "Easy Returns: 7-day hassle-free policy", icon: "🔄" },
          ].map((promo, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-5 py-2.5 flex items-center gap-2"
            >
              <span>{promo.icon}</span>
              <span className="text-sm font-medium text-gray-700">{promo.text}</span>
            </div>
          ))}
          {/* Duplicate for seamless scroll */}
          {[
            { text: "Launch Offer: Flat 20% off on all products", icon: "🎉" },
            { text: "Combo Deal: Buy any 3 items, save ₹50", icon: "🎁" },
            { text: "Free Delivery on orders above ₹499", icon: "🚚" },
            { text: "New Arrivals: Check out our latest collection", icon: "✨" },
            { text: "Premium Quality: 100% genuine products", icon: "⭐" },
            { text: "Easy Returns: 7-day hassle-free policy", icon: "🔄" },
          ].map((promo, i) => (
            <div
              key={`dup-${i}`}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-5 py-2.5 flex items-center gap-2"
            >
              <span>{promo.icon}</span>
              <span className="text-sm font-medium text-gray-700">{promo.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products - Bestseller style like reference */}
      {featuredProducts.length > 0 && (
        <section id="products" className="py-14 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2 block">
                  Bestsellers
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Featured Products
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hidden sm:block"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
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

      {/* Why Choose Us - Like reference "Why Makhana?" */}
      <section className="py-14 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              The store that checks every box
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "💪", title: "Quality Guaranteed", desc: "Every product tested and verified" },
              { emoji: "🚚", title: "Free Delivery", desc: "Free shipping on orders above ₹499" },
              { emoji: "🔄", title: "Easy Returns", desc: "7-day hassle-free return policy" },
              { emoji: "⭐", title: "Top Rated", desc: "5-star rated by happy customers" },
            ].map((item) => (
              <div key={item.title} className="text-center bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story - Like reference */}
      <section id="story" className="py-14 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Our Story Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Like reference with verified badges */}
      <section className="py-14 sm:py-20 md:py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Based on 8 verified reviews
            </p>
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
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gray-200" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="text-xs text-gray-400 mb-3">
                  for <span className="font-medium text-gray-600">{review.product}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      {review.verified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share & Get Discount - Like reference */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Love GT Shop?
          </h2>
          <p className="text-gray-500 mb-6">
            Share with friends & they get 20% off!
          </p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm">
              <Share2 className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>
      </section>

      {/* Coupon Banner - Like reference */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Flat 20% OFF on Your First Order
          </h2>
          <p className="text-blue-100 mb-6">
            Use code: <span className="font-mono font-bold text-white">GTSHOP20</span>
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-10 py-3.5 font-semibold hover:bg-gray-100 transition-colors text-sm tracking-wide"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
