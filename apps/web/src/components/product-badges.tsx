import { Badge } from "@/components/ui/badge";
import { isOnSale } from "@/lib/commerce/utils";
import { BEST_SELLER_TAG, SHOW_EXACT_COUNT_THRESHOLD } from "@/lib/constants";
import type { NormalizedProduct } from "@/lib/commerce/types";

interface ProductBadgesProps {
  product: NormalizedProduct;
  /** "overlay" for card image overlays, "inline" for detail page inline badges */
  variant?: "overlay" | "inline";
}

/** Centralized badge rendering in priority order */
export function ProductBadges({
  product,
  variant = "overlay",
}: ProductBadgesProps) {
  const badges: React.ReactNode[] = [];

  /* Sold Out — highest priority */
  if (product.inventoryStatus === "sold-out") {
    badges.push(
      <Badge
        key="sold-out"
        className="bg-red-600 text-white border-red-700"
      >
        Sold Out
      </Badge>
    );
  }

  /* Low Stock — exact count or generic */
  if (product.inventoryStatus === "low-stock") {
    const qty = product.totalQuantity;
    if (qty !== null && qty !== undefined && qty <= SHOW_EXACT_COUNT_THRESHOLD) {
      badges.push(
        <Badge
          key="low-stock"
          className="bg-amber-600 text-white border-amber-700"
        >
          Only {qty} left
        </Badge>
      );
    } else {
      badges.push(
        <Badge
          key="low-stock"
          className="bg-amber-600 text-white border-amber-700"
        >
          Low Stock
        </Badge>
      );
    }
  }

  /* Sale */
  if (isOnSale(product)) {
    badges.push(
      <Badge
        key="sale"
        className="bg-coral text-white border-coral"
      >
        Sale
      </Badge>
    );
  }

  /* Best Seller */
  if ((product.tags || []).includes(BEST_SELLER_TAG)) {
    badges.push(
      <Badge
        key="best-seller"
        className="bg-yellow-500 text-black border-yellow-600"
      >
        Best Seller
      </Badge>
    );
  }

  /* HA Compatible */
  if (product.automationCompatible) {
    badges.push(
      <Badge
        key="ha-compatible"
        className="bg-deep-blue/80 text-aqua border-aqua/30"
      >
        HA Compatible
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  if (variant === "inline") {
    return <div className="flex flex-wrap gap-1.5">{badges}</div>;
  }

  return <div className="flex flex-wrap gap-1">{badges}</div>;
}
