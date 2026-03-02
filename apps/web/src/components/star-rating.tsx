import { Star } from "lucide-react";

/** Maximum number of stars to display */
const MAX_STARS = 5;

interface StarRatingProps {
  rating: number;
  /** Size class for the star icons */
  size?: "sm" | "md";
  showValue?: boolean;
}

/**
 * Displays a star rating with filled/empty stars.
 * Supports half-star precision visually.
 */
export function StarRating({
  rating,
  size = "sm",
  showValue = false,
}: StarRatingProps) {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_STARS }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={`${iconClass} ${
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30"
            }`}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
