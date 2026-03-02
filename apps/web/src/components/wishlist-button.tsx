"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

interface WishlistButtonProps {
  productId: string;
  /** Optional additional className */
  className?: string;
}

function subscribeWishlist(callback: () => void) {
  window.addEventListener("wishlist-change", callback);
  return () => window.removeEventListener("wishlist-change", callback);
}

/**
 * Heart toggle button for adding/removing a product from the wishlist.
 * Uses useSyncExternalStore for localStorage reads.
 */
export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const saved = useSyncExternalStore(
    subscribeWishlist,
    () => isInWishlist(productId),
    () => false
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(productId);
    },
    [productId]
  );

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`rounded-full p-1.5 transition-colors ${
        saved
          ? "text-red-400 hover:text-red-300"
          : "text-muted-foreground hover:text-red-400"
      } ${className}`}
    >
      <Heart
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}
