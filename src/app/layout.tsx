import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutShell from "@/components/LayoutShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GT Shop - Quality Products at Honest Prices",
    template: "%s | GT Shop",
  },
  description: "Curated products for modern living. Free delivery on orders above ₹499. Secure payments. Easy returns. Flat 20% OFF on Your First Order Use code: GTSHOP20",
  keywords: ["online shopping", "GT Shop", "buy online", "home products", "kitchen", "lifestyle"],
  authors: [{ name: "GT Shop" }],
  creator: "GT Shop",
  metadataBase: new URL("https://gtshoppingonline.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gtshoppingonline.in",
    siteName: "GT Shop",
    title: "GT Shop - Quality Products at Honest Prices",
    description: "Curated products for modern living. Free delivery on orders above ₹499. Secure payments. Easy returns.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GT Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GT Shop - Quality Products at Honest Prices",
    description: "Curated products for modern living. Free delivery on orders above ₹499.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
