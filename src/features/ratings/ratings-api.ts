import api from "@/lib/axios";
import type { RatingResponse } from "@/types";

export const ratingsApi = {
  getMyRatings: () =>
    api.get<RatingResponse[]>("/ratings").then((r) => r.data),

  getMovieRatings: (movieId: number) =>
    api.get<RatingResponse[]>(`/ratings/movie/${movieId}`).then((r) => r.data),

  rate: (movieId: number, rating: number) =>
    api.post<RatingResponse>("/ratings", { movieId, rating }).then((r) => r.data),

  update: (movieId: number, rating: number) =>
    api.put<RatingResponse>("/ratings", { movieId, rating }).then((r) => r.data),

  remove: (movieId: number) =>
    api.delete<string>(`/ratings/${movieId}`).then((r) => r.data),
};
