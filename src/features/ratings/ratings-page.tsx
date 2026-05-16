import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { RatingStars } from "@/components/rating-stars";
import { ratingsApi } from "@/features/ratings/ratings-api";
import { formatDate } from "@/lib/utils";

export function RatingsPage() {
  const qc = useQueryClient();

  const { data: ratings, isLoading } = useQuery({
    queryKey: ["my-ratings"],
    queryFn: ratingsApi.getMyRatings,
  });

  const removeMutation = useMutation({
    mutationFn: ratingsApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-ratings"] }); toast.success("Rating deleted"); },
    onError: () => toast.error("Failed to delete rating"),
  });

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Star className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Ratings</h1>
          <p className="text-muted-foreground">Movies you've rated • {ratings?.length || 0} ratings</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 max-w-2xl">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
      ) : ratings && ratings.length > 0 ? (
        <div className="space-y-3 max-w-2xl">
          {ratings.map((r) => (
            <Card key={r.ratingId} className="group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">{r.rating}</span>
                  </div>
                  <div className="min-w-0">
                    <Link to={`/movie/${r.movieId}`} className="font-medium hover:text-primary transition-colors line-clamp-1">{r.movieTitle}</Link>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={r.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">{formatDate(r.ratingDate)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8 shrink-0" onClick={() => removeMutation.mutate(r.movieId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Star className="h-16 w-16" />} title="No ratings yet" description="Rate movies to keep track of your opinions" actionLabel="Browse Movies" actionHref="/browse" />
      )}
    </div>
  );
}
