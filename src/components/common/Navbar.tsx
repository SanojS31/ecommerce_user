"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clearAuth } from "@/app/api/httpClient";
import { useGetCart } from "@/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { data: cartData } = useGetCart(isLoggedIn);
  const cartCount =
    cartData?.cart?.items?.reduce(
      (total: number, item: { quantity?: number }) =>
        total + (item.quantity || 0),
      0
    ) || 0;

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userAccessToken");
      const userData = localStorage.getItem("userData");
      setIsLoggedIn(!!token);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUserName(parsed?.name || "");
        } catch {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Products", path: "/products" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center"
            aria-label="Mirni Collections home"
          >
            <img
              src="/MIRNI_logo.svg"
              alt="Mirni Collections"
              className="h-10 w-10 rounded-lg object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? "text-[var(--brand-primary-hover)] font-medium"
                    : "text-gray-500 hover:text-[var(--brand-primary-hover)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            {isLoggedIn ? (
              <>
                <Link
                  href="/wishlist"
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
                >
                  <Heart size={18} />
                </Link>
                <Link
                  href="/cart"
                  className="relative rounded-xl p-2 text-gray-400 transition-colors hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
                  aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/orders"
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
                >
                  <ShoppingBag size={18} />
                </Link>
                <Link
                  href="/profile"
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-[var(--brand-primary-hover)]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-[var(--brand-primary)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 rounded-xl p-2 text-gray-400 hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)] md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-2 py-2 text-sm rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "text-[var(--brand-primary-hover)] font-medium bg-[var(--brand-primary-soft)]"
                    : "text-gray-500 hover:text-[var(--brand-primary-hover)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
