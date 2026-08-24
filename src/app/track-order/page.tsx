import TrackOrderForm from "./TrackOrderForm";

export const metadata = {
  title: "Track Order | GT Shop",
  description: "Track your GT Shop order status in real time.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 mb-8">Enter your order number to check the current status of your delivery.</p>

        <TrackOrderForm />

        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">How it works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Place your order", desc: "Complete checkout and receive a confirmation email with your order number." },
              { step: "2", title: "Enter your order number", desc: "Paste your order number (starts with GT-) above and click Track." },
              { step: "3", title: "View real-time status", desc: "See exactly where your order is — from processing to out for delivery." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-8">
          Having trouble? Contact us at <span className="text-gray-600 font-medium">support@gtshop.in</span>
        </p>
      </div>
    </div>
  );
}
