"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Image } from "lucide-react";
import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
  useClearCart,
  CartItem,
} from "@/hooks/useCart";

export default function CartSection() {
  const { data, isLoading } = useGetCart();
  const { mutate: remove } = useRemoveFromCart();
  const { mutate: updateQty } = useUpdateCartQuantity();
  const { mutate: clear } = useClearCart();

  const cart = data?.cart;
  const items: CartItem[] = cart?.items || [];

  const getVariantId = (item: CartItem) => {
    if (!item.variant) return "";
    return typeof item.variant === "string" ? item.variant : item.variant._id;
  };

  const handleQtyChange = (variantId: string, current: number, delta: number) => {
    const newQty = current + delta;
    if (newQty < 1) return;
    updateQty({ variantId, quantity: newQty });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={40} className="text-gray-200 mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
        <p className="text-xs text-gray-400 mt-1">
          Add items to get started
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 px-5 py-2.5 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Items */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base font-semibold text-gray-900">
            Cart ({items.length})
          </h1>
          <button
            onClick={() => clear()}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        {items.map((item, i) => {
          const variantId = getVariantId(item);
          const attrs = Object.entries(item.attributes || {})
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ");

          return (
            <div
              key={`${variantId}-${i}`}
              className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100"
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={16} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                {attrs && (
                  <p className="text-xs text-gray-400 mt-0.5">{attrs}</p>
                )}
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ₹{item.price?.toLocaleString()}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQtyChange(
                          variantId,
                          item.quantity,
                          -1
                        )
                      }
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium text-gray-900 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(
                          variantId,
                          item.quantity,
                          1
                        )
                      }
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Total + Remove */}
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(item.price * item.quantity)?.toLocaleString()}
                    </p>
                    <button
                      onClick={() => remove(variantId)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Subtotal ({items.length} items)
              </span>
              <span className="text-gray-900">
                ₹{cart?.totalPrice?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-600">
                {cart?.totalPrice >= 999 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  "₹50"
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (5%)</span>
              <span className="text-gray-600">
                ₹{Math.round((cart?.totalPrice || 0) * 0.05).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2.5 flex justify-between text-sm font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                ₹
                {(
                  (cart?.totalPrice || 0) +
                  (cart?.totalPrice >= 999 ? 0 : 50) +
                  Math.round((cart?.totalPrice || 0) * 0.05)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* {cart?.totalPrice < 999 && (
            <p className="text-xs text-gray-400 mt-3">
              Add ₹{(999 - (cart?.totalPrice || 0)).toLocaleString()} more
              for free shipping
            </p>
          )} */}

          <Link
            href="/checkout"
            className="mt-5 w-full flex items-center justify-center py-3 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/products"
            className="mt-2 w-full flex items-center justify-center py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
