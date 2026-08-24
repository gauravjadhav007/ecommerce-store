"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 md:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none"
      >
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="md:hidden text-gray-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      <div className={`${open ? "block" : "hidden"} md:block pb-4 md:pb-0`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="py-6 md:py-0 border-b border-gray-800 md:border-0 mb-6 md:mb-0">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white tracking-tight">
                GT<span className="text-blue-400">Shop</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Quality products at honest prices. Free delivery on orders above ₹499.
            </p>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop All" },
                { href: "/account", label: "My Account" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Policies */}
          <FooterSection title="Policies">
            <ul className="space-y-2.5">
              {[
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/return-policy", label: "Return Policy" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/tc", label: "Terms & Conditions" },
                { href: "/track-order", label: "Track Order" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Get in Touch */}
          <FooterSection title="Get in Touch">
            <ul className="space-y-2.5">
              <li className="text-gray-400 text-sm">support@gtshop.in</li>
              <li>
                <a href="/track-order" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Track Your Order
                </a>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; 2026 GT Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">We accept</span>
            <div className="flex gap-2">
              {["UPI", "VISA", "MC"].map((method) => (
                <span key={method} className="bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-1 rounded">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
