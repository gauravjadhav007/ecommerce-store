# GT Shop — E-Commerce Store Project Guide

## Quick Facts
- **Project**: GT Shop — full-stack e-commerce website
- **Stack**: Next.js 16.3.1, Prisma 7.9.1, PostgreSQL (Neon), Tailwind CSS v4, Zustand
- **Production URL**: https://www.gtshoppingonline.in
- **GitHub**: https://github.com/gauravjadhav007/ecommerce-store.git
- **Vercel project**: `gauravjadhav561-8665s-projects/ecommerce-store`
- **DNS**: GoDaddy

## User Rules
- **NEVER deploy without asking first**
- **Always test before deploying**

## Tech Details
- **Database**: PostgreSQL on Neon (connection string in `DATABASE_URL` env var)
- **Auth**: NextAuth v4 (JWT strategy) + custom `jose` JWT for OTP/admin login
- **Email**: Resend API (key in `RESEND_API_KEY` env var), domain `gtshoppingonline.in` verified, sender `noreply@gtshoppingonline.in`
- **Payments**: Razorpay live (keys in `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` env vars)
- **SMS**: MSG91 — **demo mode**, SMS disabled (no GST/DLT)
- **Prisma output**: `../src/generated/prisma` (NOT default path)
- **OTP expiry**: 10 minutes

## Environment Variables (.env)
All secrets are in `.env` — NEVER hardcode or commit these values.
Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — App base URL (http://localhost:3000 for dev, https://www.gtshoppingonline.in for prod)
- `NEXTAUTH_SECRET` — Secret for NextAuth JWT signing
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay credentials
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay client-side key
- `RESEND_API_KEY` — Resend email API key
- `MSG91_AUTH_KEY` — MSG91 SMS API key

## Database Models (Prisma)
| Model | Key Fields | Notes |
|-------|-----------|-------|
| User | id, name, firstName, lastName, gender, dob, email (unique), phone (unique), password, image, role (CUSTOMER/ADMIN) | |
| Product | id, name, slug (unique), description, price, compareAt, images (JSON string), sku, stock, isActive, featured, isDigital, downloadUrl, categoryId | |
| Variant | id, name, price, stock, sku (unique), productId | Cascade delete with Product |
| Category | id, name (unique), slug (unique), image | |
| Order | id, orderNumber (unique), status (PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED), total, shippingName, shippingEmail, shippingPhone, shippingAddr, paymentIntent, paidAt, userId | NO cascade delete on User |
| OrderItem | id, name, price, quantity, image, isDigital, downloaded, productId, orderId | Cascade delete with Order |
| Review | id, rating, comment, userId, productId | Unique [userId, productId], cascade delete with both |
| Coupon | id, code (unique), discountType, value, minOrder, maxUses, usedCount, expiresAt, isActive | |
| Otp | id, phone, code, expires | Indexed on phone |
| StoreSettings | id, key (unique), value | |

## File Structure

### Pages (src/app/)
```
Customer Pages:
  page.tsx                          — Homepage
  products/page.tsx                 — Product listing
  products/[slug]/page.tsx          — Product detail
  cart/page.tsx                     — Shopping cart (protected)
  checkout/page.tsx                 — Physical checkout (protected)
  checkout/digital/page.tsx         — Digital checkout
  order-confirmed/page.tsx          — Order success
  login/page.tsx                    — Email OTP login
  register/page.tsx                 — Email OTP signup (accepts ?email= param)
  account/page.tsx                  — Account dashboard
  account/orders/page.tsx           — Order history
  account/orders/[orderNumber]/invoice/page.tsx — Invoice
  account/address/page.tsx          — Address management
  account/returns/page.tsx          — Returns
  wishlist/page.tsx                 — Wishlist
  track-order/page.tsx              — Order tracking
  digital-products/page.tsx         — Digital products listing
  digital-products/starter-kit/page.tsx — Starter kit page
  download/[orderNumber]/page.tsx   — Digital download
  privacy-policy, shipping-policy, return-policy, tc — Policy pages

Admin Pages:
  admin/login/page.tsx              — Admin login
  admin/page.tsx                    — Admin dashboard
  admin/orders/page.tsx             — Orders CRUD (edit shipping, delete)
  admin/products/page.tsx           — Products CRUD
  admin/inventory/page.tsx          — Inventory CRUD (edit modal, stock +/-)
  admin/users/page.tsx              — Users list + delete (FK constraint handling)
  admin/categories/page.tsx         — Categories CRUD
  admin/coupons/page.tsx            — Coupons CRUD
```

### API Routes (src/app/api/)
```
Auth:
  auth/[...nextauth]/route.ts       — NextAuth handler (GET/POST)
  auth/otp-login/route.ts           — OTP login → jose JWT → set cookie
  auth/admin-login/route.ts         — Admin login → jose JWT → set cookie

OTP:
  otp/send/route.ts                 — Send OTP (phone via MSG91)
  otp/email/route.ts                — Send OTP (email via Resend)
  otp/verify/route.ts               — Verify OTP code

User:
  register/route.ts                 — Register user (name, email, phone, password)
  user/register/route.ts            — Another register endpoint
  user/profile/route.ts             — User profile CRUD
  user/check-phone/route.ts         — Check email/phone existence

Products:
  products/route.ts                 — GET products list

Orders:
  orders/route.ts                   — GET/POST orders
  orders/[orderNumber]/route.ts     — GET single order
  orders/[orderNumber]/invoice/     — GET invoice PDF
  orders/digital/route.ts           — Digital orders

Admin:
  admin/route.ts                    — Admin stats/dashboard
  admin/orders/route.ts             — GET/PUT/DELETE orders
  admin/products/route.ts           — GET/PUT/DELETE products
  admin/inventory/route.ts          — GET/PUT/DELETE inventory
  admin/users/route.ts              — GET/PUT/DELETE users
  admin/categories/route.ts         — GET/POST/PUT/DELETE categories
  admin/coupons/route.ts            — GET/POST/PUT/DELETE coupons

Payments:
  razorpay/order/route.ts           — Create Razorpay order
  razorpay/verify/route.ts          — Verify payment

Other:
  coupons/validate/route.ts         — Validate coupon code
  reviews/route.ts                  — GET/POST reviews
  downloads/[orderNumber]/route.ts  — Digital downloads
```

### Lib (src/lib/)
```
auth.ts              — NextAuth config (authOptions, CredentialsProvider, JWT callbacks)
session.ts           — getSessionUser(), decodeToken() — reads cookies, decodes JWT/base64
prisma.ts            — Prisma client singleton
otp.ts               — createOtp(), generateOtp(), verifyOtp() — 10 min expiry
email.ts             — sendEmail() via Resend, sendOtpEmail(to, code, purpose), sendOrderConfirmation()
sms.ts               — MSG91 SMS (demo mode, not working)
razorpay.ts          — Razorpay client
coupons.ts           — Coupon validation logic
utils.ts             — Utility functions
whatsapp.ts          — WhatsApp integration
```

### Components (src/components/)
```
Header.tsx           — Mobile hamburger menu, profile dropdown (touch events)
Footer.tsx           — Site footer
LayoutShell.tsx      — Layout wrapper
Providers.tsx        — SessionProvider wrapper (client component)
ProductCard.tsx      — Product card (physical)
FeaturedProductCard.tsx — Featured product card
ProductGallery.tsx   — Image gallery
ReviewSection.tsx    — Reviews display + form
Logo.tsx             — Logo component
GoogleAnalytics.tsx  — GA tracking
```

## Auth Flow (CRITICAL)

### How Auth Works
1. **Login**: User enters email → POST `/api/otp/email` (sends OTP via Resend) → verify OTP at `/api/otp/verify` → POST `/api/auth/otp-login` → creates `jose` JWT → sets `next-auth.session-token` cookie
2. **Register**: User enters email → OTP → verify → POST `/api/register` (creates user) → auto-login via otp-login
3. **Admin Login**: Email + password → POST `/api/auth/admin-login` → validates bcrypt password + ADMIN role → creates `jose` JWT → sets cookie
4. **Middleware**: Reads `next-auth.session-token` or `__Secure-next-auth.session-token`, decodes JWT payload, checks role for admin routes

### JWT Structure (jose SignJWT)
```js
{
  sub: user.id,        // Required for NextAuth JWT callback
  id: user.id,
  role: user.role,     // CUSTOMER or ADMIN
  phone, firstName, lastName, gender, dob,
  name: user.name,
  email: user.email,
  picture: user.image,
}
```

### Cookie Names
- `next-auth.session-token` (secure: false, for localhost)
- `__Secure-next-auth.session-token` (secure: true, for production)

### Session Token Decode (src/lib/session.ts)
`getSessionUser(req)` reads cookie, supports both base64url and JWT `payload.split(".")[1]` decode. Checks for `id` and `role` fields.

## Active Issues

### useSession() Returns `{}` (HIGH PRIORITY)
- **Problem**: `/api/auth/session` returns empty object `{}` even though `jose` JWT is set in cookie
- **Root Cause**: NextAuth's session endpoint can't decode `jose`-signed JWT because we bypassed NextAuth's signIn and set cookie directly
- **Fix Applied**: Added `jwt.decode` function in `authOptions` using `jose.jwtVerify` to explicitly decode our tokens, plus `secret: process.env.NEXTAUTH_SECRET`
- **Still needed**: Set `NEXTAUTH_URL=https://www.gtshoppingonline.in` in Vercel production env vars (currently `http://localhost:3000` in `.env` for local dev)
- **Impact**: `useSession()` returns `{ session: null }` → account pages show blank → header profile dropdown shows nothing
- **Account pages check**: `if (!session) return null;` → renders blank

### NEXTAUTH_URL Mismatch
- `.env` has `NEXTAUTH_URL="http://localhost:3000"` — this may need to be `https://www.gtshoppingonline.in` in Vercel production env

## API Test Results
- 26/26 tests passed (admin CRUD + customer auth + public APIs + security)
- Admin delete user handles FK constraints (orders/reviews prevent deletion)
- OTP expiry: 10 minutes
- Email OTP via Resend works reliably

## Build Commands
```bash
npm run dev        # Local dev
npm run build      # prisma generate && next build
npm run start      # Production start
npm run lint       # ESLint
```

## Git
- Branch: `main`
- All code pushed to GitHub
- Commit before pushing: run `npm run build` to verify
