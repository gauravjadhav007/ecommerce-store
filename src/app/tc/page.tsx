export const metadata = {
  title: "Terms & Conditions | GT SHOP",
  description: "Read the terms and conditions for using GT SHOP.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using GT SHOP, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Products &amp; Pricing</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
              <li>All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to modify prices at any time without prior notice.</li>
              <li>Product images are for illustration purposes; actual items may vary slightly in color or appearance.</li>
              <li>Product availability is subject to stock and may change without notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Orders</h2>
            <p className="text-gray-600 leading-relaxed">
              Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. An order is confirmed only after payment is successfully processed and you receive an order confirmation email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              We accept UPI, credit/debit cards, and Cash on Delivery (COD) for eligible orders. All online payments are processed through secure, encrypted payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating an account and to update it as necessary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              GT SHOP shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these terms, contact us at <span className="font-medium text-gray-900">support@gtshop.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
