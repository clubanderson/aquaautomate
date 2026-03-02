/** localStorage key for the wishlist */
const STORAGE_KEY = "aquaautomate-wishlist";

/** Maximum items allowed in wishlist */
export const MAX_WISHLIST_ITEMS = 50;

/**
 * Get all wishlist product IDs from localStorage.
 * Returns empty array on SSR or if storage is unavailable.
 */
export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Check if a product ID is in the wishlist */
export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}

/** Add a product ID to the wishlist */
export function addToWishlist(productId: string): string[] {
  const list = getWishlist();
  if (list.includes(productId)) return list;
  if (list.length >= MAX_WISHLIST_ITEMS) return list;
  const updated = [...list, productId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("wishlist-change"));
  return updated;
}

/** Remove a product ID from the wishlist */
export function removeFromWishlist(productId: string): string[] {
  const list = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("wishlist-change"));
  return list;
}

/** Toggle a product in/out of the wishlist */
export function toggleWishlist(productId: string): boolean {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
    return false;
  }
  addToWishlist(productId);
  return true;
}

/** Clear the entire wishlist */
export function clearWishlist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("wishlist-change"));
}
