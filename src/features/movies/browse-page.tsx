import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { GenreBadge } from "@/components/genre-badge";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { moviesApi } from "@/features/movies/movies-api";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(!!initialGenre);

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: moviesApi.getGenres,
  });

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies", "browse", debouncedQuery, selectedGenre],
    queryFn: () => {
      if (debouncedQuery) return moviesApi.search(debouncedQuery, selectedGenre || undefined);
      if (selectedGenre) return moviesApi.getByGenre(selectedGenre);
      return moviesApi.getAll();
    },
  });

  const totalPages = useMemo(() => Math.ceil((movies?.length || 0) / ITEMS_PER_PAGE), [movies]);
  const paginatedMovies = useMemo(
    () => movies?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [],
    [movies, currentPage]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clearTimeout((window as any).__searchTimeout);
    (window as any).__searchTimeout = setTimeout(() => setDebouncedQuery(value), 400);
  };

  const handleGenreToggle = (genreName: string) => {
    const next = selectedGenre === genreName ? "" : genreName;
    setSelectedGenre(next);
    setCurrentPage(1);
    next ? setSearchParams({ genre: next }) : setSearchParams({});
  };

  const clearFilters = () => {
    setSearchQuery(""); setDebouncedQuery(""); setSelectedGenre(""); setCurrentPage(1); setSearchParams({});
  };

  const hasActiveFilters = debouncedQuery || selectedGenre;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Movies</h1>
        <p className="text-muted-foreground">Discover your next favorite movie</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search movies..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setDebouncedQuery(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {selectedGenre && <span className="ml-1 bg-primary-foreground/20 rounded-full px-2 py-0.5 text-xs">1</span>}
        </Button>
      </div>

      {showFilters && genres && (
        <div className="mb-6 p-4 rounded-lg border bg-card animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Filter by Genre</h3>
            {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">Clear all</Button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <GenreBadge key={g.id} genre={g.genreName} active={selectedGenre === g.genreName} onClick={() => handleGenreToggle(g.genreName)} />
            ))}
          </div>
        </div>
      )}

      {movies && <p className="text-sm text-muted-foreground mb-4">{movies.length} movie{movies.length !== 1 ? "s" : ""} found{selectedGenre && ` in ${selectedGenre}`}{debouncedQuery && ` matching "${debouncedQuery}"`}</p>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : paginatedMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <EmptyState icon={<Search className="h-16 w-16" />} title="No movies found" description={hasActiveFilters ? "Try adjusting your search or filters" : "No movies available"} actionLabel={hasActiveFilters ? "Clear filters" : undefined} onAction={hasActiveFilters ? clearFilters : undefined} />
      )}
    </div>
  );
}
