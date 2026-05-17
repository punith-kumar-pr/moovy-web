import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, Bookmark, BookmarkCheck, Eye, EyeOff, Star, Play, ExternalLink, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { RatingStars, RatingDisplay } from "@/components/rating-stars";
import { moviesApi } from "@/features/movies/movies-api";
import { watchlistApi } from "@/features/watchlist/watchlist-api";
import { watchedApi } from "@/features/watched/watched-api";
import { ratingsApi } from "@/features/ratings/ratings-api";
import { reviewsApi } from "@/features/reviews/reviews-api";
import { useAuthStore } from "@/features/auth/auth-store";
import { formatDate, formatRuntime, getImageUrl, getProfileImageUrl } from "@/lib/utils";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();

  const [reviewText, setReviewText] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);

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

  const { data: myRatings } = useQuery({
    queryKey: ["my-ratings"],
    queryFn: ratingsApi.getMyRatings,
    enabled: isAuthenticated,
  });

  const { data: myReviews } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: reviewsApi.getMyReviews,
    enabled: isAuthenticated,
  });

  const myRating = myRatings?.find((r) => r.movieId === Number(id));
  const myReview = myReviews?.find((r) => r.movieId === Number(id));

  useEffect(() => {
    if (myReview) {
      setReviewText(myReview.reviewText);
    } else {
      setReviewText("");
    }
  }, [myReview]);

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

  const ratingMutation = useMutation({
    mutationFn: (ratingValue: number) => {
      if (myRating) {
        return ratingsApi.update(Number(id), ratingValue);
      } else {
        return ratingsApi.rate(Number(id), ratingValue);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-ratings"] });
      qc.invalidateQueries({ queryKey: ["movies"] });
      toast.success(myRating ? "Rating updated!" : "Rating submitted!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to submit rating"),
  });

  const deleteRatingMutation = useMutation({
    mutationFn: () => ratingsApi.remove(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-ratings"] });
      qc.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Rating removed");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to remove rating"),
  });

  const reviewMutation = useMutation({
    mutationFn: (text: string) => {
      if (myReview) {
        return reviewsApi.update(Number(id), text);
      } else {
        return reviewsApi.create(Number(id), text);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews", "movie", Number(id)] });
      toast.success(myReview ? "Review updated!" : "Review submitted!");
      setIsEditingReview(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to submit review"),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () => reviewsApi.remove(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews", "movie", Number(id)] });
      toast.success("Review deleted");
      setReviewText("");
      setIsEditingReview(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to delete review"),
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

        <Separator className="my-10" />

        {/* Your Rating & Review Section */}
        <section className="mb-10">
          {isAuthenticated ? (
            <div className="p-6 rounded-xl border bg-card/30 backdrop-blur-md space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Your Rating & Review</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating Column */}
                <div className="space-y-3 md:border-r border-border/50 md:pr-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Rating</h3>
                  <div className="flex items-center gap-3">
                    <RatingStars
                      rating={myRating ? myRating.rating : 0}
                      interactive={true}
                      size="lg"
                      onChange={(value) => ratingMutation.mutate(value)}
                    />
                    {myRating && (
                      <span className="text-lg font-bold text-amber-400">
                        {myRating.rating} <span className="text-sm text-muted-foreground">/ 10</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {myRating ? "Click stars to change your rating." : "Click a star to submit your rating (out of 10)."}
                  </p>
                  {myRating && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 px-2"
                      onClick={() => deleteRatingMutation.mutate()}
                      disabled={deleteRatingMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Rating
                    </Button>
                  )}
                </div>

                {/* Review Column */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Review</h3>
                  {myReview && !isEditingReview ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                        {myReview.reviewText}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8"
                          onClick={() => setIsEditingReview(true)}
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit Review
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8"
                          onClick={() => deleteReviewMutation.mutate()}
                          disabled={deleteReviewMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Review
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (reviewText.trim()) {
                          reviewMutation.mutate(reviewText);
                        }
                      }}
                      className="space-y-3"
                    >
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this movie..."
                        className="w-full min-h-[100px] p-3 rounded-lg border bg-background/50 border-input text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={reviewMutation.isPending || !reviewText.trim()}
                          className="gap-1.5 h-8"
                        >
                          {reviewMutation.isPending ? "Saving..." : myReview ? "Update Review" : "Submit Review"}
                        </Button>
                        {isEditingReview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setIsEditingReview(false);
                              setReviewText(myReview ? myReview.reviewText : "");
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border bg-card/20 backdrop-blur-md text-center max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-2">Want to rate and review this movie?</h2>
              <p className="text-sm text-muted-foreground mb-4">Share your rating and thoughts with the Moovy community.</p>
              <Link to={`/login?redirect=/movie/${movie.id}`}>
                <Button size="sm">Sign In to Rate & Review</Button>
              </Link>
            </div>
          )}
        </section>

        <Separator className="my-10" />

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
