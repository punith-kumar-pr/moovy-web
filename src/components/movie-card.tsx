import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingDisplay } from "@/components/rating-stars";
import { GenreBadge } from "@/components/genre-badge";
import { getImageUrl, truncateText } from "@/lib/utils";
import type { Movie } from "@/types";
import { Calendar, Clock } from "lucide-react";
import { formatDate, formatRuntime } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-card border border-border card-hover">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getImageUrl(movie.imageUrl)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
              {movie.releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(movie.releaseDate)}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>
            {movie.summary && (
              <p className="text-white/70 text-xs leading-relaxed">
                {truncateText(movie.summary, 100)}
              </p>
            )}
          </div>

          {/* Rating badge */}
          {movie.voteAverage > 0 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <RatingDisplay rating={movie.voteAverage} />
            </div>
          )}

          {/* Adult badge */}
          {movie.adult && (
            <div className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-bold text-white">
              18+
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {movie.genres?.slice(0, 2).map((g) => (
              <GenreBadge key={g.id} genre={g.genreName} />
            ))}
            {movie.genres?.length > 2 && (
              <span className="text-xs text-muted-foreground self-center">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
