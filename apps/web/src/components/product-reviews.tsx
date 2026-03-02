import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { getProductReviews, getReviewSummary } from "@/lib/reviews";
import type { StarRating as StarRatingType } from "@/lib/reviews";

interface ProductReviewsProps {
  productId: string;
}

/** Maximum rating bar width as a percentage */
const MAX_BAR_PCT = 100;

/** Star values for the distribution breakdown, highest first */
const STAR_VALUES: StarRatingType[] = [5, 4, 3, 2, 1];

/**
 * Full product review section with summary stats and individual reviews.
 * Renders nothing if no reviews exist for the product.
 */
export function ProductReviews({ productId }: ProductReviewsProps) {
  const summary = getReviewSummary(productId);
  const reviews = getProductReviews(productId);

  if (!summary || reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Average rating */}
        <div className="flex flex-col items-center rounded-lg border border-border/50 bg-card/50 p-4">
          <span className="text-4xl font-bold text-amber-400">
            {summary.averageRating.toFixed(1)}
          </span>
          <StarRating rating={summary.averageRating} size="md" />
          <span className="mt-1 text-sm text-muted-foreground">
            {summary.totalReviews}{" "}
            {summary.totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-1.5">
          {STAR_VALUES.map((star) => {
            const count = summary.distribution[star];
            const pct =
              summary.totalReviews > 0
                ? (count / summary.totalReviews) * MAX_BAR_PCT
                : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {star}
                  <Star className="ml-0.5 inline h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-xs text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-border/50 bg-card/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-sm font-semibold">{review.title}</span>
              </div>
              {review.verified && (
                <Badge
                  variant="secondary"
                  className="bg-green-600/20 text-[9px] text-green-400"
                >
                  <Check className="mr-0.5 h-2.5 w-2.5" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{review.body}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{review.author}</span>
              <span>&middot;</span>
              <time dateTime={review.date}>
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
