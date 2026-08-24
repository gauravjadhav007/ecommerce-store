// Simple in-memory OTP store for development
// In production, use Redis or database

interface OtpEntry {
  code: string;
  expires: number;
}

const otpStore = new Map<string, OtpEntry>();

export function generateOtp(phone: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, {
    code,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
  console.log(`[OTP] ${phone} -> ${code}`);
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    otpStore.delete(phone);
    return false;
  }
  if (entry.code !== code) return false;
  otpStore.delete(phone);
  return true;
}
