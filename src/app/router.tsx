import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { ProtectedRoute } from "@/components/protected-route";

import { HomePage } from "@/features/movies/home-page";
import { BrowsePage } from "@/features/movies/browse-page";
import { MovieDetailPage } from "@/features/movies/movie-detail-page";
import { LoginPage } from "@/features/auth/login-page";
import { RegisterPage } from "@/features/auth/register-page";
import { WatchlistPage } from "@/features/watchlist/watchlist-page";
import { WatchedPage } from "@/features/watched/watched-page";
import { RatingsPage } from "@/features/ratings/ratings-page";
import { ReviewsPage } from "@/features/reviews/reviews-page";
import { ProfilePage } from "@/features/profile/profile-page";
import { AdminPage } from "@/features/admin/admin-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "browse", element: <BrowsePage /> },
      { path: "movie/:id", element: <MovieDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "watchlist",
        element: <ProtectedRoute><WatchlistPage /></ProtectedRoute>,
      },
      {
        path: "watched",
        element: <ProtectedRoute><WatchedPage /></ProtectedRoute>,
      },
      {
        path: "ratings",
        element: <ProtectedRoute><RatingsPage /></ProtectedRoute>,
      },
      {
        path: "reviews",
        element: <ProtectedRoute><ReviewsPage /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "admin",
        element: <ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>,
      },
    ],
  },
]);
