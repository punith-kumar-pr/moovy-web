import { Badge } from "@/components/ui/badge";

interface GenreBadgeProps {
  genre: string;
  onClick?: () => void;
  active?: boolean;
}

export function GenreBadge({ genre, onClick, active }: GenreBadgeProps) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "hover:bg-primary/20 hover:text-primary"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      {genre}
    </Badge>
  );
}
