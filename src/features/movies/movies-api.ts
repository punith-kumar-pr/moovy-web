import api from "@/lib/axios";
import type { Movie, Genre } from "@/types";

export const moviesApi = {
  getAll: () =>
    api.get<Movie[]>("/movies").then((r) => r.data),

  getTopRated: () =>
    api.get<Movie[]>("/movies/top-rated").then((r) => r.data),

  searchByTitle: (title: string) =>
    api.get<Movie[]>(`/movies/${encodeURIComponent(title)}`).then((r) => r.data),

  getByGenre: (genre: string) =>
    api.get<Movie[]>("/movies/by-genre", { params: { genre } }).then((r) => r.data),

  getByGenres: (genres: string[]) =>
    api.get<Movie[]>("/movies/by-genres", {
      params: { genres },
      paramsSerializer: { indexes: null },
    }).then((r) => r.data),

  search: (query: string, genreName?: string) =>
    api.get<Movie[]>("/movies/search", {
      params: { query, ...(genreName ? { genreName } : {}) },
    }).then((r) => r.data),

  getGenres: () =>
    api.get<Genre[]>("/genres").then((r) => r.data),
};
