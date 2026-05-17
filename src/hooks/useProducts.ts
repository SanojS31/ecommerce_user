import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface VariantAttributes {
  size?: string;
  ageGroup?: string;
  color?: string;
}

export interface Variant {
  _id: string;
  attributes: VariantAttributes;
  stock: number;
  price: number;
  sku?: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
  options: string[];
  variants: Variant[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  ageGroup?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

async function getProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.brand) params.set("brand", filters.brand);
  if (filters?.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters?.size) params.set("size", filters.size);
  if (filters?.ageGroup) params.set("ageGroup", filters.ageGroup);
  if (filters?.sortBy) params.set("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const res = await httpClient.get(
    `${userApiRoutes.product.getAll}?${params.toString()}`
  );
  return res.data;
}

async function getProductById(id: string) {
  const res = await httpClient.get(userApiRoutes.product.getById(id));
  return res.data;
}

async function getFeaturedProducts() {
  const res = await httpClient.get(userApiRoutes.product.featured);
  return res.data;
}

export function useGetProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useGetFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: getFeaturedProducts,
  });
}