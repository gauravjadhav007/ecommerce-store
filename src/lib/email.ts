import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function sendOtpEmail(to: string, code: string) {
  return sendEmail(to, "Your OTP Code - GT Shop", `
    <div style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:20px;">
      <h2 style="color:#111;">GT Shop - OTP Verification</h2>
      <p>Your one-time password is:</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:20px;background:#f5f5f5;border-radius:8px;">${code}</div>
      <p style="color:#666;font-size:12px;">This OTP expires in 5 minutes. Do not share it with anyone.</p>
    </div>
  `);
}

export async function sendOrderConfirmation(to: string, orderNumber: string, items: {name:string;quantity:number;price:number}[], total: number) {
  const itemsHtml = items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(i.price/100).toFixed(0)}</td></tr>`).join("");
  return sendEmail(to, `Order Confirmed - ${orderNumber} | GT Shop`, `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
      <h2 style="color:#111;">Order Confirmed!</h2>
      <p>Thank you for your order. Your order number is <strong>${orderNumber}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead><tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;">Item</th><th style="padding:8px;text-align:center;">Qty</th><th style="padding:8px;text-align:right;">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;text-align:right;">Total: ₹${(total/100).toFixed(0)}</p>
      <p style="color:#666;">We'll send you shipping updates at this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <p style="color:#999;font-size:11px;">GT Shop - Quality Products at Honest Prices</p>
    </div>
  `);
}
