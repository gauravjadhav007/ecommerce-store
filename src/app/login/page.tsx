"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { AlertTriangle, Mail, KeyRound, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const isCartRedirect = callbackUrl === "/cart";
  const isCheckoutRedirect = callbackUrl === "/checkout";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const checkRes = await fetch("/api/otp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });
      const data = await checkRes.json();

      if (!checkRes.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

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
        body: JSON.stringify({ phone: email, code: otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      const userCheck = await fetch("/api/user/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const userData = await userCheck.json();

      if (userData.exists) {
        const loginRes = await fetch("/api/auth/otp-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          setError(loginData.error || "Login failed");
          setLoading(false);
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } else {
        router.push(`/register?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
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
        {step === "email" && "Sign In"}
        {step === "otp" && "Enter OTP"}
      </h1>
      <p className="text-center text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
        {step === "email" && "Enter your email to get started"}
        {step === "otp" && `OTP sent to ${email}`}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px] text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-4">
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
                setStep("email");
                setOtp("");
                setError("");
              }}
              className="w-full text-gray-500 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Change email
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
