import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  addresses: Address[];
  isBlocked: boolean;
  isVerified: boolean;
}

async function getProfile() {
  const res = await httpClient.get(userApiRoutes.profile.get);
  return res.data;
}

async function updateProfile(formData: FormData) {
  const res = await httpClient.put(
    userApiRoutes.profile.update,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function addAddress(address: Omit<Address, "_id" | "isDefault">) {
  const res = await httpClient.post(userApiRoutes.profile.addAddress, address);
  return res.data;
}

async function updateAddress({
  id,
  data,
}: {
  id: string;
  data: Partial<Address>;
}) {
  const res = await httpClient.put(
    userApiRoutes.profile.updateAddress(id),
    data
  );
  return res.data;
}

async function removeAddress(id: string) {
  const res = await httpClient.delete(
    userApiRoutes.profile.removeAddress(id)
  );
  return res.data;
}

async function setDefaultAddress(id: string) {
  const res = await httpClient.patch(userApiRoutes.profile.setDefault(id));
  return res.data;
}

export function useGetProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: getProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useRemoveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}