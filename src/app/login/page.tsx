"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { AlertTriangle, Phone, KeyRound, ArrowLeft, UserPlus, MessageCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const isCartRedirect = callbackUrl === "/cart";
  const isCheckoutRedirect = callbackUrl === "/checkout";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      const phoneRes = await fetch("/api/user/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const phoneData = await phoneRes.json();
      setIsNewUser(!phoneData.exists);

      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setOtpCode(data.otp);
      setWhatsappUrl(data.whatsappUrl || "");
      setStep("otp");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      if (isNewUser) {
        setStep("register");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        phone,
        otpVerified: "true",
        redirect: false,
      });

      if (result?.error) {
        setError(`Login failed: ${result.error}`);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        phone,
        otpVerified: "true",
        redirect: false,
      });

      if (result?.error) {
        setError(`Login failed: ${result.error}`);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {callbackUrl !== "/" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {isCartRedirect && "Login to view your cart"}
              {isCheckoutRedirect && "Login to proceed with checkout"}
              {!isCartRedirect && !isCheckoutRedirect && "Login required to access this page"}
            </p>
            <p className="text-xs text-amber-600 mt-1">Please sign in to continue</p>
          </div>
        </div>
      )}

      <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">
        {step === "phone" && "Sign In"}
        {step === "otp" && "Enter OTP"}
        {step === "register" && "Complete Registration"}
      </h1>
      <p className="text-center text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
        {step === "phone" && "Enter your mobile number to get started"}
        {step === "otp" && `OTP sent to +91 ${phone}`}
        {step === "register" && "Enter your details to create account"}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
          {error}
        </div>
      )}

      {step === "phone" && (
        <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                placeholder="9876543210"
                maxLength={10}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] text-sm sm:text-base"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || phone.length !== 10}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          {/* WhatsApp OTP button */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp to Get OTP
            </a>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600">
              Tap the button above to open WhatsApp with your OTP, or check your messages
            </p>
            {otpCode && (
              <p className="text-xs text-blue-500 mt-2">
                Your OTP: <span className="font-mono font-bold text-blue-700">{otpCode}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                6-Digit OTP
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center text-lg tracking-[0.5em] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setOtpCode("");
                setWhatsappUrl("");
                setError("");
              }}
              className="w-full text-gray-500 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Change mobile number
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-blue-600 py-2 text-sm font-medium hover:underline"
            >
              Resend OTP
            </button>
          </form>
        </div>
      )}

      {step === "register" && (
        <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] text-sm"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
            Phone: +91 {phone}
          </div>

          <button
            type="submit"
            disabled={loading || !firstName.trim()}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Account..." : "Create Account & Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("otp");
              setError("");
            }}
            className="w-full text-gray-500 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to OTP
          </button>
        </form>
      )}

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="text-blue-600 font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
