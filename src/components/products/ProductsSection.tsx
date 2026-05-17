"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Image } from "lucide-react";
import { useGetProducts, Product, ProductFilters } from "@/hooks/useProducts";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const AGE_OPTIONS = [
  "0-3 months","3-6 months","6-12 months",
  "1-2 years","2-3 years","3-4 years",
  "4-5 years","5-6 years","6-7 years","7-8 years",
];
const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt", order: "desc" },
  { label: "Price: Low to High", value: "basePrice", order: "asc" },
  { label: "Price: High to Low", value: "basePrice", order: "desc" },
];

function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants?.filter(
    (v) => v.isActive && v.stock > 0
  );
  const minPrice = activeVariants?.length
    ? Math.min(...activeVariants.map((v) => v.price))
    : product.basePrice;
  const inStock = activeVariants?.length > 0;

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
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
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-400">
          {typeof product.category === "object" ? product.category.name : ""}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          ₹{minPrice?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default function ProductsSection() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filters: ProductFilters = {
    search: search || undefined,
    size: selectedSize || undefined,
    ageGroup: selectedAge || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 12,
  };

  const { data, isLoading } = useGetProducts(filters);
  const products: Product[] = data?.data?.products || [];
  const total: number = data?.data?.total || 0;
  const totalPages: number = data?.data?.totalPages || 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedSize("");
    setSelectedAge("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters =
    search || selectedSize || selectedAge || sortBy !== "createdAt";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Products</h1>
          {!isLoading && (
            <p className="text-xs text-gray-400 mt-0.5">{total} items</p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          <SlidersHorizontal size={12} />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2.5 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Size */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSize(selectedSize === s ? "" : s)
                    }
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      selectedSize === s
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Age Group
              </p>
              <select
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
              >
                <option value="">All ages</option>
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Sort by</p>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={`${opt.value}-${opt.order}`}
                    value={`${opt.value}-${opt.order}`}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-xl bg-gray-100" />
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">No products found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-xs text-gray-500 hover:text-gray-900 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}