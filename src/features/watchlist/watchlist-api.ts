import api from "@/lib/axios";
import type { Movie, WatchlistResponse } from "@/types";

export const watchlistApi = {
  getAll: () =>
    api.get<Movie[]>("/watchlist").then((r) => r.data),

  add: (movieId: number) =>
    api.post<WatchlistResponse>("/watchlist", { movieId }).then((r) => r.data),

  remove: (movieId: number) =>
    api.delete<string>(`/watchlist/${movieId}`).then((r) => r.data),
};
