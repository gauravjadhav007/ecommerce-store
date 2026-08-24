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
              <img src="/logo.png" alt="GT Shop" className="h-9 w-auto brightness-0 invert" />
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

          {/* Policies */}
          <FooterSection title="Policies">
            <ul className="space-y-2.5">
              {[
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/return-policy", label: "Return Policy" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/tc", label: "Terms & Conditions" },
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

        {/* Copyright & Social */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2026 GT Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
            <div className="flex items-center gap-2">
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
      </div>
    </footer>
  );
}
