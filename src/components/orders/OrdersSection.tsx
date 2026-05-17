"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useGetMyOrders, useCancelOrder, Order } from "@/hooks/useOrders";
import Badge from "@/components/ui/Badge";

function getStatusVariant(status: string) {
  const map: Record<string, any> = {
    confirmed: "success",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    payment_pending: "warning",
    payment_review: "warning",
    returned: "danger",
    created: "default",
  };
  return map[status] || "default";
}

function getPaymentVariant(status: string) {
  const map: Record<string, any> = {
    completed: "success",
    payment_submitted: "warning",
    pending: "default",
    failed: "danger",
  };
  return map[status] || "default";
}

export default function OrdersSection() {
  const { data, isLoading } = useGetMyOrders();
  const { mutate: cancel } = useCancelOrder();

  const orders: Order[] = data?.orders || [];

  const cancellable = ["payment_pending", "payment_review", "created"];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-xl border border-gray-100 p-5 h-24"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag
          size={40}
          className="text-gray-200 mx-auto mb-4"
        />
        <p className="text-sm font-medium text-gray-500">No orders yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Your orders will appear here
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">My Orders</h1>
        <p className="text-xs text-gray-400 mt-0.5">{orders.length} orders</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-mono text-gray-500">
                    {order.orderId}
                  </p>
                  <Badge
                    label={order.orderStatus.replace("_", " ")}
                    variant={getStatusVariant(order.orderStatus)}
                  />
                  <Badge
                    label={order.paymentStatus.replace("_", " ")}
                    variant={getPaymentVariant(order.paymentStatus)}
                  />
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 mt-3">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Payment pending alert */}
                {order.orderStatus === "payment_pending" && (
                  <p className="text-xs text-yellow-600 mt-2 font-medium">
                    ⚠ Payment pending — submit UTR to confirm order
                  </p>
                )}
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/orders/${order._id}`}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                >
                  View <ChevronRight size={14} />
                </Link>
                {cancellable.includes(order.orderStatus) && (
                  <button
                    onClick={() => cancel(order._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}