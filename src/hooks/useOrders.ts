import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface OrderItem {
  product: string;
  variant: string;
  name: string;
  image: string;
  attributes: Record<string, string>;
  price: number;
  quantity: number;
}

export interface StatusHistory {
  status: string;
  updatedAt: string;
  note?: string;
}

export interface PaymentProof {
  utrNumber: string;
  note?: string;
  submittedAt: string;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentProof?: PaymentProof;
  orderStatus: string;
  statusHistory: StatusHistory[];
  createdAt: string;
}

export interface PaymentDetails {
  upiId: string;
  upiName: string;
  qrCodeImage: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

async function createOrder(data: {
  shippingAddress: any;
  paymentMethod: string;
}) {
  const res = await httpClient.post(userApiRoutes.order.create, data);
  return res.data;
}

async function getMyOrders() {
  const res = await httpClient.get(userApiRoutes.order.getAll);
  return res.data;
}

async function getOrderById(id: string) {
  const res = await httpClient.get(userApiRoutes.order.getById(id));
  return res.data;
}

async function cancelOrder(id: string) {
  const res = await httpClient.patch(userApiRoutes.order.cancel(id));
  return res.data;
}

async function submitPaymentProof(data: {
  orderId: string;
  utrNumber: string;
  note?: string;
}) {
  const res = await httpClient.post(
    userApiRoutes.order.submitPaymentProof(data.orderId),
    { utrNumber: data.utrNumber, note: data.note }
  );
  return res.data;
}

async function getPaymentDetails() {
  const res = await httpClient.get(userApiRoutes.order.paymentDetails);
  return res.data;
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useGetMyOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: getMyOrders });
}

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useSubmitPaymentProof() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitPaymentProof,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orders", vars.orderId] });
    },
  });
}

export function useGetPaymentDetails() {
  return useQuery({
    queryKey: ["payment-details"],
    queryFn: getPaymentDetails,
  });
}