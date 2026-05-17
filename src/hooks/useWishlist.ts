import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface WishlistProduct {
  _id: string;
  name: string;
  images: string[];
  basePrice: number;
  isActive: boolean;
  variants: {
    _id: string;
    attributes: Record<string, string>;
    stock: number;
    price: number;
    isActive: boolean;
  }[];
}

export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistProduct[];
}

async function getWishlist() {
  const res = await httpClient.get(userApiRoutes.wishlist.base);
  return res.data;
}

async function addToWishlist(productId: string) {
  const res = await httpClient.post(userApiRoutes.wishlist.add, { productId });
  return res.data;
}

async function removeFromWishlist(productId: string) {
  const res = await httpClient.delete(userApiRoutes.wishlist.remove(productId));
  return res.data;
}

async function clearWishlist() {
  const res = await httpClient.delete(userApiRoutes.wishlist.clear);
  return res.data;
}

export function useGetWishlist() {
  return useQuery({ queryKey: ["wishlist"], queryFn: getWishlist });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useClearWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}