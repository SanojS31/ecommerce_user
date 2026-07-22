"use client";
import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Featured", href: "/products?featured=true" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
  ],
  Account: [
    { label: "My Orders", href: "/orders" },
    { label: "My Profile", href: "/profile" },
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
  ],
  Help: [
    { label: "Contact Us", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-16">
      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/MIRNI_logo.svg"
                alt="Mirni Collections"
                className="h-11 w-11 rounded-xl object-contain shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Mirni
                </p>
                <p className="text-[10px] text-[var(--brand-primary-hover)] font-semibold tracking-wider uppercase">
                  Collections
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Soft, joyful & sustainable clothing for your little ones. Every
              stitch crafted with love.
            </p>
            {/* Socials */}
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.instagram.com/mirni__collections/"
                target="_blank"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)] hover:bg-[var(--brand-primary)] hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)] hover:bg-[var(--brand-primary)] hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a> */}
              <a
                href="https://api.whatsapp.com/send/?phone=917449178774&text=Hi+Mirni+Collections%2C+I+need+help+with+shopping.&type=phone_number&app_absent=0"
                aria-label="WhatsApp"
                target="_blank"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary-hover)] hover:bg-[var(--brand-primary)] hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[var(--brand-primary-hover)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pink-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Mirni Collections. All rights reserved.
          </p>
          {/* <p className="text-xs text-gray-400 flex items-center gap-1">
            Made with <Heart size={11} className="fill-pink-400 text-pink-400" /> for tiny humans
          </p> */}
        </div>
      </div>
    </footer>
  );
}