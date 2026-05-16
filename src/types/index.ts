// ── Auth ──
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

// ── User Profile ──
export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  mobile: string | null;
  dob: string | null;
  createdAt: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeContactRequest {
  email?: string;
  mobile?: string;
}

// ── Movies ──
export interface Genre {
  id: number;
  genreName: string;
}

export interface Person {
  personId: number;
  name: string;
  birthdate: string | null;
  nationality: string | null;
  profileImageUrl: string | null;
  biography: string | null;
}

export interface Cast {
  id: number;
  person: Person;
  characterName: string;
  order: number;
}

export interface Crew {
  id: number;
  person: Person;
  job: string;
  department: string;
}

export interface Movie {
  id: number;
  title: string;
  voteAverage: number;
  voteCount: number;
  summary: string;
  adult: boolean;
  imageUrl: string | null;
  releaseDate: string | null;
  runtime: number | null;
  tagline: string | null;
  trailerUrl: string | null;
  genres: Genre[];
  casts: Cast[];
  crews: Crew[];
}

// ── Ratings ──
export interface RatingRequest {
  movieId: number;
  rating: number;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  movieTitle: string;
  rating: number;
  ratingDate: string;
}

// ── Reviews ──
export interface ReviewRequest {
  movieId: number;
  reviewText: string;
}

export interface ReviewResponse {
  reviewId: number;
  movieId: number;
  movieTitle: string;
  username: string;
  reviewText: string;
  reviewDate: string;
}

// ── Watchlist / Watched ──
export interface WatchlistRequest {
  movieId: number;
}

export interface WatchlistResponse {
  id: number;
  userId: number;
  movieId: number;
}

export interface WatchedMoviesRequest {
  movieId: number;
}

export interface WatchedMoviesResponse {
  id: number;
  userId: number;
  movieId: number;
}
