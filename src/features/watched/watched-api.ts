import api from "@/lib/axios";
import type { Movie, WatchedMoviesResponse } from "@/types";

export const watchedApi = {
  getAll: () =>
    api.get<Movie[]>("/watched-movies").then((r) => r.data),

  add: (movieId: number) =>
    api.post<WatchedMoviesResponse>("/watched-movies", { movieId }).then((r) => r.data),

  remove: (movieId: number) =>
    api.delete<string>(`/watched-movies/${movieId}`).then((r) => r.data),
};
