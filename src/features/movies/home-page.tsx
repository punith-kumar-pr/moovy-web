import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Play, TrendingUp, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { GenreBadge } from "@/components/genre-badge";
import { moviesApi } from "@/features/movies/movies-api";

export function HomePage() {
  const { data: topRated, isLoading: loadingTop } = useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: moviesApi.getTopRated,
  });

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: moviesApi.getGenres,
  });

  const featured = topRated?.[0];

  return (
    <div className="relative">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="container relative z-10 pt-20 pb-32">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Your ultimate movie companion</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover, Track &{" "}
              <span className="text-gradient">Rate Movies</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Browse thousands of movies, build your watchlist, track what you've watched,
              and share your ratings and reviews with the community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/browse">
                <Button size="lg" className="gap-2 text-base px-8">
                  <Play className="h-5 w-5" /> Start Exploring
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                  Create Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Movie ── */}
      {featured && (
        <section className="container -mt-16 relative z-10 mb-16">
          <Link to={`/movie/${featured.id}`}>
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <div className="aspect-[21/9] md:aspect-[3/1]">
                <img
                  src={featured.imageUrl || "https://placehold.co/1200x400/1a1a2e/7c3aed?text=Featured+Movie"}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">#1 Top Rated</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{featured.title}</h2>
                {featured.tagline && (
                  <p className="text-white/70 text-sm md:text-base italic mb-3">{featured.tagline}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {featured.genres?.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white/80"
                    >
                      {g.genreName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Genre Chips ── */}
      {genres && genres.length > 0 && (
        <section className="container mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse by Genre</h2>
            <Link to="/browse">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Link key={g.id} to={`/browse?genre=${encodeURIComponent(g.genreName)}`}>
                <GenreBadge genre={g.genreName} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Top Rated Grid ── */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Rated Movies</h2>
          <Link to="/browse">
            <Button variant="ghost" size="sm" className="gap-1">
              See more <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loadingTop
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : topRated?.slice(1, 13).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>
      </section>
    </div>
  );
}
