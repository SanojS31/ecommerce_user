import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";

export interface Review {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface ReviewsData {
  reviews: Review[];
  average: number;
  count: number;
}

export interface SubmitReviewPayload {
  rating: number;
  title?: string;
  comment: string;
}

async function getReviews(productId: string): Promise<ReviewsData> {
  const res = await httpClient.get(userApiRoutes.review.getReviews(productId));
  return res.data;
}

async function submitReview(productId: string, payload: SubmitReviewPayload) {
  const res = await httpClient.post(
    userApiRoutes.review.submitReview(productId),
    payload
  );
  return res.data;
}

export function useGetReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  });
}

export function useSubmitReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) =>
      submitReview(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}
