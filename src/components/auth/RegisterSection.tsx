"use client";
import { useState } from "react";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { mutate: register, isPending, error, isSuccess } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Create account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Start shopping with us today
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-7">
          {isSuccess ? (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-green-600">
                Account created successfully!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Please{" "}
                <Link href="/login" className="text-gray-900 font-medium hover:underline">
                  login
                </Link>{" "}
                to continue
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500">
                  {(error as any)?.response?.data?.msg || "Registration failed"}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {!isSuccess && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gray-900 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}