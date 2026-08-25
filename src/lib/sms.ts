export async function sendSmsOtp(phone: string, code: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[SMS OTP] ${phone} -> ${code}`);
    return true;
  }
  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        variables_values: code,
        route: "otp",
        numbers: phone,
      }),
    });
    const data = await res.json();
    return data.return === true;
  } catch (error) {
    console.error("[SMS] Send failed:", error);
    return false;
  }
}
