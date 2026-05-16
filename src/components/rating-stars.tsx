import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function RatingStars({
  rating,
  maxRating = 10,
  size = "md",
  interactive = false,
  onChange,
}: RatingStarsProps) {
  // Convert to 5-star scale for display
  const displayStars = 5;
  const normalizedRating = (rating / maxRating) * displayStars;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: displayStars }, (_, i) => {
        const starValue = ((i + 1) / displayStars) * maxRating;
        const fillPercentage = Math.min(
          100,
          Math.max(0, (normalizedRating - i) * 100)
        );

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={cn(
              "relative transition-transform",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            {/* Background star */}
            <Star className={cn(sizeMap[size], "text-muted-foreground/30")} />
            {/* Filled star overlay */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  "fill-amber-400 text-amber-400"
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function RatingDisplay({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-sm">{Number(rating).toFixed(1)}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
