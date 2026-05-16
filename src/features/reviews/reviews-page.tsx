import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { reviewsApi } from "@/features/reviews/reviews-api";
import { formatDate, truncateText } from "@/lib/utils";

export function ReviewsPage() {
  const qc = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: reviewsApi.getMyReviews,
  });

  const removeMutation = useMutation({
    mutationFn: reviewsApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-reviews"] }); toast.success("Review deleted"); },
    onError: () => toast.error("Failed to delete review"),
  });

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground">Your movie reviews • {reviews?.length || 0} reviews</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 max-w-3xl">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}</div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {reviews.map((r) => (
            <Card key={r.reviewId} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link to={`/movie/${r.movieId}`} className="font-semibold hover:text-primary transition-colors">{r.movieTitle}</Link>
                      <span className="text-xs text-muted-foreground">• {formatDate(r.reviewDate)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{truncateText(r.reviewText, 300)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8 shrink-0" onClick={() => removeMutation.mutate(r.movieId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FileText className="h-16 w-16" />} title="No reviews yet" description="Share your thoughts about the movies you've watched" actionLabel="Browse Movies" actionHref="/browse" />
      )}
    </div>
  );
}
