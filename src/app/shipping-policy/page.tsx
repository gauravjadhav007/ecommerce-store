export const metadata = {
  title: "Shipping Policy | GT Shop",
  description: "Learn about GT Shop shipping options, delivery times, and charges.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Free Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              We offer free standard shipping on all orders above ₹499. Orders below ₹499 will incur a flat shipping fee of ₹49.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Delivery Timelines</h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {[
                { type: "Standard Shipping", time: "5–7 business days", cost: "Free above ₹499 / ₹49 flat" },
                { type: "Express Shipping", time: "2–3 business days", cost: "₹149" },
                { type: "Same-Day Delivery (Select Cities)", time: "Within 24 hours", cost: "₹199" },
              ].map((item) => (
                <div key={item.type} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.type}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.time}</p>
                  </div>
                  <p className="text-gray-900 text-sm font-medium">{item.cost}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Order Processing</h2>
            <p className="text-gray-600 leading-relaxed">
              Orders are processed within 1–2 business days. You will receive a shipping confirmation email with a tracking link once your order has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Delivery Areas</h2>
            <p className="text-gray-600 leading-relaxed">
              We currently deliver across India. For remote or rural areas, delivery may take an additional 2–3 business days. We do not offer international shipping at this time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about shipping, reach out to us at <span className="font-medium text-gray-900">support@gtshop.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
