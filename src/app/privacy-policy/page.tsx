export const metadata = {
  title: "Privacy Policy | GT SHOP",
  description: "Learn how GT SHOP collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              When you use GT SHOP, we collect information you provide directly, including your name, email address, shipping address, and payment details when you place an order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
              <li>To process and fulfill your orders</li>
              <li>To send order updates and shipping notifications</li>
              <li>To improve our website and customer experience</li>
              <li>To send promotional emails (only if you opt in)</li>
              <li>To detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. We do not store your credit card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Third-Party Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell or rent your personal information to third parties. We may share your data with trusted service providers (e.g., payment processors, delivery partners) solely to fulfill your orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at <span className="font-medium text-gray-900">support@gtshop.in</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about this privacy policy, reach out to us at <span className="font-medium text-gray-900">support@gtshop.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
