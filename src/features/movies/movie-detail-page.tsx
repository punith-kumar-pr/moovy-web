import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, Bookmark, BookmarkCheck, Eye, EyeOff, Star, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { RatingDisplay } from "@/components/rating-stars";
import { moviesApi } from "@/features/movies/movies-api";
import { watchlistApi } from "@/features/watchlist/watchlist-api";
import { watchedApi } from "@/features/watched/watched-api";
import { reviewsApi } from "@/features/reviews/reviews-api";
import { useAuthStore } from "@/features/auth/auth-store";
import { formatDate, formatRuntime, getImageUrl, getProfileImageUrl } from "@/lib/utils";
import type { Movie } from "@/types";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();

  const { data: allMovies, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: moviesApi.getAll,
  });

  const movie = allMovies?.find((m) => m.id === Number(id));

  const { data: watchlist } = useQuery({
    queryKey: ["watchlist"],
    queryFn: watchlistApi.getAll,
    enabled: isAuthenticated,
  });

  const { data: watched } = useQuery({
    queryKey: ["watched"],
    queryFn: watchedApi.getAll,
    enabled: isAuthenticated,
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", "movie", Number(id)],
    queryFn: () => reviewsApi.getMovieReviews(Number(id)),
    enabled: !!id,
  });

  const isInWatchlist = watchlist?.some((m) => m.id === Number(id));
  const isWatched = watched?.some((m) => m.id === Number(id));

  const watchlistMutation = useMutation({
    mutationFn: () => isInWatchlist ? watchlistApi.remove(Number(id)) : watchlistApi.add(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success(isInWatchlist ? "Removed from watchlist" : "Added to watchlist");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const watchedMutation = useMutation({
    mutationFn: () => isWatched ? watchedApi.remove(Number(id)) : watchedApi.add(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watched"] });
      toast.success(isWatched ? "Removed from watched" : "Marked as watched");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  if (isLoading) return <MovieDetailSkeleton />;
  if (!movie) return <div className="container py-20 text-center"><h2 className="text-2xl font-bold">Movie not found</h2></div>;

  const director = movie.crews?.find((c) => c.job === "Director");

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="absolute inset-0 h-[500px] overflow-hidden">
        <img src={getImageUrl(movie.imageUrl)} alt="" className="w-full h-full object-cover opacity-20 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      </div>

      <div className="container relative z-10 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-64 md:w-72 rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
              <img src={getImageUrl(movie.imageUrl)} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && <p className="text-muted-foreground italic text-lg">"{movie.tagline}"</p>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <RatingDisplay rating={movie.voteAverage} count={movie.voteCount} />
              {movie.releaseDate && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(movie.releaseDate)}</span>}
              {movie.runtime && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatRuntime(movie.runtime)}</span>}
              {movie.adult && <Badge variant="destructive">18+</Badge>}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => <Badge key={g.id} variant="secondary">{g.genreName}</Badge>)}
            </div>

            {movie.summary && <p className="text-muted-foreground leading-relaxed max-w-2xl">{movie.summary}</p>}
            {director && <p className="text-sm"><span className="text-muted-foreground">Directed by</span> <span className="font-medium">{director.person.name}</span></p>}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2"><Play className="h-4 w-4" /> Watch Trailer <ExternalLink className="h-3 w-3" /></Button>
                </a>
              )}
              {isAuthenticated && (
                <>
                  <Button variant={isInWatchlist ? "secondary" : "outline"} className="gap-2" onClick={() => watchlistMutation.mutate()} disabled={watchlistMutation.isPending}>
                    {isInWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Button variant={isWatched ? "secondary" : "outline"} className="gap-2" onClick={() => watchedMutation.mutate()} disabled={watchedMutation.isPending}>
                    {isWatched ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isWatched ? "Watched" : "Mark Watched"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Cast */}
        {movie.casts?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.casts.slice(0, 12).map((c) => (
                <div key={c.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-border group-hover:border-primary transition-colors">
                    <img src={getProfileImageUrl(c.person.profileImageUrl)} alt={c.person.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium line-clamp-1">{c.person.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{c.characterName}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4 max-w-3xl">
              {reviews.map((r) => (
                <div key={r.reviewId} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{r.username}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(r.reviewDate)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.reviewText}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-64 md:w-72 aspect-[2/3] rounded-xl mx-auto md:mx-0 shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex gap-2"><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div>
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-36" /></div>
        </div>
      </div>
    </div>
  );
}
