"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { NormalizedVariant } from "@/lib/commerce/types";

interface VariantSelectorProps {
  variants: NormalizedVariant[];
}

/**
 * Interactive variant selector that stores the selected variant ID
 * in the URL search params (?variant=...) so it survives back/forward.
 */
export function VariantSelector({ variants }: VariantSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("variant") ?? variants[0]?.id;

  const selectVariant = useCallback(
    (variantId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", variantId);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  if (variants.length <= 1) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Options</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          const isUnavailable = !variant.availableForSale;

          return (
            <Badge
              key={variant.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer text-sm px-3 py-1 transition-colors ${
                isSelected
                  ? "bg-aqua text-deep-blue border-aqua"
                  : isUnavailable
                    ? "opacity-50 line-through hover:border-border"
                    : "hover:border-aqua/50"
              }`}
              onClick={() => !isUnavailable && selectVariant(variant.id)}
            >
              {variant.title}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
