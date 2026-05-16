import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { watchlistApi } from "@/features/watchlist/watchlist-api";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export function WatchlistPage() {
  const qc = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: watchlistApi.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: watchlistApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["watchlist"] }); toast.success("Removed from watchlist"); },
    onError: () => toast.error("Failed to remove"),
  });

  const totalPages = useMemo(() => Math.ceil((movies?.length || 0) / ITEMS_PER_PAGE), [movies]);
  const paginated = useMemo(() => movies?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [], [movies, currentPage]);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <p className="text-muted-foreground">Movies you want to watch • {movies?.length || 0} movies</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginated.map((movie) => (
              <div key={movie.id} className="relative group/card">
                <MovieCard movie={movie} />
                <Button variant="destructive" size="icon" className="absolute top-2 left-2 opacity-0 group-hover/card:opacity-100 transition-opacity h-8 w-8 z-10" onClick={(e) => { e.preventDefault(); removeMutation.mutate(movie.id); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <EmptyState icon={<Bookmark className="h-16 w-16" />} title="Your watchlist is empty" description="Start adding movies you want to watch" actionLabel="Browse Movies" actionHref="/browse" />
      )}
    </div>
  );
}
