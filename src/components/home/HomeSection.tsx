"use client";

import Link from "next/link";
import { useGetFeaturedProducts, Product } from "@/hooks/useProducts";
import { ArrowRight, Image, Sparkles } from "lucide-react";

function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants?.filter(
    (v) => v.isActive && v.stock > 0
  );
  const minPrice = activeVariants?.length
    ? Math.min(...activeVariants.map((v) => v.price))
    : product.basePrice;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/80">
        <div className="aspect-square overflow-hidden rounded-2xl bg-[#fff8fb]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Image size={24} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="px-2 pb-2 pt-3">
          <p className="truncate text-sm font-semibold text-gray-950">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {typeof product.category === "object"
              ? product.category.name
              : "Kids collection"}
          </p>
          <p className="mt-2 text-base font-bold text-[var(--brand-primary-hover)]">
            Rs {minPrice?.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function HomeSection() {
  const { data, isLoading } = useGetFeaturedProducts();
  const featured: Product[] = data?.data?.products || [];
  const categories = ["Baby wear", "Girls dresses", "Kids cotton", "Accessories"];

  return (
    <div className="space-y-12">
      <section className="grid overflow-hidden rounded-[2rem] border border-pink-100 bg-[#fff8fb] shadow-[0_24px_80px_rgba(198,161,207,0.18)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary-hover)] shadow-sm">
            <Sparkles size={14} />
            New little styles
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
            Pretty, comfy outfits for babies and bright little girls.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
            Discover soft cotton sets, cute dresses, cozy baby essentials, and
            everyday kidswear selected for comfort, color, and happy movement.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/70 transition hover:bg-[var(--brand-primary-hover)]"
            >
              Shop Collection
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-2xl border border-pink-100 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
            >
              View Products
            </Link>
          </div>
        </div>
        <div className="relative min-h-[360px] lg:min-h-[520px]">
          <img
            src="/auth-kids-boutique.png"
            alt="Kids and baby boutique collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-gray-950">
              Soft shades, gentle fabrics, ready for every little occasion.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category}
            href="/products"
            className="rounded-3xl border border-pink-100 bg-white px-4 py-5 text-center text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] hover:shadow-md"
          >
            {category}
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary-hover)]">
              Handpicked
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-950">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 rounded-full bg-[var(--brand-primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--brand-primary-hover)] transition hover:bg-[var(--brand-primary)] hover:text-white"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-white p-2">
                <div className="aspect-square rounded-2xl bg-pink-50" />
                <div className="mt-3 space-y-2 px-2 pb-3">
                  <div className="h-3 rounded bg-pink-50" />
                  <div className="h-3 w-1/2 rounded bg-pink-50" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-3xl border border-pink-100 bg-white py-14 text-center text-sm text-gray-400">
            No featured products yet
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
