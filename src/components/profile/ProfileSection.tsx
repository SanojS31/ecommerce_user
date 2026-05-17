"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, User } from "lucide-react";
import {
  useGetProfile,
  useUpdateProfile,
  useAddAddress,
  useUpdateAddress,
  useRemoveAddress,
  useSetDefaultAddress,
  Address,
} from "@/hooks/useProfile";
import Modal from "@/components/ui/Modal";

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white";

const defaultAddressForm = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

export default function ProfileSection() {
  const { data, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending: updatingProfile } =
    useUpdateProfile();
  const { mutate: addAddress, isPending: addingAddress } = useAddAddress();
  const { mutate: updateAddress, isPending: updatingAddress } =
    useUpdateAddress();
  const { mutate: removeAddress } = useRemoveAddress();
  const { mutate: setDefault } = useSetDefaultAddress();

  const profile = data?.user;

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [addressModal, setAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (profileForm.name) fd.append("name", profileForm.name);
    if (profileForm.phone) fd.append("phone", profileForm.phone);
    if (profileImage) fd.append("profileImage", profileImage);
    updateProfile(fd, {
      onSuccess: () => {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      },
    });
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm(defaultAddressForm);
    setAddressModal(true);
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setAddressModal(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress(
        { id: editingAddress._id!, data: addressForm },
        { onSuccess: () => setAddressModal(false) }
      );
    } else {
      addAddress(addressForm, { onSuccess: () => setAddressModal(false) });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-100 rounded-xl" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-base font-semibold text-gray-900">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Personal Information
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfileImage(e.target.files?.[0] || null)
                }
                className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <input
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                value={profile?.email || ""}
                disabled
                className={inputClass + " opacity-50 cursor-not-allowed"}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={updatingProfile}
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {updatingProfile ? "Saving..." : "Save Changes"}
            </button>
            {profileSaved && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Check size={12} /> Saved
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Saved Addresses
          </h2>
          {(profile?.addresses?.length || 0) < 5 && (
            <button
              onClick={openAddAddress}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Plus size={12} /> Add new
            </button>
          )}
        </div>

        {profile?.addresses?.length === 0 ? (
          <button
            onClick={openAddAddress}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus size={20} />
            <span className="text-xs">Add your first address</span>
          </button>
        ) : (
          <div className="space-y-3">
            {profile?.addresses?.map((addr:any) => (
              <div
                key={addr._id}
                className="p-4 border border-gray-100 rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
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

                  <div className="flex items-center gap-2 ml-3">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr._id!)}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                        title="Set as default"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => removeAddress(addr._id!)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={addressModal}
        onClose={() => setAddressModal(false)}
        title={editingAddress ? "Edit Address" : "Add Address"}
        size="md"
      >
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={addressForm.fullName}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, fullName: e.target.value })
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
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address Line <span className="text-red-500">*</span>
              </label>
              <input
                value={addressForm.addressLine}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
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
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
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
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
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
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddressModal(false)}
              className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingAddress || updatingAddress}
              className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {addingAddress || updatingAddress
                ? "Saving..."
                : editingAddress
                ? "Update"
                : "Add Address"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}