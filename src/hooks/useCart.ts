import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface CartItem {
  product: { _id: string; name: string; images: string[]; isActive: boolean };
  variant: string | { _id: string };
  name: string;
  image: string;
  attributes: Record<string, string>;
  price: number;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

async function getCart() {
  const res = await httpClient.get(userApiRoutes.cart.base);
  return res.data;
}

async function addToCart(data: {
  productId: string;
  variantId: string;
  quantity: number;
}) {
  const res = await httpClient.post(userApiRoutes.cart.add, data);
  return res.data;
}

async function removeFromCart(variantId: string) {
  const res = await httpClient.delete(userApiRoutes.cart.remove(variantId));
  return res.data;
}

async function updateCartQuantity(data: {
  variantId: string;
  quantity: number;
}) {
  const res = await httpClient.put(userApiRoutes.cart.update, data);
  return res.data;
}

async function clearCart() {
  const res = await httpClient.delete(userApiRoutes.cart.clear);
  return res.data;
}

export function useGetCart(enabled = true) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartQuantity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}
