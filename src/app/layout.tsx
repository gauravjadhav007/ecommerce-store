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
    default: "GT SHOP - Quality Products at Honest Prices",
    template: "%s | GT SHOP",
  },
  description: "Shop quality clothing, electronics, accessories, footwear and home products at GT SHOP. Great prices, secure checkout, free delivery above ₹499 and easy 7-day returns.",
  keywords: ["online shopping", "GT SHOP", "buy online", "home products", "kitchen", "lifestyle", "clothing", "electronics"],
  authors: [{ name: "GT SHOP" }],
  creator: "GT SHOP",
  metadataBase: new URL("https://gtshoppingonline.in"),
  alternates: {
    canonical: "https://gtshoppingonline.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gtshoppingonline.in",
    siteName: "GT SHOP",
    title: "GT SHOP - Quality Products at Honest Prices",
    description: "Quality products at honest prices. Free delivery on orders above ₹499.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GT SHOP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GT SHOP - Quality Products at Honest Prices",
    description: "Quality products at honest prices. Free delivery on orders above ₹499.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "512x512" },
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://gtshoppingonline.in" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GT SHOP",
              "alternateName": ["GT SHOP", "GT SHOPping Online", "GT Dhop Online"],
              "url": "https://gtshoppingonline.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://gtshoppingonline.in/products?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://gtshoppingonline.in/#organization",
              "name": "GT SHOP",
              "url": "https://gtshoppingonline.in",
              "logo": {
                "@type": "ImageObject",
                "url": "https://gtshoppingonline.in/logo.png",
                "width": 1200,
                "height": 630
              },
              "description": "Curated products for modern living. Free delivery on orders above ₹499."
            }),
          }}
        />
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
