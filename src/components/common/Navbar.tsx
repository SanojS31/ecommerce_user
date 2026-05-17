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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userAccessToken");
    const userData = localStorage.getItem("userData");
    setIsLoggedIn(!!token);
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserName(parsed?.name || "");
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Products", path: "/products" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/home"
            className="text-base font-semibold text-gray-900 tracking-tight"
          >
            Store
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900"
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
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Heart size={18} />
                </Link>
                <Link
                  href="/cart"
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <ShoppingCart size={18} />
                </Link>
                <Link
                  href="/orders"
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <ShoppingBag size={18} />
                </Link>
                <Link
                  href="/profile"
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-700 ml-1"
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
                    ? "text-gray-900 font-medium bg-gray-50"
                    : "text-gray-500 hover:text-gray-900"
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