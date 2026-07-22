"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const loginHref = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";

  const { mutate: register, isPending, error, isSuccess } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: form.name,
      email: form.email || undefined,
      password: form.password,
      phone: form.phone,
    });
  };

  const inputClass =
    "w-full rounded-2xl border border-pink-100 bg-white/90 px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/25";

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fff8fb] px-4 py-6 lg:px-8 overflow-hidden">
      <div className="mx-auto grid h-full max-h-[750px] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-[0_24px_80px_rgba(198,161,207,0.22)] lg:grid-cols-2">
        {/* Left: image, exactly half width, half height */}
        <div className="relative hidden h-full lg:block">
          <img
            src="/auth-kids-boutique.png"
            alt="Mirni kids and baby boutique collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-3xl bg-white/90 p-5 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary-hover)]">
              Little Wardrobes
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-900">
              Baby-soft fabrics, cheerful colors, and outfits made for smiles.
            </h2>
          </div>
        </div>

        {/* Right: form, exactly half width, content vertically centered without overflow */}
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-3 flex flex-col items-center justify-center text-center">
              <img
                src="/MIRNI_logo.svg"
                alt="Mirni Collections"
                className="mb-1 h-14 w-14 rounded-2xl object-contain shadow-sm"
              />
              <h1 className="mt-1.5 text-lg font-semibold text-gray-950 sm:text-2xl">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                Save addresses, track orders, and discover fresh kids, baby,
                and girls collections.
              </p>
            </div>

            {isSuccess ? (
              <div className="rounded-3xl border border-green-100 bg-green-50 p-5 text-center">
                <p className="text-sm font-semibold text-green-700">
                  Account created successfully!
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Redirecting you...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="9876543210"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="Min. 8 characters"
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
                    {(error as any)?.response?.data?.msg ||
                      "Registration failed"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-2xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition hover:bg-[var(--brand-primary-hover)] disabled:opacity-50"
                >
                  {isPending ? "Creating account..." : "Create account"}
                </button>
              </form>
            )}

            {!isSuccess && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="font-semibold text-[var(--brand-primary-hover)] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}