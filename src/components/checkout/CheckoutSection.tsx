"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapPin, Copy, CheckCircle } from "lucide-react";
import { useAddAddress, useGetProfile, Address } from "@/hooks/useProfile";
import { useGetCart } from "@/hooks/useCart";
import { useCreateOrder, useGetPaymentDetails } from "@/hooks/useOrders";
import Modal from "@/components/ui/Modal";

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white";

const defaultAddressForm = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutSection() {
  const router = useRouter();
  const { data: profileData } = useGetProfile();
  const { data: cartData } = useGetCart();
  const { data: paymentData } = useGetPaymentDetails();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutate: addAddress, isPending: addingAddress } = useAddAddress();

  const profile = profileData?.user;
  const cart = cartData?.cart;
  const paymentDetails = paymentData?.paymentDetails;

  const addresses: Address[] = profile?.addresses || [];
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState(defaultAddressForm);
  const [copied, setCopied] = useState("");

  const activeAddress = selectedAddress || defaultAddr;

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal >= 999 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addressToSave = { ...newAddress };

    addAddress(addressToSave, {
      onSuccess: (data) => {
        const savedAddresses: Address[] = data?.user?.addresses || [];
        const savedAddress = savedAddresses[savedAddresses.length - 1];

        if (savedAddress) {
          setSelectedAddress(savedAddress);
        }

        setNewAddress(defaultAddressForm);
        setAddModalOpen(false);
      },
    });
  };

  const handlePlaceOrder = () => {
    if (!activeAddress) return;
    createOrder(
      {
        shippingAddress: {
          fullName: activeAddress.fullName,
          phone: activeAddress.phone,
          addressLine: activeAddress.addressLine,
          city: activeAddress.city,
          state: activeAddress.state,
          pincode: activeAddress.pincode,
          isDefault: activeAddress.isDefault,
        },
        paymentMethod,
      },
      {
        onSuccess: (data) => {
          router.push(`/orders/${data.order._id}`);
        },
      }
    );
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-400">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-base font-semibold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Address + Payment */}
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Delivery Address
              </h2>
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Plus size={12} /> Add new
              </button>
            </div>

            {addresses.length === 0 ? (
              <button
                onClick={() => setAddModalOpen(true)}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                <MapPin size={20} />
                <span className="text-xs">Add a delivery address</span>
              </button>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <button
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      (selectedAddress?._id || defaultAddr?._id) === addr._id
                        ? "border-[var(--brand-primary)] bg-gray-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {addr.fullName}
                          </p>
                          {addr.isDefault && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {addr.phone}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                          (selectedAddress?._id || defaultAddr?._id) ===
                          addr._id
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="space-y-2">
              {[
                { value: "upi", label: "UPI / QR Code" },
                { value: "bank_transfer", label: "Bank Transfer" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-colors ${
                    paymentMethod === method.value
                      ? "border-[var(--brand-primary)] bg-gray-50"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm text-gray-700">{method.label}</span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      paymentMethod === method.value
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]"
                        : "border-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Payment Details */}
            {paymentDetails && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Payment Details
                </p>

                {paymentMethod === "upi" && (
                  <div className="space-y-3">
                    {paymentDetails.qrCodeImage && (
                      <div className="flex justify-center">
                        <img
                          src={paymentDetails.qrCodeImage}
                          alt="QR Code"
                          className="w-36 h-36 rounded-lg border border-gray-200 object-contain bg-white"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">UPI ID</p>
                        <p className="text-sm font-medium text-gray-900">
                          {paymentDetails.upiId}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(paymentDetails.upiId, "upi")
                        }
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {copied === "upi" ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Pay <strong>₹{total.toLocaleString()}</strong> to{" "}
                      {paymentDetails.upiName} and submit UTR number after
                      placing order
                    </p>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-2">
                    {[
                      {
                        label: "Bank Name",
                        value: paymentDetails.bankName,
                        key: "bank",
                      },
                      {
                        label: "Account Holder",
                        value: paymentDetails.accountHolderName,
                        key: "holder",
                      },
                      {
                        label: "Account Number",
                        value: paymentDetails.accountNumber,
                        key: "acc",
                      },
                      {
                        label: "IFSC Code",
                        value: paymentDetails.ifscCode,
                        key: "ifsc",
                      },
                    ].map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <div>
                          <p className="text-xs text-gray-400">
                            {field.label}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {field.value}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(field.value, field.key)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {copied === field.key ? (
                            <CheckCircle
                              size={16}
                              className="text-green-500"
                            />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 text-center pt-1">
                      Transfer <strong>₹{total.toLocaleString()}</strong> and
                      submit UTR after placing order
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto">
              {cart.items?.map((item: any, i: number) => {
                const attrs = Object.entries(item.attributes || {})
                  .filter(([_, v]) => v)
                  .map(([_, v]) => v)
                  .join(" / ");
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      {attrs && (
                        <p className="text-xs text-gray-400">{attrs}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (5%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPending || !activeAddress}
              className="w-full py-3 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Placing Order..." : "Place Order"}
            </button>

            {!activeAddress && (
              <p className="text-xs text-red-500 text-center">
                Please add a delivery address
              </p>
            )}

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              After placing, you'll need to make the payment and submit the
              UTR number for order confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Address"
        size="md"
      >
        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.addressLine}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    addressLine: e.target.value,
                  })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingAddress}
              className="flex-1 py-2.5 bg-[var(--brand-primary)] text-white text-sm rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              {addingAddress ? "Saving..." : "Use This Address"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
