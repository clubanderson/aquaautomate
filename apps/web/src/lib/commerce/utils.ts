import type { NormalizedProduct } from "./types";

/** Returns true when a product has a compare-at price higher than the current price */
export function isOnSale(product: NormalizedProduct): boolean {
  if (!product.compareAtPrice) return false;
  return Number(product.compareAtPrice.amount) > Number(product.price.amount);
}
