"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Image } from "lucide-react";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
  WishlistProduct,
} from "@/hooks/useWishlist";

export default function WishlistSection() {
  const { data, isLoading } = useGetWishlist();
  const { mutate: remove } = useRemoveFromWishlist();
  const { mutate: clear } = useClearWishlist();

  const products: WishlistProduct[] =
    data?.wishlist?.products?.filter(Boolean) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-xl bg-gray-100" />
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart size={40} className="text-gray-200 mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-500">
          Your wishlist is empty
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Save items you love for later
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Wishlist</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {products.length} items saved
          </p>
        </div>
        <button
          onClick={() => clear()}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const activeVariants = product.variants?.filter(
            (v) => v.isActive && v.stock > 0
          );
          const minPrice = activeVariants?.length
            ? Math.min(...activeVariants.map((v) => v.price))
            : product.basePrice;
          const inStock = activeVariants?.length > 0;

          return (
            <div key={product._id} className="group relative">
              {/* Remove button */}
              <button
                onClick={() => remove(product._id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>

              <Link href={`/products/${product._id}`}>
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
              </Link>

              <div className="mt-3">
                <Link href={`/products/${product._id}`}>
                  <p className="text-sm font-medium text-gray-900 truncate hover:text-gray-700">
                    {product.name}
                  </p>
                </Link>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  ₹{minPrice?.toLocaleString()}
                </p>

                {inStock && (
                  <Link
                    href={`/products/${product._id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingCart size={12} />
                    Add to Cart
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}