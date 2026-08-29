import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "GT Shop <noreply@gtshoppingonline.in>";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL] Sent to ${to} | id: ${result.data?.id}`);
    return result;
  } catch (err) {
    console.error(`[EMAIL] Failed to send to ${to}:`, err);
    throw err;
  }
}

export async function sendOtpEmail(to: string, code: string, purpose: "login" | "signup" = "login") {
  const actionText = purpose === "signup" ? "verify your GT Shop account" : "log in to your GT Shop account";
  const customerName = to.split("@")[0];
  const capitalName = customerName.charAt(0).toUpperCase() + customerName.slice(1);

  return sendEmail(to, `Your GT Shop verification code is ${code}`, `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e293b;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:2px;">GT SHOP</h1>
              <p style="margin:4px 0 0;font-size:10px;color:#94a3b8;letter-spacing:3px;text-transform:uppercase;">Quality products at honest prices</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:15px;color:#475569;">Hi ${capitalName},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                Welcome to <strong>GT Shop</strong>!<br><br>
                Use the verification code below to <strong>${actionText}</strong>:
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:28px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your OTP</p>
                    <p style="margin:0;font-size:42px;font-weight:bold;color:#1e293b;letter-spacing:12px;font-family:'Courier New',monospace;">${code}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#64748b;text-align:center;">
                This code is valid for <strong>10 minutes</strong>.
              </p>

              <!-- Security Note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background-color:#fefce8;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#92400e;font-weight:600;">🔒 For your security</p>
                    <ul style="margin:0;padding-left:18px;font-size:12px;color:#78716c;line-height:1.8;">
                      <li>Do not share this OTP with anyone.</li>
                      <li>GT Shop will never ask you for your OTP by phone, email, or WhatsApp.</li>
                      <li>If you did not request this code, you can safely ignore this email.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#475569;line-height:1.6;">
                Need help? Visit <a href="https://www.gtshoppingonline.in/" style="color:#2563eb;text-decoration:none;font-weight:600;">www.gtshoppingonline.in</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:13px;color:#475569;font-weight:600;">Happy Shopping! 🛍️</p>
              <p style="margin:0 0 2px;font-size:13px;color:#475569;">Team GT Shop</p>
              <p style="margin:0 0 12px;font-size:11px;color:#94a3b8;font-style:italic;">Quality products at honest prices.</p>
              <p style="margin:0;font-size:10px;color:#cbd5e1;">© 2026 GT Shop. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
    </body>
    </html>
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
