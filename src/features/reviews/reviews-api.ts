import api from "@/lib/axios";
import type { ReviewResponse } from "@/types";

export const reviewsApi = {
  getMyReviews: () =>
    api.get<ReviewResponse[]>("/reviews").then((r) => r.data),

  getMovieReviews: (movieId: number) =>
    api.get<ReviewResponse[]>(`/reviews/movie/${movieId}`).then((r) => r.data),

  create: (movieId: number, reviewText: string) =>
    api.post<ReviewResponse>("/reviews", { movieId, reviewText }).then((r) => r.data),

  update: (movieId: number, reviewText: string) =>
    api.put<ReviewResponse>("/reviews", { movieId, reviewText }).then((r) => r.data),

  remove: (movieId: number) =>
    api.delete<string>(`/reviews/${movieId}`).then((r) => r.data),
};
