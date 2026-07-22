"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";

export default function LoginSection() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  const inputClass =
    "w-full rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/25";

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fff8fb] px-4 py-6 lg:px-8 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl h-full max-h-[700px] grid overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-[0_24px_80px_rgba(198,161,207,0.22)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative hidden lg:block">
          <img
            src="/auth-kids-boutique.png"
            alt="Mirni kids and baby boutique collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-3xl bg-white/90 p-5 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary-hover)]">
              Mirni Collections
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-900">
              Soft outfits for tiny moments and bright little days.
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <img
                src="/MIRNI_logo.svg"
                alt="Mirni Collections"
                className="mb-6 h-16 w-16 rounded-2xl object-contain shadow-sm"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary-hover)]">
                Welcome back
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-950">
                Sign in to continue
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Keep shopping cozy kidswear, baby essentials, and pretty picks
                for every little celebration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email or Phone
                </label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com or 9876543210"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 transition-colors hover:text-[var(--brand-primary-hover)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-500">
                  {(error as any)?.response?.data?.msg || "Login failed"}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition hover:bg-[var(--brand-primary-hover)] disabled:opacity-50"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              New to Mirni?{" "}
              <Link
                href="/register"
                className="font-semibold text-[var(--brand-primary-hover)] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
