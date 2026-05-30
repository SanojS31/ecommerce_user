"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import {
  useGetOrderById,
  useCancelOrder,
  useSubmitPaymentProof,
  useGetPaymentDetails,
} from "@/hooks/useOrders";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

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

export default function OrderDetailSection() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { data, isLoading, error } = useGetOrderById(orderId);
  const { data: paymentData } = useGetPaymentDetails();
  const { mutate: cancel } = useCancelOrder();
  const { mutate: submitProof, isPending: submitting } = useSubmitPaymentProof();

  const [proofModal, setProofModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrNote, setUtrNote] = useState("");
  const [copied, setCopied] = useState("");

  const order = data?.order;
  const paymentDetails = paymentData?.paymentDetails;

  const cancellable = ["payment_pending", "payment_review", "created"];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSubmitProof = () => {
    if (!utrNumber.trim()) return;
    submitProof(
      { orderId, utrNumber: utrNumber.trim(), note: utrNote || undefined },
      { onSuccess: () => { setProofModal(false); setUtrNumber(""); setUtrNote(""); } }
    );
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white";

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-1/3" />
        <div className="h-40 bg-gray-100 rounded-xl" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    const errorMessage =
      (error as any)?.response?.data?.msg || "Order not found";

    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-mono text-gray-500">{order.orderId}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.orderStatus === "payment_pending" && (
            <button
              onClick={() => setProofModal(true)}
              className="px-3 py-1.5 bg-[var(--brand-primary)] text-white text-xs font-medium rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              Submit Payment Proof
            </button>
          )}
          {cancellable.includes(order.orderStatus) && (
            <button
              onClick={() => {
                cancel(order._id);
                router.push("/orders");
              }}
              className="px-3 py-1.5 text-xs text-red-400 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Payment Pending Banner */}
      {order.orderStatus === "payment_pending" && paymentDetails && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold text-yellow-800">
            ⚠ Payment Required
          </p>
          <p className="text-xs text-yellow-700">
            Please pay <strong>₹{order.totalAmount?.toLocaleString()}</strong>{" "}
            using the details below and submit your UTR / transaction number.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentDetails.qrCodeImage && (
              <div className="flex justify-center sm:justify-start">
                <img
                  src={paymentDetails.qrCodeImage}
                  alt="QR"
                  className="w-32 h-32 rounded-lg border border-yellow-200 object-contain bg-white"
                />
              </div>
            )}
            <div className="space-y-2">
              {[
                { label: "UPI ID", value: paymentDetails.upiId, key: "upi" },
                {
                  label: "Account No",
                  value: paymentDetails.accountNumber,
                  key: "acc",
                },
                { label: "IFSC", value: paymentDetails.ifscCode, key: "ifsc" },
              ].map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-yellow-100"
                >
                  <div>
                    <p className="text-xs text-yellow-600">{f.label}</p>
                    <p className="text-xs font-medium text-gray-900">
                      {f.value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(f.value, f.key)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    {copied === f.key ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setProofModal(true)}
            className="w-full py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            I've Paid — Submit UTR Number
          </button>
        </div>
      )}

      {/* Payment submitted banner */}
      {order.orderStatus === "payment_review" && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-800">
            ✓ Payment Proof Submitted
          </p>
          <p className="text-xs text-blue-600 mt-1">
            UTR: {order.paymentProof?.utrNumber} — Our team will verify and
            confirm your order within 24 hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Status</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              label={order.orderStatus.replace(/_/g, " ")}
              variant={getStatusVariant(order.orderStatus)}
            />
            <Badge
              label={order.paymentStatus.replace(/_/g, " ")}
              variant={getPaymentVariant(order.paymentStatus)}
            />
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-400">
              Payment:{" "}
              <span className="capitalize">{order.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">
            Delivery Address
          </p>
          <p className="text-sm font-medium text-gray-900">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {order.shippingAddress.addressLine}
          </p>
          <p className="text-xs text-gray-500">
            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
            {order.shippingAddress.pincode}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.shippingAddress.phone}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">
            Items ({order.items?.length})
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items?.map((item:any, i:any) => {
            const attrs = Object.entries(item.attributes || {})
              .filter(([_, v]) => v)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ");
            return (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  {attrs && (
                    <p className="text-xs text-gray-400 mt-0.5">{attrs}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Price Details
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>₹{order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span>
              {order.shippingCharge === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${order.shippingCharge}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span>₹{order.tax?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-4">
          Order Timeline
        </p>
        <div className="space-y-3">
          {[...order.statusHistory].reverse().map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    label={h.status.replace(/_/g, " ")}
                    variant={getStatusVariant(h.status)}
                  />
                  <span className="text-xs text-gray-400">
                    {new Date(h.updatedAt).toLocaleString("en-IN")}
                  </span>
                </div>
                {h.note && (
                  <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Payment Proof Modal */}
      <Modal
        isOpen={proofModal}
        onClose={() => setProofModal(false)}
        title="Submit Payment Proof"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Enter the UTR / transaction reference number from your payment
            app after completing the transfer.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              UTR / Transaction Number <span className="text-red-500">*</span>
            </label>
            <input
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. UTR123456789012"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Note (optional)
            </label>
            <input
              value={utrNote}
              onChange={(e) => setUtrNote(e.target.value)}
              placeholder="e.g. Paid via GPay"
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setProofModal(false)}
              className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitProof}
              disabled={submitting || !utrNumber.trim()}
              className="flex-1 py-2.5 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
