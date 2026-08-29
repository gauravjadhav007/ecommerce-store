import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Starter Kit | GT SHOP",
  description: "20 Instagram templates, 10 story templates, business spreadsheets, captions and content calendar. Everything you need for your small business social media.",
};

export default function StarterKitPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-10">
        <Link
          href="/digital-products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Preview */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-10 mb-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "20 Instagram\nPost Templates", color: "bg-pink-100 text-pink-600" },
                  { label: "10 Instagram\nStory Templates", color: "bg-purple-100 text-purple-600" },
                  { label: "Invoice, Price List\n& Order Tracker", color: "bg-blue-100 text-blue-600" },
                  { label: "Expense Tracker\n& Content Calendar", color: "bg-green-100 text-green-600" },
                ].map((item) => (
                  <div key={item.label} className={`${item.color} rounded-xl p-5 text-center`}>
                    <p className="text-sm font-semibold whitespace-pre-line leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-black text-white rounded-xl p-5 text-center">
                <p className="text-2xl font-bold">50+ Templates & Tools</p>
                <p className="text-xs text-gray-400 mt-1">Instant digital download</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
              Best Seller
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Social Media Starter Kit
            </h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Create professional social media content for your business — without spending hours designing.
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-8">₹399</p>

            <Link
              href="/checkout/digital?product=starter-kit"
              className="block w-full bg-blue-600 text-white py-4 text-center font-semibold hover:bg-blue-700 transition-colors text-sm tracking-wide uppercase"
            >
              Buy Now
            </Link>

            <p className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout · Instant download
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">What&apos;s Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "20 Instagram Post Templates", desc: "New product, sale, best seller, review, FAQ and more." },
              { title: "10 Instagram Story Templates", desc: "Poll, question, giveaway, limited stock, announcement." },
              { title: "Invoice Template", desc: "Professional invoice for your business." },
              { title: "Price List Template", desc: "Clean price list for your products or services." },
              { title: "Order Tracker", desc: "Track customer orders easily in a spreadsheet." },
              { title: "Expense Tracker", desc: "Monitor your business expenses." },
              { title: "30 Caption Ideas", desc: "Ready-to-use captions for your posts." },
              { title: "30-Day Content Calendar", desc: "Plan your entire month of content." },
              { title: "WhatsApp Promotion Templates", desc: "Ready-made messages to promote your business." },
              { title: "Customer List Template", desc: "Keep track of your customers." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who is this for? */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Who is this for?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "📱", label: "Instagram Sellers" },
              { icon: "🏪", label: "Small Shops" },
              { icon: "💼", label: "Freelancers" },
              { icon: "✂️", label: "Salons & Barbers" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-20 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I download my files?", a: "After payment, you'll see a download link on the confirmation page. A link is also sent to your email." },
              { q: "What tools do I need?", a: "Most templates work with Canva (free). Spreadsheets work with Google Sheets or Microsoft Excel." },
              { q: "Can I use these for my clients?", a: "Yes! You can use these templates for your own business or for clients you create content for." },
              { q: "Do I get updates?", a: "Yes, you'll receive free updates for 6 months after purchase." },
            ].map((item) => (
              <div key={item.q} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
