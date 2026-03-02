"use client";

import { useSearchParams } from "next/navigation";
import type { NormalizedVariant } from "@/lib/commerce/types";

interface VariantPriceProps {
  variants: NormalizedVariant[];
  isSoldOut: boolean;
}

/**
 * Displays the price for the currently selected variant (from URL params).
 * Falls back to the first variant if none is selected.
 */
export function VariantPrice({ variants, isSoldOut }: VariantPriceProps) {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("variant") ?? variants[0]?.id;
  const variant = variants.find((v) => v.id === selectedId) ?? variants[0];

  if (!variant) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: variant.price.currencyCode,
  }).format(Number(variant.price.amount));

  const formattedComparePrice =
    variant.compareAtPrice &&
    Number(variant.compareAtPrice.amount) > Number(variant.price.amount)
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: variant.compareAtPrice.currencyCode,
        }).format(Number(variant.compareAtPrice.amount))
      : null;

  return (
    <div className="flex items-baseline gap-2">
      <p className={`text-3xl font-bold ${isSoldOut ? "text-muted-foreground" : "text-aqua"}`}>
        {formattedPrice}
      </p>
      {formattedComparePrice && (
        <p className="text-xl text-muted-foreground line-through">
          {formattedComparePrice}
        </p>
      )}
    </div>
  );
}
