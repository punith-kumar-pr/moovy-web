import { type ReactNode } from "react";
import { Film, Search, BookmarkX, Eye, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const defaultIcons: Record<string, ReactNode> = {
  movies: <Film className="h-16 w-16" />,
  search: <Search className="h-16 w-16" />,
  watchlist: <BookmarkX className="h-16 w-16" />,
  watched: <Eye className="h-16 w-16" />,
  ratings: <Star className="h-16 w-16" />,
  reviews: <FileText className="h-16 w-16" />,
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="mb-6 text-muted-foreground/40">{icon || defaultIcons.movies}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {(actionLabel && actionHref) && (
        <Button onClick={() => navigate(actionHref)} variant="default">
          {actionLabel}
        </Button>
      )}
      {(actionLabel && onAction) && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { defaultIcons };
