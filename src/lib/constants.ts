export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const ITEMS_PER_PAGE = 12;

export const STORAGE_KEYS = {
  TOKEN: "moovy_token",
  USER: "moovy_user",
  THEME: "moovy_theme",
} as const;

export const ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  MOVIE: "/movie/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  WATCHLIST: "/watchlist",
  WATCHED: "/watched",
  RATINGS: "/ratings",
  REVIEWS: "/reviews",
  PROFILE: "/profile",
  ADMIN: "/admin",
} as const;
