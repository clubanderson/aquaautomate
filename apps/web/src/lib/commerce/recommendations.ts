import type { NormalizedProduct } from "./types";
import {
  RECOMMENDATION_COUNT,
  RECOMMENDATION_SAME_TYPE_SCORE,
  RECOMMENDATION_SHARED_TAG_SCORE,
  RECOMMENDATION_SAME_WATER_TYPE_SCORE,
  RECOMMENDATION_SAME_VENDOR_SCORE,
} from "@/lib/constants";

/**
 * Score how similar two products are for recommendation purposes.
 * Higher score = more relevant recommendation.
 */
function scoreProduct(
  current: NormalizedProduct,
  candidate: NormalizedProduct
): number {
  let score = 0;

  if (
    current.productType &&
    candidate.productType &&
    current.productType === candidate.productType
  ) {
    score += RECOMMENDATION_SAME_TYPE_SCORE;
  }

  const currentTags = new Set(current.tags || []);
  for (const tag of candidate.tags || []) {
    if (currentTags.has(tag)) {
      score += RECOMMENDATION_SHARED_TAG_SCORE;
    }
  }

  if (
    current.waterType &&
    candidate.waterType &&
    current.waterType === candidate.waterType
  ) {
    score += RECOMMENDATION_SAME_WATER_TYPE_SCORE;
  }

  if (
    current.vendor &&
    candidate.vendor &&
    current.vendor === candidate.vendor
  ) {
    score += RECOMMENDATION_SAME_VENDOR_SCORE;
  }

  return score;
}

/** Get top N recommended products based on similarity scoring */
export function getRecommendations(
  product: NormalizedProduct,
  allProducts: NormalizedProduct[],
  count: number = RECOMMENDATION_COUNT
): NormalizedProduct[] {
  return allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({ product: p, score: scoreProduct(product, p) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((entry) => entry.product);
}
