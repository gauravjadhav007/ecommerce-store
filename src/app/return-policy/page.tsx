export const metadata = {
  title: "Return Policy | GT SHOP",
  description: "Learn about GT SHOP return and exchange policies.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Return Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7-Day Return Window</h2>
            <p className="text-gray-600 leading-relaxed">
              You can return most items within 7 days of delivery. Items must be unused, in original packaging, and with all tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Eligible Items</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
              <li>Clothing with tags intact and unworn condition</li>
              <li>Accessories in original packaging</li>
              <li>Electronics in sealed, unopened packaging</li>
              <li>Home & kitchen items in unused condition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Non-Returnable Items</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
              <li>Items without original tags or packaging</li>
              <li>Products that have been used, washed, or altered</li>
              <li>Gift cards and digital vouchers</li>
              <li>Intimate or hygiene-related products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">How to Initiate a Return</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Request a return", desc: "Email us at support@gtshop.in with your order number and reason for return." },
                { step: "2", title: "Get a return label", desc: "We will send you a prepaid return shipping label within 24 hours." },
                { step: "3", title: "Ship the item", desc: "Pack the item securely and drop it off at the nearest courier point." },
                { step: "4", title: "Refund processed", desc: "Once we receive and inspect the item, your refund will be credited within 5–7 business days." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Exchanges</h2>
            <p className="text-gray-600 leading-relaxed">
              We offer exchanges for different sizes or colors of the same product, subject to availability. Contact us to arrange an exchange.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For return or exchange requests, email us at <span className="font-medium text-gray-900">support@gtshop.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
