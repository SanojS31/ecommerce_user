"use client";
import Link from "next/link";
import { useGetFeaturedProducts, Product } from "@/hooks/useProducts";
import { ArrowRight, Image } from "lucide-react";

function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants?.filter((v) => v.isActive && v.stock > 0);
  const minPrice = activeVariants?.length
    ? Math.min(...activeVariants.map((v) => v.price))
    : product.basePrice;

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={24} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {typeof product.category === "object"
            ? product.category.name
            : ""}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          ₹{minPrice?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default function HomeSection() {
  const { data, isLoading } = useGetFeaturedProducts();
  const featured: Product[] = data?.data?.products || [];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100 px-8 py-14 text-center">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          New Collection
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
          Comfortable Wear for<br />Every Moment
        </h1>
        <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">
          Explore our latest collection of maternity wear and kids clothing,
          designed for comfort and style.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Shop Now
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            No featured products yet
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}