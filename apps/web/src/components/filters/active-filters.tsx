"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProductFilters } from "@/lib/commerce/filters";
import { serializeFilters } from "@/lib/commerce/filters";

interface ActiveFiltersProps {
  filters: ProductFilters;
}

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilters = useCallback(
    (newFilters: ProductFilters) => {
      const qs = serializeFilters(newFilters);
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  const pills: { label: string; onRemove: () => void }[] = [];

  for (const cat of filters.categories) {
    pills.push({
      label: `Category: ${cat}`,
      onRemove: () =>
        updateFilters({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    });
  }

  for (const wt of filters.waterTypes) {
    pills.push({
      label: `Water: ${wt}`,
      onRemove: () =>
        updateFilters({
          ...filters,
          waterTypes: filters.waterTypes.filter((w) => w !== wt),
        }),
    });
  }

  if (filters.priceMin !== undefined) {
    pills.push({
      label: `Min: $${filters.priceMin}`,
      onRemove: () => updateFilters({ ...filters, priceMin: undefined }),
    });
  }

  if (filters.priceMax !== undefined) {
    pills.push({
      label: `Max: $${filters.priceMax}`,
      onRemove: () => updateFilters({ ...filters, priceMax: undefined }),
    });
  }

  if (filters.availability !== "all") {
    pills.push({
      label: `Availability: ${filters.availability}`,
      onRemove: () => updateFilters({ ...filters, availability: "all" }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((pill) => (
        <Badge
          key={pill.label}
          variant="secondary"
          className="cursor-pointer gap-1 text-xs"
          onClick={pill.onRemove}
        >
          {pill.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
